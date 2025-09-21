import type React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner theme="light" className="toaster group" {...props} />;
};

export { Toaster };
