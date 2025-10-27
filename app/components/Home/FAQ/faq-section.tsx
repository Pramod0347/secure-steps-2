import { Check, PhoneCall } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../ui/Accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "../../ui/Badge";
import FaqList from "./FaqList";


function FAQ() {
    return (
        <div className="w-full py-2 lg:pb-20 px-5">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row gap-20">
                    <div className="flex gap-10 flex-col md:w-[50%]">
                        <div className="flex gap-4 flex-col">
                            <div>
                                <h1 className="text-[20px] text-center border border-gray-300 rounded-full p-3 w-[150px] leading-[25.2px] md:text-4xl my-10 md:my-0 uppercase md:font-semibold font-[800] mb-10 mx-auto md:mx-0">
                                    FAQ
                                </h1>
                                {/* <Badge variant="outline">FAQ</Badge> */}
                            </div>
                            <div className="flex gap-2 flex-col">
                                <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center md:text-left font-semibold">
                                    <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block">
                                        REAL&#160;
                                    </span>
                                    QUESTIONS<br />

                                    REAL <span className="bg-gradient-to-r from-[#DA202E] to-[#3B367D] bg-clip-text text-transparent inline-block">
                                        ANSWER&#160;
                                    </span>
                                </h4>
                                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-center  md:text-left">
                                    Every question here comes straight from 1:1 conversations with Secure’s clients. We’ve gone beyond generic responses each answer is crafted with the depth and clarity our clients deserve.
                                </p>
                            </div>
                            <div className="text-center md:text-left">
                                <Button className="gap-4" variant="outline">
                                    Any questions? Reach out <PhoneCall className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Accordion type="single" collapsible className="md:w-full w-[98%] mx-auto md:mx-0">
                        {
                            FaqList.map((faq) => (
                                <AccordionItem key={faq.id} value={"index-" + faq.id}>
                                    <AccordionTrigger className="uppercase text-[13px]">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        }

                    </Accordion>
                </div>
            </div>
        </div>
    );
}

export default FAQ;
