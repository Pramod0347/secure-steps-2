import { useState } from "react";

// Type definitions
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  faqData?: FAQItem[];
}

interface AccordionProps {
  children: React.ReactNode;
  type?: string;
  collapsible?: boolean;
  className?: string;
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  isOpen: boolean;
}

interface AccordionContentProps {
  children: React.ReactNode;
  isOpen: boolean;
}

// Mock Accordion components since we don't have shadcn/ui
const Accordion: React.FC<AccordionProps> = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const AccordionItem: React.FC<AccordionItemProps> = ({ children }) => (
  <div className="border-b border-gray-200">{children}</div>
);

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className = "", onClick, isOpen }) => (
  <button
    className={`w-full text-left py-4 px-2 flex justify-between items-center hover:bg-gray-50 transition-colors ${className}`}
    onClick={onClick}
  >
    <span>{children}</span>
    <svg
      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

const AccordionContent: React.FC<AccordionContentProps> = ({ children, isOpen }) => (
  <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
    <div className="px-2 text-gray-600 leading-relaxed">
      {children}
    </div>
  </div>
);

const FAQ: React.FC<FAQProps> = ({ faqData = [] }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);


  console.log("faqData :",faqData)

  const toggleItem = (value: string): void => {
    setOpenItem(openItem === value ? null : value);
  };

  // Default FAQ data if none provided
  const defaultFaqData: FAQItem[] = [
    {
      id: 1,
      question: "What services do you offer?",
      answer: "We provide comprehensive security solutions including risk assessment, implementation of security protocols, and ongoing monitoring services."
    },
    {
      id: 2,
      question: "How do you ensure data privacy?",
      answer: "We follow industry-standard encryption protocols and maintain strict access controls. All data is handled according to GDPR and other relevant privacy regulations."
    },
    {
      id: 3,
      question: "What is your response time for security incidents?",
      answer: "Our team responds to critical security incidents within 15 minutes, with full escalation procedures in place for different severity levels."
    },
    {
      id: 4,
      question: "Do you provide 24/7 monitoring?",
      answer: "Yes, we offer round-the-clock monitoring services with our dedicated security operations center staffed by certified professionals."
    },
    {
      id: 5,
      question: "How do you handle compliance requirements?",
      answer: "We help organizations meet various compliance standards including SOC 2, ISO 27001, HIPAA, and PCI DSS through tailored security frameworks."
    }
  ];

  const faqs: FAQItem[] = faqData.length > 0 ? faqData : defaultFaqData;

  return (
    <div className="w-full py-8 lg:py-20 px-5">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services and solutions.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq: FAQItem) => {
            const itemValue = `index-${faq.id}`;
            const isOpen = openItem === itemValue;
            
            return (
              <AccordionItem key={faq.id} value={itemValue}>
                <AccordionTrigger
                  className="text-sm md:text-base font-medium"
                  onClick={() => toggleItem(itemValue)}
                  isOpen={isOpen}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent isOpen={isOpen}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

      
      </div>
    </div>
  );
};

export default FAQ;