"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <div
      className={`flex items-center ${selected ? "text-[#6a51a6]" : "text-slate-500"} cursor-pointer p-2 pl-8 hover:bg-gray-100 rounded-md`}
      onClick={() => {
        router.push(href);
      }}
    >
      <div className="mr-3">{icon}</div>
      <div
        className={`font-bold ${selected ? "text-[#6a51a6]" : "text-slate-500"}`}
      >
        {title}
      </div>
    </div>
  );
};
