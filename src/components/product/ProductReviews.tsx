"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  image: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
  productId: string;
  user: User;
}

interface ProductReviewsProps {
  productSlug: string;
  initialReviews: Review[];
}

export default function ProductReviews({ productSlug, initialReviews }: ProductReviewsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast.error("You must be logged in to leave a review");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setReviews((prevReviews) => {
        // Check if this is an update to an existing review
        const existingReviewIndex = prevReviews.findIndex(
          (review) => review.user.id === session.user.id
        );

        if (existingReviewIndex !== -1) {
          // Update existing review
          const updatedReviews = [...prevReviews];
          updatedReviews[existingReviewIndex] = data.review;
          return updatedReviews;
        } else {
          // Add new review
          return [data.review, ...prevReviews];
        }
      });

      setComment("");
      toast.success("Review submitted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has already reviewed this product
  const userReview = session?.user
    ? reviews.find((review) => review.user.id === session.user.id)
    : null;

  // Pre-fill the form if user has already reviewed
  if (userReview && comment === "") {
    setRating(userReview.rating);
    setComment(userReview.comment || "");
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call to save the review
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset form
      setReviewTitle("");
      setReviewContent("");
      setRating(5);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {session?.user ? (
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {userReview ? "Update Your Review" : "Write a Review"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="mb-2">Rating</p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-muted"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2">Comment</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product..."
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : userReview
                ? "Update Review"
                : "Submit Review"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-card p-6 rounded-lg text-center">
          <p className="mb-4">Please sign in to leave a review.</p>
          <Button asChild>
            <Link href={`/login?callbackUrl=/product/${productSlug}`}>
              Sign In
            </Link>
          </Button>
        </div>
      )}

      <Separator />

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={review.user.image || ""}
                        alt={review.user.name || "User"}
                      />
                      <AvatarFallback>
                        {review.user.name
                          ? review.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= review.rating ? "text-yellow-400" : "text-muted"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span>
              {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmitReview}>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with this product
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Summarize your review"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Review</Label>
                  <Textarea
                    id="content"
                    placeholder="Tell us what you liked or didn't like about this product"
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    required
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="space-y-1 pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={review.user.image || ""} />
                      <AvatarFallback>{review.user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{review.user.name}</CardTitle>
                      <CardDescription>{new Date(review.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-1">{review.comment}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No reviews yet</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Be the first to review this product</Button>
              </DialogTrigger>
              <DialogContent>
                {/* Same review form as above */}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 