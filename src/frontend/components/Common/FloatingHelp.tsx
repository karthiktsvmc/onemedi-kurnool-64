
import React, { useState } from 'react';
import { Phone, MessageCircle, HelpCircle, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export const FloatingHelp: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const helpOptions = [
    {
      icon: MessageCircle,
      label: 'Chat with Us',
      action: () => window.open('https://wa.me/919429690055'),
      color: 'bg-[#25D366] hover:bg-[#128C7E]' // WhatsApp green colors
    }
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {isExpanded && helpOptions.map((option, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={option.action}
                className={`w-12 h-12 rounded-full shadow-lg ${option.color} text-white animate-scale-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <option.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{option.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={() => {
                if (!isExpanded) {
                  setIsExpanded(true);
                } else {
                  window.open('tel:+919429690055');
                }
              }}
              className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
                isExpanded ? 'bg-primary hover:bg-primary/90' : 'bg-primary hover:bg-primary/90'
              } text-white`}
            >
              <Phone className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Ask for help</p>
          </TooltipContent>
        </Tooltip>
        
        {isExpanded && (
          <Button
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="w-8 h-8 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
};
