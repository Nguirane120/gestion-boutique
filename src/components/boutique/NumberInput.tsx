"use client";

import type { ChangeEvent, KeyboardEvent } from "react";

// Champ numérique qui empêche physiquement la saisie de valeurs négatives
// (touche "-" bloquée, et toute valeur négative collée est ramenée à `min`).
export function NumberInput({
  value,
  onChange,
  min = 0,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  placeholder?: string;
  className?: string;
}) {
  const blockInvalidKeys = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange("");
      return;
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) return;
    onChange(String(Math.max(min, num)));
  };

  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      value={value}
      onKeyDown={blockInvalidKeys}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
