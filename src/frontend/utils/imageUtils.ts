import placeholderMedical from '@/assets/placeholder-medical.jpg';
import placeholderDoctor from '@/assets/placeholder-doctor.jpg';
import placeholderCategory from '@/assets/placeholder-category.jpg';

export const getImageWithFallback = (originalSrc: string, type: 'medical' | 'doctor' | 'category' = 'medical'): string => {
  // Check if image URL is potentially broken
  if (!originalSrc || originalSrc.includes('404') || originalSrc === '') {
    switch (type) {
      case 'doctor':
        return placeholderDoctor;
      case 'category':
        return placeholderCategory;
      default:
        return placeholderMedical;
    }
  }
  
  return originalSrc;
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, type: 'medical' | 'doctor' | 'category' = 'medical') => {
  const target = event.currentTarget;
  
  switch (type) {
    case 'doctor':
      target.src = placeholderDoctor;
      break;
    case 'category':
      target.src = placeholderCategory;
      break;
    default:
      target.src = placeholderMedical;
      break;
  }
};