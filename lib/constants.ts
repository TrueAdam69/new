export const SITE_NAME = "Elesh Clothing";
export const SITE_DESCRIPTION =
  "Pakistani women's premium embroidered unstitched lawn.";

export const SITE_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/how-to-order", label: "How to Order" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" }
] as const;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1DGh97yUqz/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/elesh_clothing",
  tiktok: "https://www.tiktok.com/@elesh_clothing",
  whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923277854609"}`
} as const;
