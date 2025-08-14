import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Star, MessageSquare, Flag, ThumbsUp } from 'lucide-react';
import { Progress } from '@/shared/components/ui/progress';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

interface RatingBreakdown {
  rating: number;
  count: number;
  percentage: number;
}

interface RatingReviewsProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown[];
  reviews: Review[];
  onWriteReview: () => void;
  onReportReview: (reviewId: string) => void;
  onMarkHelpful: (reviewId: string) => void;
}

export const RatingReviews: React.FC<RatingReviewsProps> = ({
  averageRating,
  totalReviews,
  ratingBreakdown,
  reviews,
  onWriteReview,
  onReportReview,
  onMarkHelpful
}) => {
  const [filterRating, setFilterRating] = useState<string>('all');

  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filterRating));

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSize} ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            Ratings & Reviews
          </div>
          <Button onClick={onWriteReview} size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Write Review
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">{averageRating}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating), 'md')}
            </div>
            <p className="text-sm text-muted-foreground">{totalReviews} reviews</p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {ratingBreakdown.map((breakdown) => (
              <div key={breakdown.rating} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{breakdown.rating}★</span>
                <Progress value={breakdown.percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {breakdown.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Filter by rating:</span>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{review.userName}</span>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReportReview(review.id)}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-foreground mb-3">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkHelpful(review.id)}
                  className="text-sm"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-foreground mb-3">Have a question about this medicine?</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Ask a Question
            </Button>
            <Button variant="outline" size="sm">
              Report an Issue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};