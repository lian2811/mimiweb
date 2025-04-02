"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import SubscriptionContent from "./SubscriptionContent";

export default function SubscriptionPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  return (
    <SubscriptionContent 
      locale={locale}
      billingPeriod={billingPeriod}
      setBillingPeriod={setBillingPeriod}
      fadeIn={fadeIn}
      staggerContainer={staggerContainer}
    />
  );
}