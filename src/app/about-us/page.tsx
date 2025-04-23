import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">About KeyBookPlus</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-slate-300 mb-6">
            Founded in 2022, KeyBookPlus quickly became a trusted name in the digital key marketplace. 
            We specialize in providing genuine software licenses, game keys, and digital content at 
            competitive prices.
          </p>
          
          <p className="text-slate-300 mb-6">
            Our mission is to make premium software and games accessible to everyone through a secure, 
            reliable, and user-friendly platform. We partner directly with publishers and authorized 
            distributors to guarantee the authenticity of every product.
          </p>
          
          <p className="text-slate-300 mb-6">
            At KeyBookPlus, customer satisfaction is our top priority. We offer instant digital delivery, 
            secure payment options, and dedicated customer support to ensure a seamless shopping experience.
          </p>
          
          <div className="mt-8">
            <Link href="/contact">
              <Button>Contact Us</Button>
            </Link>
          </div>
        </div>
        
        <div className="relative h-[300px] md:h-auto rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">KeyBookPlus</span>
          </div>
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Why Choose KeyBookPlus</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">100% Secure</h3>
            <p className="text-slate-300">
              All transactions are secured with industry-standard encryption. Your personal information is always protected.
            </p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Delivery</h3>
            <p className="text-slate-300">
              Receive your product keys instantly after purchase. No waiting, start using your software or games immediately.
            </p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
            <p className="text-slate-300">
              Our customer service team is available around the clock to assist you with any questions or issues.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <Mail className="text-primary mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
              <p className="text-slate-300">support@keybookplus.com</p>
              <p className="text-slate-300">info@keybookplus.com</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <Phone className="text-primary mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
              <p className="text-slate-300">+1 (123) 456-7890</p>
              <p className="text-slate-300">Monday to Friday, 9am - 5pm</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <MapPin className="text-primary mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Address</h3>
              <p className="text-slate-300">
                123 Digital Avenue<br />
                Tech City, TC 12345<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 