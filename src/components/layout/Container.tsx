import type { HTMLAttributes, ReactNode } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div
      className={["mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className ?? ""].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
