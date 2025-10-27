"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Observer } from "gsap/Observer"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer)
}

interface HorizontalScrollingTextProps {
  text?: string
  speed?: number
}

export default function HorizontalScrollingText({
  text = "PRICING DESIGNED FOR AFFORDABILITY",
  speed = 1,
}: HorizontalScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const separator = " ▪ "

  // Function to apply gradient to the last word
  const getStyledText = (sentence: string) => {
    const words = sentence.split(" ")
    const lastWord = words.pop()
    const remainingText = words.join(" ")

    return (
      <>
        <span className="text-black">&#160;{remainingText}&#160;</span>
        <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block">
          {lastWord}&#160;
        </span>
      </>
    )
  }

  // GSAP horizontal loop function
  const horizontalLoop = (items: Element[], config: any): gsap.core.Timeline => {
    const itemsArray = gsap.utils.toArray<HTMLElement>(items as HTMLElement[])
    config = config || {}

    let tl: gsap.core.Timeline

    const loop = () => {
      tl = gsap.timeline({
        repeat: config.repeat || -1,
        paused: config.paused || false,
        defaults: { ease: "none" },
        onReverseComplete: () => {
          tl.totalTime(tl.rawTime() + tl.duration() * 100)
        },
      })

      const length = itemsArray.length
      const startX = itemsArray[0].offsetLeft
      const times: number[] = []
      const widths: number[] = []
      const xPercents: number[] = []
      const curIndex = 0
      const pixelsPerSecond = (config.speed || 1) * 100
      const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1)

      let totalWidth: number, curX: number, distanceToStart: number, distanceToLoop: number, item: HTMLElement

      // Set initial xPercent and populate widths/xPercents arrays
      gsap.set(itemsArray, {
        xPercent: (i, el) => {
          const w = (widths[i] = Number.parseFloat(gsap.getProperty(el, "width", "px") as string))
          xPercents[i] = snap(
            (Number.parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
              Number.parseFloat(gsap.getProperty(el, "xPercent") as string),
          )
          return xPercents[i]
        },
      })

      gsap.set(itemsArray, { x: 0 })

      totalWidth =
        itemsArray[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        itemsArray[length - 1].offsetWidth *
          Number.parseFloat(gsap.getProperty(itemsArray[length - 1], "scaleX") as string) +
        (Number.parseFloat(config.paddingRight) || 0)

      for (let i = 0; i < length; i++) {
        item = itemsArray[i]
        curX = (xPercents[i] / 100) * widths[i]
        distanceToStart = item.offsetLeft + curX - startX
        distanceToLoop = distanceToStart + widths[i] * Number.parseFloat(gsap.getProperty(item, "scaleX") as string)

        tl.to(
          item,
          {
            xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
            duration: distanceToLoop / pixelsPerSecond,
          },
          0,
        )
          .fromTo(
            item,
            { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
            {
              xPercent: xPercents[i],
              duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
              immediateRender: false,
            },
            distanceToLoop / pixelsPerSecond,
          )
          .add("label" + i, distanceToStart / pixelsPerSecond)

        times[i] = distanceToStart / pixelsPerSecond
      }

      return tl
    }

    tl = loop()

    let curIndex = 0
    const times: number[] = []

    function toIndex(index: number, vars: gsap.TweenVars = {}) {
      vars = vars || {}
      Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length) // always go in the shortest direction

      const newIndex = gsap.utils.wrap(0, length, index)
      let time = times[newIndex]

      if (time > tl.time() !== index > curIndex) {
        // if we're wrapping the timeline's playhead, make the proper adjustments
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
        time += tl.duration() * (index > curIndex ? 1 : -1)
      }

      curIndex = newIndex
      vars.overwrite = true

      return tl.tweenTo(time, vars)
    }

    // Add custom methods to the timeline
    const tlWithMethods = tl as gsap.core.Timeline & {
      next: (vars?: gsap.TweenVars) => gsap.core.Tween
      previous: (vars?: gsap.TweenVars) => gsap.core.Tween
      current: () => number
      toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween
      times: number[]
    }

    tlWithMethods.next = (vars: gsap.TweenVars = {}) => toIndex(curIndex + 1, vars)
    tlWithMethods.previous = (vars: gsap.TweenVars = {}) => toIndex(curIndex - 1, vars)
    tlWithMethods.current = () => curIndex
    tlWithMethods.toIndex = (index: number, vars: gsap.TweenVars = {}) => toIndex(index, vars)
    tlWithMethods.times = times

    tlWithMethods.progress(1, true).progress(0, true) // pre-render for performance

    if (config.reversed) {
      const onReverseComplete = tlWithMethods.vars.onReverseComplete
      if (typeof onReverseComplete === "function") {
        onReverseComplete()
      }
      tlWithMethods.reverse()
    }

    return tlWithMethods
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Create enough text elements for the loop
    const textElements = Array.from(containerRef.current.querySelectorAll(".rail h4"))

    if (textElements.length === 0) return

    // Create the horizontal loop
    timelineRef.current = horizontalLoop(textElements, {
      repeat: -1,
      speed: speed,
      paddingRight: 30,
    })

    // Add scroll observer for speed control
    const observer = Observer.create({
      onChangeY(self) {
        if (!timelineRef.current) return

        let factor = 2.5
        if (self.deltaY < 0) {
          factor *= -1
        }

        gsap
          .timeline({
            defaults: {
              ease: "none",
            },
          })
          .to(timelineRef.current, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
          .to(timelineRef.current, { timeScale: factor / 2.5, duration: 1 }, "+=0.3")
      },
    })

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      observer.kill()
    }
  }, [speed, text])

  // Create repeated text elements
  const repeatedText = Array(5)
    .fill(null)
    .map((_, index) => (
      <h4 key={index} className="whitespace-nowrap text-3xl md:text-5xl lg:text-6xl font-bold">
        {getStyledText(text)}
        {separator}
      </h4>
    ))

  return (
    <div className="w-screen overflow-x-hidden">
      <div
        className="scrolling-text w-full overflow-hidden flex items-center"
        style={{ height: "100px" }}
        ref={containerRef}
      >
        <div className="rail flex">{repeatedText}</div>
      </div>
    </div>
  )
}

