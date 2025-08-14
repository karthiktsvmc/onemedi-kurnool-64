import React from 'react';
import { Clock, User, Bookmark, Share } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DiabetesArticle } from '@/frontend/data/mockDiabetesCareData';

interface ArticleCardProps {
  article: DiabetesArticle;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
      {/* Article Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {article.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors">
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors">
            <Share className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Article Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} read</span>
            </div>
          </div>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>

        {/* Read More Button */}
        <Button variant="outline" className="w-full" size="sm">
          Read Article
        </Button>
      </div>
    </div>
  );
};