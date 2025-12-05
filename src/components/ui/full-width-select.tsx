import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Label } from "./label";
import { cn } from "./utils";

export interface Option {
  value: string;
  label: string;
}

interface FullWidthSelectProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  helperText?: string;
}

export function FullWidthSelect({
  id,
  label,
  placeholder = "Selecciona una opción",
  value,
  onChange,
  options,
  error,
  helperText,
}: FullWidthSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          aria-invalid={!!error}
          className={cn(
            "w-full border-2 h-11 text-base bg-background rounded-lg px-3",
            "flex items-center justify-between",
            error && "border-destructive"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={4}
          className={cn(
            // 👇 asegura mismo ancho que el trigger
            "min-w-full w-[var(--radix-select-trigger-width)]",
            "bg-background border-2 shadow-lg z-50 rounded-lg overflow-hidden"
          )}
        >
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="text-sm px-3 py-2 cursor-pointer"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}