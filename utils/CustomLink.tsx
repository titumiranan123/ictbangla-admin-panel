'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ReactNode } from "react";

interface CustomLinkProps {
  title: string;
  className?: string;
  href: string;
  style?: React.CSSProperties;
  icon?: ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  title,
  className = "",
  href,
  style = {},
  icon,
}) => {
  const  pathname  = usePathname();
  const isActive = pathname === `/${href}`;

  return (
    <Link
      href={`/${href}`}
      className={`${className} flex items-center gap-2  py-2 rounded ${
        isActive ? "bg-green-200" : "bg-white"
      }`}
      style={style}
    >
      {icon && <span>{icon}</span>}
      <span>{title}</span>
    </Link>
  );
};

export default CustomLink;
