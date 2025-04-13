"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample product data
const productData = {
  id: "windows-11-pro",
  title: "Windows 11 Pro Cd Key OEM Microsoft Global",
  price: "$4.99",
  rating: 5,
  reviewCount: 267,
  inStock: true,
  platform: "Windows",
  platformIcon: "https://ext.same-assets.com/3893671847/1513979826.png",
  rewardPoints: 5,
  images: [
    "https://ext.same-assets.com/3893671847/4214474036.jpeg",
    "https://ext.same-assets.com/3893671847/3205726074.jpeg",
    "https://ext.same-assets.com/3893671847/175483935.jpeg",
    "https://ext.same-assets.com/3893671847/761505715.jpeg",
    "https://ext.same-assets.com/3893671847/3817857895.jpeg",
  ],
  description: `
    <p class="mb-2"><strong>Available Languages: MULTILANGUAGE</strong></p>
    <p class="mb-2">invoice will automatically generate upon placing an order</p>
    <p class="mb-2"><strong>This key can be used again if OS is reinstalled/formatted only if you link it to your Microsoft account (we can send instructions).</strong></p>
    <p class="mb-2"><strong>The key will work on an inactivated working Win11 Pro or a clean installation of Windows 11 Pro.</strong></p>
    <p class="mb-2"><strong>For instructions on upgrading from Windows 11 Home to Pro, please contact our support team.</strong></p>
    <p class="mb-2"><strong>Russian, English, German, French, Italian, Spanish, Turkish, Czech, Polish, Japanese, Chinese, Korean and others.</strong></p>
    <p class="mb-2"><strong>Windows 11 Pro OEM</strong></p>
    <p class="mb-2"><strong>Download link: <a href="https://www.microsoft.com/software-download/windows11" class="text-primary hover:underline">https://www.microsoft.com/software-download/windows11</a></strong></p>
    <p class="mb-2"><strong>In order to install the software on your PC, please follow the instructions <a href="#" class="text-primary hover:underline">here</a>.</strong></p>
  `,
  faq: [
    {
      question: "Will I get an invoice?",
      answer: "Invoice will automatically generate upon placing an order."
    },
    {
      question: "Where can I find my invoice?",
      answer: "Once order is completed, the invoice will be under \"my account\" (top right corner of the top bar)->\"Order History\"."
    },
    {
      question: "Can I edit my invoice?",
      answer: "Currently you cannot do it yourself, but please contact our support via mail at support@gamers-outlet.net and we will be glad to assist on the matter. For faster process, please try to add the order number and full info you want to be shown (name, id/tax number etc\\`...)."
    },
    {
      question: "Can I install this on MacOs?",
      answer: "No, This product does not support MacOs."
    },
    {
      question: "Can I redeem this Product from anywhere?",
      answer: "Yes, this Product is a Global version."
    },
    {
      question: "Can I transfer this software to a new hardware?",
      answer: "Yes, this key can be used again if the OS or software is reinstalled or formatted, if the key is bind to your Microsoft account. For instructions, please contact our support at support@gamers-outlet.net"
    },
  ],
  activation: `
    <p class="mb-4"><strong>In case of an issue with activating your Windows key, please use one of the methods:</strong></p>
    <div class="mb-4">
      <p class="font-semibold mb-2">Method 1:</p>
      <p>Download link: <a href="https://www.microsoft.com/software-download/windows11" class="text-primary hover:underline">https://www.microsoft.com/software-download/windows11</a> Download the installation kit media creation tool on a bootable device like dvd or usb stick. After Windows installation:</p>
      <ol class="list-decimal pl-5 mt-2 space-y-1">
        <li>Go to "Settings''</li>
        <li>Find "Activation"</li>
        <li>Select "Activate" or "Change Product Key"</li>
        <li>Insert the purchased key</li>
        <li>Windows 11 Pro is operational</li>
      </ol>
    </div>
    <div class="mb-4">
      <p class="font-semibold mb-2">Method 2:</p>
      <ol class="list-decimal pl-5 space-y-1">
        <li>Click on Start icon, then open Settings, choose Update & security, and then select Activation.</li>
        <li>Choose the Activate by phone option.</li>
        <li>Click the drop-down menu, select your country, and then click Next.</li>
        <li>Call the Toll free number and follow instructions to generate confirmation ID to activate your Windows.</li>
      </ol>
    </div>
    <div class="mb-4">
      <p class="font-semibold mb-2">Method 3:</p>
      <ol class="list-decimal pl-5 space-y-1">
        <li>Press and hold "Windows" key and press "R" on your keyboard.</li>
        <li>Type "SLUI 4" in the window that pops up and press enter.</li>
        <li>Click the drop-down menu, select your country and then click Next.</li>
        <li>Call the Toll free number and follow instructions to generate confirmation ID to activate your Windows.</li>
      </ol>
    </div>
  `,
  reviews: [
    {
      id: 1,
      author: "Verified Customer",
      rating: 5,
      date: "25/03/2024",
      comment: "Excellent service, key was delivered instantly and worked perfectly."
    },
    {
      id: 2,
      author: "John D.",
      rating: 5,
      date: "18/03/2024",
      comment: "Great price and easy activation. Would buy again."
    },
    {
      id: 3,
      author: "Sarah T.",
      rating: 4,
      date: "10/03/2024",
      comment: "Good value for money, activation instructions were clear."
    },
  ],
  relatedProducts: [
    {
      id: 1,
      title: "Microsoft Office 2019 Professional Plus Cd Key",
      image: "/images/office-2019.jpg",
      price: "$17.79",
      rating: 5,
      inStock: true,
      href: "/product/office-2019-pro",
    },
    {
      id: 2,
      title: "Office 2021 Professional Plus Cd Key Digital Download",
      image: "/images/office-2021.jpg",
      price: "$18.89",
      rating: 5,
      inStock: true,
      href: "/product/office-2021-pro",
    },
    {
      id: 3,
      title: "Kaspersky Total Security 1 year 1 PC Key Global",
      image: "/images/kaspersky.jpg",
      price: "$14.44",
      rating: 5,
      inStock: true,
      href: "/product/kaspersky-security",
    },
    {
      id: 4,
      title: "XBOX Game Pass Ultimate - 3 Month Cd Key",
      image: "/images/xbox-gamepass.jpg",
      price: "$29.90",
      rating: 5,
      inStock: true,
      href: "/product/xbox-gamepass",
    },
  ],
};

// Payment methods
const paymentMethods = [
  { name: "cards", icon: "https://ext.same-assets.com/3893671847/444358157.png" },
  { name: "klarna", icon: "https://ext.same-assets.com/3893671847/2711958405.jpeg" },
  { name: "GPay", icon: "https://ext.same-assets.com/3893671847/3808216946.jpeg" },
  { name: "Apple Pay", icon: "https://ext.same-assets.com/3893671847/2803583622.jpeg" },
  { name: "affirm", icon: "https://ext.same-assets.com/3893671847/131439401.jpeg" },
  { name: "afterpay", icon: "https://ext.same-assets.com/3893671847/2588373062.jpeg" },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productData.images.length) % productData.images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6 text-slate-400">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-slate-200">{productData.title}</span>
        </div>

        {/* Product info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product images */}
          <div>
            <div className="mb-4 relative bg-slate-800 rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <div
                  className="w-full h-full relative"
                  style={{
                    backgroundImage: `url(${productData.images[currentImageIndex]})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>
              {/* Image navigation */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-10"
                onClick={prevImage}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-10"
                onClick={nextImage}
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Thumbnail images */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => selectImage(index)}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{productData.title}</h1>

            {/* Ratings and reviews */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < productData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
                  />
                ))}
              </div>
              <Link href="#reviews" className="ml-2 text-sm text-slate-300 hover:text-primary">
                {productData.reviewCount} reviews
              </Link>
            </div>

            {/* Product meta data */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-slate-400 w-24">Platform:</span>
                <div className="flex items-center">
                  <span className="mr-2">{productData.platform}</span>
                  <img src={productData.platformIcon} alt={productData.platform} className="h-5" />
                </div>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-slate-400 w-24">Reward Points:</span>
                <span>{productData.rewardPoints}</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-slate-400 w-24">Availability:</span>
                <span className={productData.inStock ? "text-green-500" : "text-red-500"}>
                  {productData.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-slate-400 w-24">Works in:</span>
                <span>your country</span>
              </div>
            </div>

            {/* Price and add to cart */}
            <div className="bg-slate-800 p-6 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-primary">{productData.price}</h2>
                  <p className="text-sm text-slate-400">Price in reward points: 499</p>
                </div>
                <img src="https://ext.same-assets.com/3893671847/1610286346.png" alt="Microsoft" className="h-12" />
              </div>

              {/* Options */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Available Options</h3>
                <div className="mb-4">
                  <label className="text-sm text-slate-300 mb-1 block">Windows 11 options</label>
                </div>
              </div>

              {/* Quantity and add to cart */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 text-white border-slate-600"
                    onClick={decreaseQuantity}
                  >
                    -
                  </Button>
                  <div className="w-12 text-center">{quantity}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 text-white border-slate-600"
                    onClick={increaseQuantity}
                  >
                    +
                  </Button>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white w-full flex items-center justify-center">
                  <ShoppingCart size={18} className="mr-2" />
                  ADD TO CART
                </Button>
              </div>
            </div>

            {/* Payment methods */}
            <div className="flex flex-wrap gap-2 mb-6">
              {paymentMethods.map((method, index) => (
                <img key={index} src={method.icon} alt={method.name} className="h-7" />
              ))}
            </div>
          </div>
        </div>

        {/* Product tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid grid-cols-4 mb-6 bg-slate-800">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="activation">Activation</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({productData.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="bg-slate-800 p-6 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: productData.description }} />
          </TabsContent>

          <TabsContent value="faq" className="bg-slate-800 p-6 rounded-lg">
            <div className="space-y-6">
              {productData.faq.map((item, index) => (
                <div key={index} className="border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium text-primary mb-2">{item.question}</h3>
                  <p className="text-slate-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activation" className="bg-slate-800 p-6 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: productData.activation }} />
          </TabsContent>

          <TabsContent value="reviews" className="bg-slate-800 p-6 rounded-lg" id="reviews">
            <h3 className="text-xl font-bold mb-6">Review Score: {productData.rating}/5</h3>
            <div className="space-y-6">
              {productData.reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{review.author}</h4>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">{review.date}</span>
                  </div>
                  <p className="text-slate-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productData.relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
  return (
    <Card className="product-card bg-slate-800 border-slate-700 overflow-hidden">
      <Link href={product.href}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          {/* Stock label */}
          <div className={`absolute top-2 left-2 ${product.inStock ? "in-stock" : "out-of-stock"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        {/* Rating */}
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>

        {/* Title */}
        <Link href={product.href}>
          <h3 className="text-sm text-white font-medium hover:text-primary transition-colors line-clamp-2 h-10">
            {product.title}
          </h3>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="product-price">{product.price}</span>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
          BUY NOW
        </Button>
      </CardFooter>
    </Card>
  );
}
