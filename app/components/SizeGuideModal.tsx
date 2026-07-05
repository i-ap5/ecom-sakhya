"use client";
import { useState } from "react";

const SIZE_CHART = [
  { size: "XS", bust: "78-81", waist: "60-63", hip: "86-89" },
  { size: "S", bust: "82-85", waist: "64-67", hip: "90-93" },
  { size: "M", bust: "86-90", waist: "68-72", hip: "94-98" },
  { size: "L", bust: "91-96", waist: "73-78", hip: "99-104" },
  { size: "XL", bust: "97-103", waist: "79-85", hip: "105-111" },
];

export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 underline hover:text-black transition-colors cursor-pointer"
      >
        Size Guide
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 md:p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-nohemi)" }}>
                Size Guide
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                aria-label="Close size guide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">All measurements in centimeters.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-2">Size</th>
                  <th className="py-2">Bust</th>
                  <th className="py-2">Waist</th>
                  <th className="py-2">Hip</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="border-b border-gray-50">
                    <td className="py-2 font-semibold">{row.size}</td>
                    <td className="py-2 text-gray-500">{row.bust}</td>
                    <td className="py-2 text-gray-500">{row.waist}</td>
                    <td className="py-2 text-gray-500">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
