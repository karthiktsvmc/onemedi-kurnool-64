import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { DateSlot, TimeSlot } from '@/frontend/data/mockCheckoutData';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface SlotSelectorProps {
  dateSlots: DateSlot[];
  selectedSlot?: { date: string; time: string };
  onSlotSelect: (date: string, slot: TimeSlot) => void;
  serviceType: 'lab' | 'doctor' | 'homecare' | 'delivery';
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  dateSlots,
  selectedSlot,
  onSlotSelect,
  serviceType
}) => {
  const [selectedDate, setSelectedDate] = useState(dateSlots[0]?.date || '');

  const getServiceTitle = () => {
    switch (serviceType) {
      case 'lab': return 'Lab Test Collection Slot';
      case 'doctor': return 'Doctor Consultation Slot';
      case 'homecare': return 'Home Care Service Slot';
      case 'delivery': return 'Delivery Time Preference';
      default: return 'Select Time Slot';
    }
  };

  const getServiceDescription = () => {
    switch (serviceType) {
      case 'lab': return 'Choose a convenient time for sample collection';
      case 'doctor': return 'Book your consultation appointment';
      case 'homecare': return 'Schedule your home care service';
      case 'delivery': return 'When would you like to receive your order?';
      default: return 'Select your preferred time';
    }
  };

  const selectedDateSlots = dateSlots.find(slot => slot.date === selectedDate);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          {getServiceTitle()}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getServiceDescription()}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Select Date</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dateSlots.map((dateSlot) => (
              <Button
                key={dateSlot.date}
                variant={selectedDate === dateSlot.date ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(dateSlot.date)}
                className="flex-shrink-0 min-w-fit"
              >
                <div className="text-center">
                  <div className="text-xs font-medium">{dateSlot.day}</div>
                  <div className="text-xs opacity-80">
                    {new Date(dateSlot.date).getDate()}/{new Date(dateSlot.date).getMonth() + 1}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDateSlots && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Available Time Slots</span>
              <Badge variant="secondary" className="text-xs">
                {selectedDateSlots.slots.filter(slot => slot.available).length} slots available
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedDateSlots.slots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={
                    selectedSlot?.date === selectedDate && selectedSlot?.time === slot.time
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  disabled={!slot.available}
                  onClick={() => onSlotSelect(selectedDate, slot)}
                  className="flex flex-col items-center p-3 h-auto"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs font-medium">{slot.time}</span>
                  </div>
                  {slot.duration && (
                    <span className="text-xs opacity-70">{slot.duration}</span>
                  )}
                  {slot.price && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      +₹{slot.price}
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {selectedDateSlots.slots.filter(slot => slot.available).length === 0 && (
              <div className="p-4 text-center bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No slots available for this date. Please select another date.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Selected Slot Summary */}
        {selectedSlot && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Selected: {dateSlots.find(d => d.date === selectedSlot.date)?.day} at {selectedSlot.time}
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {serviceType === 'delivery' 
                ? 'We\'ll deliver during this time window'
                : 'Please be available at the scheduled time'
              }
            </p>
          </div>
        )}

        {/* Emergency/Urgent Option */}
        {serviceType !== 'delivery' && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Need urgent care?
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Call us for same-day appointments
                </p>
              </div>
              <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                Call Now
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};