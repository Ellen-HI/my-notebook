"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
  minLength,
  disabled,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        disabled={disabled}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setIsVisible((prev) => !prev)}
        tabIndex={-1}
        aria-label={isVisible ? "Приховати пароль" : "Показати пароль"}
      >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
