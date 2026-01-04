"use client"

import { OrbitingCircles } from "@/components/ui/orbiting-circles";

// Emoji
import HappyEmoji from "@/app/assets/Emoji/books.png";
import ShockEmoji from "@/app/assets/Emoji/mortarboard.png";
import FunnyEmoji from "@/app/assets/Emoji/plane.png";
import CoolEmoji from "@/app/assets/Emoji/scroll.png";
import LovelyEmoji from "@/app/assets/Emoji/home.png";
import EmailEmoji from "@/app/assets/Emoji/email.png";
import FriendsEmoji from "@/app/assets/Emoji/friends.png";

import Image from "next/image";
import { useEffect, useState } from "react";

const Icons = {
  happy: () => <Image src={HappyEmoji } alt="Happy Emoji" width={60} height={60} />,
  shock: () => <Image src={ShockEmoji } alt="Shock Emoji" width={60} height={60} />,
  cool: () => <Image src={CoolEmoji } alt="Cool Emoji" width={60} height={60} />,
  funny: () => <Image src={FunnyEmoji } alt="Funny Emoji" width={60} height={60} />,
  lovely: () => <Image src={LovelyEmoji } alt="Lovely Emoji" width={60} height={60} />,
  email: () => <Image src={EmailEmoji } alt="Lovely Emoji" width={60} height={60} />,
  friend: () => <Image src={FriendsEmoji } alt="Lovely Emoji" width={60} height={60} />,
};

export function OrbitingCirclesDemo() {
  const [dimensions, setDimensions] = useState({
    radius1: 670,
    radius2: 590,
    radius3: 490,
    titleSize: "text-[72px]",
  });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      
      if (width < 640) { // Mobile
        setDimensions({
          radius1: 220,
          radius2: 180,
          radius3: 140,
          titleSize: "text-[40px]",
        });
      } else if (width < 768) { // Tablet
        setDimensions({
          radius1: 400,
          radius2: 350,
          radius3: 300,
          titleSize: "text-[50px]",
        });
      } else if (width < 1024) { // Small Desktop
        setDimensions({
          radius1: 500,
          radius2: 440,
          radius3: 380,
          titleSize: "text-[60px]",
        });
      } else { // Large Desktop
        setDimensions({
          radius1: 670,
          radius2: 590,
          radius3: 490,
          titleSize: "text-[72px]",
        });
      }
    };

    // Initial update
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="relative flex h-[450px] sm:h-[550px] md:h-[900px] lg:h-[1200px] xl:h-[1500px] 2xl:h-[1800px] w-full max-w-[100vw] flex-col items-center justify-center overflow-hidden">
      {/* <h2 className={`${dimensions.titleSize} absolute top-80  md:static md:top-0  font-bold text-center md:-mt-[30%]`}>
        Top Students<br/> Placed
      </h2> */}
      
      
      <div className="absolute top-[10%] md:top-36 mx-auto">
        
        <OrbitingCircles
          iconSize={30}
          radiusX={dimensions.radius1}
          shape="ellipse"
          verticalStretch={1.1}
          reverse
          speed={1.5}
        >
          <Icons.shock />
          <Icons.email />
         
        </OrbitingCircles>
      </div>

      <div className="absolute top-[15%] md:top-48 mx-auto">
        <OrbitingCircles
          iconSize={30}
          radiusX={dimensions.radius2}
          shape="ellipse"
          verticalStretch={1.1}
          reverse
          speed={1}
        >
          <Icons.funny />
          <Icons.friend />
        </OrbitingCircles>
      </div>

      <div className="absolute top-[20%] md:top-60 mx-auto">
        <OrbitingCircles
          iconSize={30}
          radiusX={dimensions.radius3}
          shape="ellipse"
          verticalStretch={1.1}
          reverse
          speed={1}
        >
           <Icons.cool />
          <Icons.lovely />
        </OrbitingCircles>
      </div>
    </div>
  );
}
