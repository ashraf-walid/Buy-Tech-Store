

import { CreditCard,Truck,Package,Clock} from 'lucide-react';

export const generateOrderNumber = () => {
    const now = new Date(); 
    const year = now.getFullYear(); 
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0'); 
    const randomPart = Math.floor(Math.random() * 10000); 
    return `ORD-${day}${month}${year}-${randomPart}`;
  }

  export const shippingOptions = [
    { id: 'standard', name: 'توصيل عادي', price: 0, time: '٣-٥ أيام عمل', icon: Truck },
    { id: 'express', name: 'توصيل سريع', price: 50, time: '١-٢ يوم عمل', icon: Clock },
  ];
  
  export const paymentMethods = [
    { id: 'card', name: 'بطاقة ائتمان/خصم', icon: CreditCard },
    { id: 'cod', name: 'الدفع عند الاستلام', icon: Package },
  ];
