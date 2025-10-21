import * as React from "react";
import { cn } from "@/lib/utils";
import { useField } from "formik";
import { Input } from "./input";
import { Select } from "./select";
import { PillCheckbox } from "./pill-checkbox";

type FieldWrapperProps = {
  name: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  name,
  label,
  helperText,
  children,
  className,
}) => {
  const [, meta] = useField(name);
  const error = meta.touched && meta.error ? meta.error : undefined;
  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label className="block text-sm font-medium text-[#4A4A4A]" htmlFor={name}>
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
};

type TextInputFieldProps = React.ComponentProps<"input"> & {
  name: string;
  label?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isPassword?: boolean;
};

export const TextInputField: React.FC<TextInputFieldProps> = ({
  name,
  label,
  startIcon,
  endIcon,
  isPassword,
  ...props
}) => {
  const [field] = useField(name);
  return (
    <FieldWrapper name={name} label={label}>
      <Input
        {...field}
        {...props}
        startIcon={startIcon}
        endIcon={endIcon}
        isPassword={isPassword}
      />
    </FieldWrapper>
  );
};

type SelectFieldProps = {
  name: string;
  label?: React.ReactNode;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder?: string;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  placeholder,
}) => {
  const [field, , helpers] = useField(name);
  return (
    <FieldWrapper name={name} label={label}>
      <Select
        value={field.value}
        onChange={(v: string) => helpers.setValue(v)}
        options={options}
        placeholder={placeholder}
      />
    </FieldWrapper>
  );
};

type PillCheckboxFieldProps = {
  name: string;
  label?: React.ReactNode;
  pillLabel: React.ReactNode;
};

export const PillCheckboxField: React.FC<PillCheckboxFieldProps> = ({
  name,
  label,
  pillLabel,
}) => {
  const [field, , helpers] = useField({ name, type: "checkbox" });
  return (
    <FieldWrapper name={name} label={label}>
      <PillCheckbox
        checked={field.value}
        onChange={(v: boolean) => helpers.setValue(v)}
        label={pillLabel}
      />
    </FieldWrapper>
  );
};
