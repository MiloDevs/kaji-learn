import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export const cn = (...inputs: (string | undefined)[]) => {
  return twMerge(clsx(inputs));
};

export const debounce = (callback: Function, wait = 300) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};
