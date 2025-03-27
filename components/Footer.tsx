"use client";

import FooterContent from "./FooterContent";

export default function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <FooterContent 
      currentYear={currentYear}
    />
  );
}