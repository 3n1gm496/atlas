import { CARTEL2_COLUMNS, CARTEL2_SHEET_FIELDS, type Cartel2SheetRow } from '@/lib/dataset/cartel2-sync';

function getFieldLabel(column: (typeof CARTEL2_COLUMNS)[number]) {
  return CARTEL2_SHEET_FIELDS.find((field) => field.column === column)?.label ?? column;
}

export function DatasetSheetTable({
  row,
  caption,
  emptyLabel = '—'
}: {
  row: Cartel2SheetRow;
  caption: string;
  emptyLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(112,83,61,0.12)] bg-[rgba(255,255,255,0.72)]">
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {CARTEL2_COLUMNS.map((column) => {
            const value = row[column] || emptyLabel;
            return (
              <tr key={column} className="border-b border-[rgba(112,83,61,0.12)] last:border-b-0">
                <th className="w-28 break-words bg-[rgba(255,248,240,0.94)] px-3 py-3 text-left align-top font-semibold uppercase tracking-[0.14em] text-[color:var(--atlas-ink-3)] sm:w-40 md:w-48 lg:w-56">
                  <span className="block">{column}</span>
                  <span className="mt-1 block break-words text-[0.66rem] font-normal leading-4 normal-case tracking-normal text-[color:var(--atlas-ink-3)]">
                    {getFieldLabel(column)}
                  </span>
                </th>
                <td className="break-words px-3 py-3 align-top whitespace-pre-line text-[color:var(--atlas-ink-1)] sm:px-4">{value || emptyLabel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
