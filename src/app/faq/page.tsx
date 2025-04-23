"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// FAQ categories and questions
const faqData = [
  {
    category: "Orders & Payments",
    items: [
      {
        question: "How do I receive my product key after purchase?",
        answer: "After your purchase is completed, you will receive your product key instantly via email. You can also access your keys at any time by logging into your account and viewing your order history."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and cryptocurrencies. All transactions are secured with industry-standard encryption."
      },
      {
        question: "Is it safe to purchase from KeyBookPlus?",
        answer: "Yes, KeyBookPlus is completely safe and legitimate. We use secure payment processors and do not store your payment information. All product keys are sourced from authorized distributors."
      },
      {
        question: "Can I cancel my order?",
        answer: "Due to the digital nature of our products, orders cannot be canceled once the payment is processed. Please make sure to review your order before completing the purchase."
      }
    ]
  },
  {
    category: "Product Keys & Activation",
    items: [
      {
        question: "How do I activate my Windows/Office product key?",
        answer: "For Windows: Go to Settings > Update & Security > Activation > Change product key, then enter your key. For Office: Open any Office application > File > Account > Change Product Key, then enter your key. Detailed activation instructions are also sent with your purchase."
      },
      {
        question: "Why isn't my product key working?",
        answer: "If your key isn't working, please verify that you've entered it correctly without any additional spaces. If the problem persists, please contact our customer support team with your order number for immediate assistance."
      },
      {
        question: "Are your product keys legitimate?",
        answer: "Yes, all our product keys are 100% genuine and sourced from authorized distributors. We guarantee the authenticity and legality of all our products."
      },
      {
        question: "Do the product keys expire?",
        answer: "Most of our product keys do not expire and are valid for the lifetime of the product. For subscription-based products like Office 365, the key will be valid for the specified subscription period."
      }
    ]
  },
  {
    category: "Account & Support",
    items: [
      {
        question: "How do I create an account?",
        answer: "You can create an account by clicking on the 'My Account' button at the top of the page and selecting 'Register'. Fill in your details, and your account will be created instantly."
      },
      {
        question: "I forgot my password. How can I reset it?",
        answer: "Go to the login page and click on 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password."
      },
      {
        question: "How can I contact customer support?",
        answer: "You can reach our customer support team through our Contact page, by email at support@keybookplus.com, or by phone at +1 (123) 456-7890. Our support team is available 24/7 to assist you."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer refunds only in cases where the product key does not work and our technical team confirms the issue. Please contact our support team within 30 days of purchase if you experience any problems."
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter FAQ items based on search query
  const filteredFAQs = faqData.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h1>
      
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>
      
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-300">No FAQs found matching your search. Try different keywords or</p>
          <p className="mt-2">
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>
            {" "}for assistance.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const key = `${categoryIndex}-${itemIndex}`;
                  const isExpanded = expandedItems[key] || false;
                  
                  return (
                    <div 
                      key={itemIndex} 
                      className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
                        onClick={() => toggleItem(categoryIndex, itemIndex)}
                      >
                        <span className="text-white font-medium">{item.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="text-slate-400" size={20} />
                        ) : (
                          <ChevronDown className="text-slate-400" size={20} />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 pt-0 text-slate-300 border-t border-slate-700">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Contact Support Section */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <h2 className="text-xl font-semibold text-white mb-4">Still have questions?</h2>
        <p className="text-slate-300 mb-6">
          If you couldn't find the answer to your question in our FAQ, our friendly support team is here to help.
        </p>
        <Link href="/contact">
          <button className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-md">
            Contact Support
          </button>
        </Link>
      </div>
    </div>
  );
} 