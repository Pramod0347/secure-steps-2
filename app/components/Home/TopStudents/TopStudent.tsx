import { motion } from "framer-motion"
import Image, { StaticImageData } from "next/image"

// student img
import RakshanaImg from "@/app/assets/Students/Rakshana.jpg"
import ShivaImg from "@/app/assets/Students/Shiva.jpg"
import SoujanyaImg from "@/app/assets/Students/Soujanya.jpg"
import { StringToBoolean } from "class-variance-authority/types"


interface ProfileCardProps {
  image: string | StaticImageData
  name: string
  subtitle: string
  position: "left" | "center" | "right"
  classname?: string
  rotation: number
  univerity?:string
}

const ProfileCard = ({
  image,
  name,
  subtitle,
  position,
  classname = "",
  rotation,
  univerity
}: ProfileCardProps) => {
  const positionStyles = {
    left: "translate-y-10",
    center: "translate-y-0",
    right: "translate-y-20",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        transform: `${positionStyles[position]}`,
        rotate: `${rotation}deg`,
        transformOrigin: 'center center',
        boxShadow: '5px 5px 10px 5px rgba(0, 0, 0, 0.1)'
      }}
      className={`relative w-[120px] h-[180px] md:w-[250px] md:h-[330px] 2xl:w-[317px] 2xl:h-[469px] rounded-2xl bg-white p-4 shadow-lg ${classname}`}
    >
      <div className="relative  mx-auto aspect-square w-[60px] h-[60px] md:w-[160px] md:h-[160px] 2xl:w-[244px] 2xl:h-[244px] overflow-hidden rounded-full">
        <Image
          src={image }
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="2xl:mt-10 mt-1 flex flex-col gap-6 items-center text-center">
        <div className="flex flex-col gap-2">
          <h3 className="2xl:text-[24px] md:text-[20px] text-[10px]  2xl:leading-[27.86px] font-semibold">{name}</h3>
          <p className="2xl:text-[18px] md:text-[16px] text-[7px] -mt-1">{subtitle}</p>
        </div>
        <button className="2xl:mt-2 -mt-5 text-[7px] md:text-[16px] 2xl:text-[16px] rounded-[6px] hover:bg-red-500 hover:text-white bg-gray-100 px-4 py-1  ">
         {univerity}
        </button>
      </div>
    </motion.div>
  )
}

const ProfileCards = () => {
  return (
    <div className="relative mx-auto w-screen overflow-x-hidden pb-20 2xl:pb-0 2xl:overflow-hidden  bg-transparent -mt-[90%] 2xl:-mt-[80%] mb-[20%]">
      {/* Curved dotted line with multiple bends */}
      <svg
        className="absolute block left-0 top-1/2 -z-10 h-30 md:h-64 w-full"
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 30 C 200 -100, 400 300, 700 130  1300 -130, 1300 150, 1200 100"
          stroke="#FF0000"
          strokeWidth="2"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
      </svg>
      

      <div className="flex items-center justify-between -mt-10 md:mt-16 2xl:-mt-0 2xl:px-36 md:px-32 md:py-20 2xl:py-20 bg-transparent">
        <ProfileCard
          image={ShivaImg}
          name="ShivaKumar"
          subtitle="MSc International Business"
          univerity="Brunel University, London"
          position="left"
          rotation={-15}
        />
        <ProfileCard
          image={RakshanaImg}
          name="Rakshana"
          subtitle="MS Human Computer Interaction"
          univerity="Georgia Tech University, USA"
          position="center"
          rotation={5}
          classname="mt-[30%]"
        />
        <ProfileCard
          image={SoujanyaImg}
          name="Soujanya"
          subtitle="MSc Accounting & Finance"
          univerity="Queen Mary University, London"
          position="right"
          rotation={15}
        />
      </div>
    </div>
  )
}

export default ProfileCards;

