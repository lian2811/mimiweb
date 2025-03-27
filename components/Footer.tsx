"use client";

import { usePathname } from "next/navigation";
import FooterContent from "./FooterContent";

export default function Footer() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  
  const currentYear = new Date().getFullYear();

  return (
    <FooterContent 
      locale={locale}
      currentYear={currentYear}
    />
  );
}