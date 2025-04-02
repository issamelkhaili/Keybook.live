import { type ThemeConfig } from "next-themes"

export const themeConfig: ThemeConfig = {
  defaultTheme: "dark",
  storageKey: "keybook-theme",
  enableSystem: false,
}

export const animations = {
  button: "transition-all duration-200 ease-in-out",
  card: "transition-all duration-300 ease-in-out",
  fade: "transition-opacity duration-300 ease-in-out",
  scale: "transition-transform duration-300 ease-in-out",
  slide: "transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)",
}

export const gradients = {
  primary: "bg-gradient-to-r from-primary to-primary/60",
  secondary: "bg-gradient-to-r from-secondary to-secondary/60",
  card: "bg-gradient-to-br from-card/5 via-card to-card/5",
  hero: "bg-gradient-to-r from-primary/10 via-primary/5 to-background",
  text: "bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
} 