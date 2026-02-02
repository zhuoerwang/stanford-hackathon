import { useCallback } from 'react';

interface ChipSelectorProps {
  label: string;
  options: readonly string[];
  selected: string | string[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
}

export function ChipSelector({
  label,
  options,
  selected,
  onChange,
  multiSelect = false,
}: ChipSelectorProps) {
  const isSelected = useCallback(
    (option: string) => {
      if (multiSelect) {
        return (selected as string[]).includes(option);
      }
      return selected === option;
    },
    [selected, multiSelect]
  );

  const handleClick = useCallback(
    (option: string) => {
      if (multiSelect) {
        const currentSelected = selected as string[];
        if (currentSelected.includes(option)) {
          onChange(currentSelected.filter((item) => item !== option));
        } else {
          onChange([...currentSelected, option]);
        }
      } else {
        onChange(selected === option ? '' : option);
      }
    },
    [selected, onChange, multiSelect]
  );

  return (
    <div className="chip-selector">
      <label className="chip-label">{label}</label>
      <div className="chip-group">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`chip ${isSelected(option) ? 'selected' : ''}`}
            onClick={() => handleClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
