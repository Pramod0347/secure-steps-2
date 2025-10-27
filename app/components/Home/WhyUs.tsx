import React from "react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const WhyUs = () => {
  return (
    <div className=" flex flex-col items-center justify-center md:w-[90%] w-[100%] py-20">
      {/* why choose us ? */}
      <div className="flex flex-col items-center justify-center w-full mb-10 gap-6 px-8">
        <h1 className="text-[20px] md:text-[48px] leading-[25.2px] sm:text-4xl font-[800] text-center">
          Why Choose Secure?
        </h1>
        <p className="text-center text-[12px] md:text-[18px] md:leading-[24px] leading-[17px] md:w-7/12">
          Lorembit Ipsumus needum a mobilo appum that tracker actives and
          providum personized workouts plan
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Row 1 */}
        <div className="md:flex md:flex-row flex gap-3 md:h-[400px]">
          {/* Card 1 */}
          <div className="p-3 md:p-5 w-[171px] h-[260px] md:pt-10 md:w-[30%] md:h-full rounded-[15.51px] bg-[#D4D4D4] md:rounded-[26px]  hover:text-white cursor-pointer z-[9999]">
            <h1 className="lg:text-[26px] md:text-[21px] text-[15.5px] font-[700]">
              Lorembit Ipsumus
            </h1>
            <p className="font-[500] lg:text-[16px] md:text-[14px] text-[9.54px] leading-[14.31px] md:leading-[24px] mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Card 2 */}
          <div className="items-end w-[171px] h-[373px] md:h-full px-6 md:pt-6 flex flex-col md:flex-row gap-4 md:w-[80%] relative rounded-[11.86px] bg-[#808080] md:rounded-[26px] md:p-5  cursor-pointer">
            {/* <Image
              src={free}
              className="h-full md:h-[95%] object-contain absolute left-[-15%] xl:left-[-25%] bottom-0 hidden md:block"
              alt=""
            />
            <Image src={VRManImg} className="md:hidden block my-3" alt="" /> */}

            {/* <div className="absolute md:w-full w-[400px] h-full left-[-75%]  md:left-[-35%] -top-20 md:top-0">
              <DotLottieReact
                src="/Normal-Flight.lottie"
                autoplay
                loop
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  
                }}
              />
            </div> */}

            <div className="py-8 px-4 absolute bottom-0 right-0 text-lg md:w-[70%] mt-2">
              <h1 className="md:text-[26px] text-[13px] leading-[19px] font-[700] text-white">
                Lorembit Ipsumus
              </h1>
              <p className="text-white font-[500] lg:text-[20px] md:text-[16px] text-[10px] md:leading-[24px] leading-[15px] lg:leading-[30px] mt-2">
                Lorembit Ipsumus needum a mobilo appum that tracker actives and
                providum personized workouts planLorembit Ipsumus needum tracker
                actives and providum personized workouts plan
              </p>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        
      </div>
    </div>
  );
};

export default WhyUs;