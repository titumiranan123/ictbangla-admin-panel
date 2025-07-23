/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FieldError } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  type: string;
  error?: FieldError | string;
  register: any;
  validation?: object;
  className:string
  placeholder:string
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  error,
  register,
  validation,
  placeholder,
  className
}) => {
  const errorMessage = error
    ? typeof error === "string"
      ? error
      : error.message
    : null;
  const isCheckbox = type === "checkbox";
  return (
    <div className="relative">
      <input
        type={type}
        {...(register ? register(name, validation) : {})}
        placeholder={isCheckbox ? undefined : placeholder}
        className={`${
          isCheckbox
            ? "mr-2"
            : "block w-full text-[16px] border-b-2 border-gray-300 focus:border-black focus:outline-none peer "
        } ${className}`}
      />
      <label className={isCheckbox ? "order-2" : "formLabel"} htmlFor="email">
        {label}
      </label>
      {error && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default Input;
