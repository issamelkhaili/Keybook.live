import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  productId: string;
}

interface ProductFaqProps {
  faqs: FAQ[];
}

export default function ProductFaq({ faqs }: ProductFaqProps) {
  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No FAQs available for this product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
} 