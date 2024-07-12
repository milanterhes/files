import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "Viktor's catalogue",
  author: "Viktor Schneider",
  description:
    "Sale of high-quality extruded polystyrene foam used primarily for thermal insulation in construction.",
  keywords: ["Polystyrene insulation", "Extruded foam products", "Thermal insulation materials", "Hungarian construction supplies", "Energy-efficient building materials"],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "Viktor Schneider",
  },
  links: {
    github: "",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}
