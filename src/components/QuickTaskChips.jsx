export default function QuickTaskChips({ chips, onChipClick }) {
  return (
    <div className="quick-chips" aria-label="快速任务">
      {chips.map((chip) => (
        <button key={chip} className="chip" type="button" onClick={() => onChipClick(chip)}>
          {chip}
        </button>
      ))}
    </div>
  );
}
