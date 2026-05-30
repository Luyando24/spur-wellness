"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function ChatWidget() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const whatsappNumber = "8614768628270";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center hover:bg-[#128C7E]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
