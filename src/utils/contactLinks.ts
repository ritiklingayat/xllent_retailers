import { brand } from "@/config/brand";

export function getWhatsAppUrl(message = `Hello ${brand.name}, I want to know more.`) {
  const phone = brand.phone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
