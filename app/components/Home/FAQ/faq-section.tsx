"use client";

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../ui/Accordion";
import FaqList from "./FaqList";

function FAQ() {
    return (
        <div className="w-full  px-5">
            <div className="container mx-auto">

                {/* FAQ TAG CENTERED */}
                <div className="w-full flex justify-center mb-10">
                    <h1
                        className="
                            text-[16px] md:text-[18px]
                            font-semibold text-gray-700
                            px-8 py-3
                            rounded-full
                            bg-white
                            border border-gray-200
                            shadow-[0px_4px_22px_rgba(0,0,0,0.12)]
                        "
                    >
                        FAQ
                    </h1>
                </div>

                {/* MAIN 2-COLUMN LAYOUT */}
                <div className="flex flex-col md:flex-row gap-16 items-start justify-between">

                    {/* LEFT SIDE — HEADING + SUBTEXT + BUTTON */}
                    <div className="md:w-[45%] flex flex-col items-center md:items-start gap-6">

                        <h4 className="text-3xl md:text-5xl tracking-tighter text-center md:text-left max-w-xl">
                            <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent">
                                REAL{" "}
                            </span>
                            QUESTIONS <br />
                            REAL{" "}
                            <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent">
                                ANSWERS
                            </span>
                        </h4>

                        <p className="text-lg max-w-xl leading-relaxed tracking-tight text-muted-foreground text-center md:text-left">
                         Every question here comes straight from 1:1 conversations with Secure’s clients. We’ve gone beyond generic responses each answer is crafted with the depth and clarity our clients deserve
                        </p>

                      <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="
                                relative group
                                bt-c inter 
                                
                                rounded-xl 
                                px-3 py-3
                                md:text-[15px] 2xl:text-[17px]
                                text-white font-semibold tracking-wide
                                bg-gradient-to-r from-[#2b0f0f] via-[#5c1242] to-[#31217c]
                                shadow-lg hover:shadow-2xl transition-all duration-300
                                overflow-hidden
                            "
                        >
                            <span className="relative z-10">Any Questions?Reach out 📞 </span>

                            {/* Shine animation */}
                            <span
                                className="
                                    absolute inset-0 bg-white/20 
                                    translate-x-[-150%]
                                    group-hover:translate-x-[150%]
                                    transition-transform duration-700
                                "
                                style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}
                            ></span>
                        </motion.button>
                    </div>

                    {/* RIGHT SIDE — ACCORDION */}
                    <div className="md:w-[55%] flex justify-center w-full">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full max-w-[650px]"
                        >
                            {FaqList.map((faq) => (
                                <AccordionItem
                                    key={faq.id}
                                    value={"index-" + faq.id}
                                    className="
                                        border-none my-4 rounded-2xl 
                                        bg-gradient-to-br from-[#f4f4f4] to-[#ffffff]
                                        shadow-md hover:shadow-xl transition-all p-5
                                    "
                                >
                                    <AccordionTrigger
                                        className="
                                            uppercase text-[15px] font-semibold text-gray-700 
                                            py-5 hover:no-underline flex justify-between rounded-xl
                                        "
                                    >
                                        {faq.question}
                                    </AccordionTrigger>

                                    <AccordionContent
                                        className="text-[16px] text-gray-600 leading-relaxed px-2 pb-5 pt-2"
                                    >
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default FAQ;
