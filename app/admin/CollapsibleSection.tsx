'use client';

import { useState } from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function CollapsibleSection({ title, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold"
      >
        {title} {open ? '▲' : '▼'}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}