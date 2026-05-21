import { ReactNode } from 'react';

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T>({
  caption,
  columns,
  rows,
  emptyMessage
}: {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return <div className="atlas-empty">{emptyMessage}</div>;
  }

  return (
    <div className="atlas-section-shell min-w-0 overflow-x-auto p-0">
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-[rgba(112,83,61,0.14)] bg-[rgba(255,248,240,0.92)] text-left">
            {columns.map((column) => (
              <th key={column.key} className={`break-words px-5 py-4 font-semibold uppercase tracking-[0.16em] text-[color:var(--atlas-ink-3)] ${column.className ?? ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-[rgba(112,83,61,0.14)] transition hover:bg-[rgba(255,250,244,0.82)] last:border-b-0">
              {columns.map((column) => (
                <td key={column.key} className={`break-words px-5 py-4 align-top text-[color:var(--atlas-ink-2)] ${column.className ?? ''}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
