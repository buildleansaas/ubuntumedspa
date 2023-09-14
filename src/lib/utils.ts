import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function isEmpty(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]" && JSON.stringify(obj) === "{}";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
