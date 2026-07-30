import type { SalonService } from "../types";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours} hr ${mins} min` : `${hours} hr`;
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getTotals = (services: SalonService[]) => {
  const subtotal = services.reduce((sum, service) => sum + service.price, 0);
  const duration = services.reduce((sum, service) => sum + service.duration, 0);
  const discount = services.length >= 3 ? Math.round(subtotal * 0.08) : 0;
  return {
    subtotal,
    duration,
    discount,
    final: subtotal - discount,
  };
};

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
