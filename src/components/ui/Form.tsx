import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlBase =
  'w-full rounded-2xl border bg-surface text-sm text-ink-800 placeholder:text-ink-300 transition-colors duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-300';

const controlOk = 'border-line hover:border-line-strong focus:border-brand-400 focus:ring-brand-500/15';
const controlError = 'border-danger/60 hover:border-danger focus:border-danger focus:ring-danger/15';

export interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function FieldShell({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
  action,
}: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || action) && (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <label htmlFor={htmlFor} className="text-xs font-bold text-ink-600">
              {label}
              {required && <span className="text-danger"> *</span>}
            </label>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
      {error ? (
        <p className="text-2xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="text-2xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leadingIcon, trailingSlot, containerClassName, className, id, name, required, ...rest },
  ref,
) {
  const generatedId = useId();
  // Prefer a stable, meaningful id so <label for> and browser autofill work.
  const inputId = id ?? name ?? generatedId;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      className={containerClassName}
    >
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink-300">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn(
            controlBase,
            error ? controlError : controlOk,
            'h-11 px-3.5',
            leadingIcon && 'ps-10',
            trailingSlot && 'pe-10',
            className,
          )}
          {...rest}
        />
        {trailingSlot && (
          <span className="absolute inset-y-0 end-2 flex items-center">{trailingSlot}</span>
        )}
      </div>
    </FieldShell>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, containerClassName, className, id, name, required, rows = 4, ...rest },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? name ?? generatedId;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={textareaId}
      className={containerClassName}
    >
      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(
          controlBase,
          error ? controlError : controlOk,
          'resize-y px-3.5 py-3 leading-relaxed',
          className,
        )}
        {...rest}
      />
    </FieldShell>
  );
});

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, placeholder, containerClassName, className, id, name, required, ...rest },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? name ?? generatedId;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={selectId}
      className={containerClassName}
    >
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn(
            controlBase,
            error ? controlError : controlOk,
            'h-11 cursor-pointer appearance-none px-3.5 pe-9',
            className,
          )}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-ink-300"
          aria-hidden
        />
      </div>
    </FieldShell>
  );
});

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: ReactNode;
  count?: number;
}

export function Checkbox({ label, count, className, id, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        'group flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm text-ink-600 transition-colors hover:bg-surface-sunken hover:text-ink-800',
        className,
      )}
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <input id={checkboxId} type="checkbox" className="peer sr-only" {...rest} />
        <span
          aria-hidden
          className="flex h-5 w-5 items-center justify-center rounded-md border border-line-strong bg-surface transition-all peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/20 group-hover:border-brand-300"
        />
        <Check
          className="pointer-events-none absolute h-3.5 w-3.5 scale-50 text-white opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden
        />
      </span>
      <span className="flex-1">{label}</span>
      {typeof count === 'number' && (
        <span className="tnum rounded-full bg-surface-sunken px-2 py-0.5 text-2xs font-semibold text-ink-400">
          {count}
        </span>
      )}
    </label>
  );
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string;
  description?: string;
}

export function Switch({ label, description, id, name, className, ...rest }: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? name ?? generatedId;
  return (
    <label
      htmlFor={switchId}
      className={cn('flex cursor-pointer items-center justify-between gap-4', className)}
    >
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-ink-800">{label}</span>
        {description ? <span className="text-xs text-ink-400">{description}</span> : null}
      </span>
      <span className="relative shrink-0">
        <input id={switchId} name={name ?? switchId} type="checkbox" className="peer sr-only" {...rest} />
        <span
          aria-hidden
          className="block h-6 w-11 rounded-full bg-line-strong transition-colors duration-200 peer-checked:bg-brand-500 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/20"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-1 start-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:-translate-x-5"
        />
      </span>
    </label>
  );
}

export interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
}

export function RadioCards({
  name,
  value,
  onChange,
  options,
  columns = 2,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioCardOption[];
  columns?: 1 | 2 | 3 | 4;
}) {
  return (
    <div
      className={cn(
        'grid gap-2',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-2 sm:grid-cols-3',
        columns === 4 && 'grid-cols-2 sm:grid-cols-4',
      )}
      role="radiogroup"
      aria-label={name}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              'relative flex cursor-pointer flex-col gap-0.5 rounded-2xl border px-3.5 py-3 text-start transition-all duration-200',
              active
                ? 'border-brand-400 bg-brand-50/70 shadow-[0_0_0_3px_rgba(74,115,232,0.12)]'
                : 'border-line bg-surface hover:border-line-strong',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className={cn('text-xs font-bold', active ? 'text-brand-700' : 'text-ink-700')}>
              {option.label}
            </span>
            {option.description ? (
              <span className="text-2xs text-ink-400">{option.description}</span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}
