import React from "react";

export default function Table({ headers, rows }) {
  return (
    <table className="w-full text-sm border rounded">
      <thead>
        <tr className="bg-slate-100">
          {headers.map((header, idx) => (
            <th
              key={header}
              className={`py-1 px-2 text-left${idx < headers.length - 1 ? ' border-r' : ''}`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rIdx) => (
          <tr key={rIdx} className="border-b">
            {row.map((cell, cIdx) => (
              <td
                key={cIdx}
                className={`py-1 px-2${cIdx < row.length - 1 ? ' border-r' : ''}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
