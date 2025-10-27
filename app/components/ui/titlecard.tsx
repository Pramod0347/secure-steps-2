"use client"

import type React from "react"

import type { SpringOptions } from "framer-motion"
import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import styled from "styled-components"

interface TiltedCardProps {
  imageSrc: React.ComponentProps<"img">["src"]
  altText?: string
  captionText?: string
  containerHeight?: React.CSSProperties["height"]
  containerWidth?: React.CSSProperties["width"]
  imageHeight?: React.CSSProperties["height"]
  imageWidth?: React.CSSProperties["width"]
  scaleOnHover?: number
  rotateAmplitude?: number
  showMobileWarning?: boolean
  showTooltip?: boolean
  overlayContent?: React.ReactNode
  displayOverlayContent?: boolean
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
}

const TiltedCardFigure = styled.figure<{ $containerHeight: string; $containerWidth: string }>`
  position: relative;
  width: ${(props) => props.$containerWidth};
  height: ${(props) => props.$containerHeight};
  perspective: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const MobileAlert = styled.div`
  position: absolute;
  top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  display: none;

  @media (max-width: 640px) {
    display: block;
  }
`

const TiltedCardInner = styled(motion.div)<{ $imageWidth: string; $imageHeight: string }>`
  position: relative;
  transform-style: preserve-3d;
  width: ${(props) => props.$imageWidth};
  height: ${(props) => props.$imageHeight};
`

const TiltedCardImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  border-radius: 15px;
  will-change: transform;
  transform: translateZ(0);
`

const TiltedCardOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  will-change: transform;
  transform: translateZ(30px);
`

const TiltedCardCaption = styled(motion.figcaption)`
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 4px;
  background-color: #fff;
  padding: 4px 10px;
  font-size: 10px;
  color: #2d2d2d;
  opacity: 0;
  z-index: 3;

  @media (max-width: 640px) {
    display: none;
  }
`

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)
  const opacity = useSpring(0)
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  })

  const [lastY, setLastY] = useState<number>(0)

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

    rotateX.set(rotationX)
    rotateY.set(rotationY)

    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)

    const velocityY = offsetY - lastY
    rotateFigcaption.set(-velocityY * 0.6)
    setLastY(offsetY)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
    opacity.set(1)
  }

  function handleMouseLeave() {
    opacity.set(0)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    rotateFigcaption.set(0)
  }

  return (
    <TiltedCardFigure
      ref={ref}
      $containerHeight={containerHeight.toString()}
      $containerWidth={containerWidth.toString()}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && <MobileAlert>This effect is not optimized for mobile. Check on desktop.</MobileAlert>}

      <TiltedCardInner
        $imageWidth={imageWidth.toString()}
        $imageHeight={imageHeight.toString()}
        style={{
          rotateX,
          rotateY,
          scale,
        }}
        // className="border border-red-500"
      >
        <TiltedCardImage
          src={imageSrc}
          alt={altText}
          className="md:object-cover object-fill! border"
          style={{
            width: imageWidth,
            height: imageHeight,
            // objectFit:"cover"
          }}
        />

        {displayOverlayContent && overlayContent && <TiltedCardOverlay>{overlayContent}</TiltedCardOverlay>}
      </TiltedCardInner>

      {showTooltip && (
        <TiltedCardCaption
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </TiltedCardCaption>
      )}
    </TiltedCardFigure>
  )
}

