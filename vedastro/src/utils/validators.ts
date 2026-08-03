/* eslint-disable @typescript-eslint/no-explicit-any */
export const validators = {
  email: (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  },

  password: (val: string): boolean => {
    return val.length >= 6;
  },

  phone: (val: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(val);
  },

  required: (val: any): boolean => {
    if (val === undefined || val === null) return false;
    if (typeof val === "string") return val.trim().length > 0;
    return true;
  }
};