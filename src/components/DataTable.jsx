import React from "react";

export default function DataTable({
  columns,
  rows,
  loading = false,
  emptyMessage = "No data found",
  className = ""
}) {
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (rows.length === 0) return <div className="text-center py-4 text-gray-500">{emptyMessage}</div>;

  return (
    <div className={`bg-white rounded-xl shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={col.width ? { width: col.width } : {}}
                  className={`py-2 px-3 border-b text-left ${
                    idx < columns.length - 1 ? "border-r" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={row._id || row.id || rowIdx} className="border-b last:border-b-0">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    style={col.width ? { width: col.width } : {}}
                    className={`py-2 px-3 ${colIdx < columns.length - 1 ? "border-r" : ""}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
