import React from "react";
import { formatDateToLocal } from "../../app/lib/utils.ts";
import { lusitana } from "./fonts.ts";

export default function Header({ titleSection }: { readonly titleSection: string }) {
  const currentDate = formatDateToLocal(new Date().toISOString());

  return (
    <div className="header-time flex justify-between items-center mb-4">
      <h1
        className={`${lusitana.className} text-xl md:text-2xl capitalize`}
      >
        {titleSection}
      </h1>
      {currentDate && <p className="text-sm text-gray-500">{currentDate}</p>}
    </div>
  );
}
