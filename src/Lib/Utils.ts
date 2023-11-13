import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDiscordOAuth(state: string): string {
  return `https://discord.com/api/oauth2/authorize?client_id=1172662931121504276&redirect_uri=${import.meta.env.VITE_URL+'verification/stage1'}&response_type=token&scope=identify&state=${state}`
}