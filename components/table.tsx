interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, unknown>>({ columns, data, onRowClick }: TableProps<T>) {
  return (
    <div
      className="overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "var(--radius-xl)",
        backgroundColor: "#1a1a1a",
      }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid #e3e8ee" }}>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left font-medium"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "#8898aa",
                  padding: "12px 16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className="transition-colors"
              style={{
                borderBottom: i < data.length - 1 ? "1px solid #e3e8ee" : "none",
                cursor: onRowClick ? "pointer" : "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f6f9fc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "#0a2540",
                    padding: "14px 16px",
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
