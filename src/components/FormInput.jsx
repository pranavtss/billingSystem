import React from "react";

export default function FormInput({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full border p-2 rounded ${className}`}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
