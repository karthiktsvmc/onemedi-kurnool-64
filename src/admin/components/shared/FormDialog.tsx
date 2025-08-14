import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { X, Plus } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'date' | 'email' | 'tel' | 'array' | 'password';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
  submitText?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  values,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Save"
}: FormDialogProps) {
  const handleArrayAdd = (fieldName: string) => {
    const currentArray = values[fieldName] || [];
    onChange(fieldName, [...currentArray, '']);
  };

  const handleArrayRemove = (fieldName: string, index: number) => {
    const currentArray = values[fieldName] || [];
    onChange(fieldName, currentArray.filter((_: any, i: number) => i !== index));
  };

  const handleArrayChange = (fieldName: string, index: number, value: string) => {
    const currentArray = values[fieldName] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    onChange(fieldName, newArray);
  };

  const renderField = (field: FormField) => {
    const value = values[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={(newValue) => onChange(field.name, newValue)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => onChange(field.name, checked)}
            />
            <Label>{value ? 'Yes' : 'No'}</Label>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'tel':
        return (
          <Input
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'password':
        return (
          <Input
            type="password"
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'array':
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleArrayChange(field.name, index, e.target.value)}
                  placeholder={field.placeholder}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleArrayRemove(field.name, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd(field.name)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
            {arrayValue.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {arrayValue.map((item: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderField(field)}
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}