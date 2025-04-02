"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { animations, gradients } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { ChevronDown, Mail, Phone, MessageSquare } from "lucide-react"

// Sample FAQs
const faqs = [
  {
    question: "How do I activate my product key?",
    answer: "After purchase, you'll receive your key via email. Follow the activation instructions included in the email. Generally, you'll need to enter the key in the software's activation section or during installation."
  },
  {
    question: "Is there a refund policy?",
    answer: "We offer a 30-day money-back guarantee if the product key doesn't work. However, we cannot provide refunds once a key has been successfully activated."
  },
  {
    question: "How long does delivery take?",
    answer: "Digital keys are usually delivered immediately after payment confirmation. In some cases, it might take up to 15 minutes. If you don't receive your key within an hour, please contact our support team."
  },
  {
    question: "Can I use the same key on multiple devices?",
    answer: "Most product keys are limited to a single installation. Please check the product description for specific licensing terms."
  },
  {
    question: "Do you offer bulk discounts?",
    answer: "Yes, we offer discounts for bulk purchases. Please contact our sales team for more information about volume licensing."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum."
  }
]

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real application, you would send this data to your backend
    console.log("Form submitted:", formData)
    
    toast({
      title: "Message Sent",
      description: "We've received your message and will respond shortly.",
    })
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    })
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }
  
  return (
    <div className="container py-10">
      <h1 className={cn("text-3xl font-bold mb-2 text-center", gradients.text)}>
        Support Center
      </h1>
      <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        Need help with your purchase? Browse our FAQ section below or reach out to our support team.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* FAQs Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find quick answers to our most common questions.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={cn(
                  "rounded-lg border border-border overflow-hidden bg-card",
                  expandedFaq === index ? "shadow-sm" : "",
                  animations.card
                )}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    expandedFaq === index ? "rotate-180" : ""
                  )} />
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-muted-foreground">
                    <div className="pt-2 border-t border-border">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Form */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Send us a message.
            </p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="What is your message about?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Button type="submit" className={cn("w-full", animations.button)}>
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Alternative Contact Methods */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card text-center">
              <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium text-sm mb-1">Email</div>
              <a href="mailto:support@keybook.live" className="text-xs text-muted-foreground hover:text-primary">
                support@keybook.live
              </a>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card text-center">
              <Phone className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium text-sm mb-1">Phone</div>
              <div className="text-xs text-muted-foreground">
                +1 (555) 123-4567
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-border bg-card text-center">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium text-sm mb-1">Live Chat</div>
              <div className="text-xs text-muted-foreground">
                Available 24/7
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 