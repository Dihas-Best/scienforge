type Props = {
  name: string;
  value: string;
  rows?: { label: string; value: string }[];
};

export default function Readout({ name, value, rows }: Props) {
  return (
    <div className="readout" role="status" aria-live="polite">
      <div className="readout-name">{name}</div>
      <div className="readout-value">{value}</div>
      {rows?.length ? (
        <div className="mt-3">
          {rows.map((r) => (
            <div className="readout-row" key={r.label}>
              <span>{r.label}</span>
              <span>{r.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
