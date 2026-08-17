import * as React from "react";
import { Input } from "@base-ui/react";
import { cn } from "@/lib/utils";

/**
 * Context to share value and focus state with child slots
 */
const OTPContext = React.createContext<{
  value: string;
  isFocused: boolean;
  maxLength: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
}>({
  value: "",
  isFocused: false,
  maxLength: 6,
  inputRef: { current: null },
});

/**
 * Main Root Component
 */
interface OTPInputProps extends Omit<
  React.ComponentProps<"div">,
  "onChange" | "value"
> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

const OTPInput = ({
  value,
  onChange,
  maxLength = 6,
  disabled = false,
  className,
  children,
  ...props
}: OTPInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  /**
   * Base UI's Input fires onValueChange with the string value directly.
   * We strip non-digits and enforce maxLength here.
   */
  const handleValueChange = (val: string) => {
    // Replace the digit-only regex with one that allows alphanumeric,
    // or simply slice if you want to allow any character.
    const alphanumeric = val.replace(/[^a-zA-Z0-9]/g, "").slice(0, maxLength);
    onChange(alphanumeric);
  };

  return (
    <OTPContext.Provider value={{ value, isFocused, maxLength, inputRef }}>
      <div
        className={cn(
          "flex items-center gap-3",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
        {...props}
      >
        {/*
         * Base UI Input — rendered visually hidden.
         * We use the `render` prop to forward our ref and attach
         * focus/blur so we can track the caret position in slots.
         */}
        <Input
          value={value}
          onValueChange={handleValueChange}
          disabled={disabled}
          inputMode="text"
          autoComplete="one-time-code"
          maxLength={maxLength}
          aria-label="OTP Input"
          render={(inputProps) => (
            <input
              {...inputProps}
              ref={inputRef}
              className="sr-only"
              onFocus={(e) => {
                setIsFocused(true);
                inputProps.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                inputProps.onBlur?.(e);
              }}
            />
          )}
        />

        {children}
      </div>
    </OTPContext.Provider>
  );
};

OTPInput.displayName = "OTPInput";

/**
 * Group Component — wraps a set of slots
 */
const OTPGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    role="group"
    className={cn("flex items-center gap-3", className)}
    {...props}
  />
);

OTPGroup.displayName = "OTPGroup";

/**
 * Individual Slot Component
 */
interface OTPSlotProps extends React.ComponentProps<"div"> {
  index: number;
}

const OTPSlot = ({ index, className, ...props }: OTPSlotProps) => {
  const { value, isFocused } = React.useContext(OTPContext);

  const char = value[index] ?? null;
  const isActive = isFocused && value.length === index;
  const isFilled = char !== null;

  return (
    <div
      data-active={isActive}
      data-filled={isFilled}
      aria-label={`Digit ${index + 1}`}
      className={cn(
        // Base — individual rounded square tile matching the dark design
        "relative flex h-14 w-14 items-center justify-center",
        "rounded-2xl border border-white/10 bg-white/10 uppercase",
        "text-base font-medium text-white",
        "cursor-text select-none transition-all duration-150",
        // Active state — soft ring
        isActive && "border-white/40 ring-2 ring-white/30 ring-offset-0 z-10",
        className,
      )}
      {...props}
    >
      {/* Character or placeholder */}
      {char !== null ? (
        <span>{char}</span>
      ) : (
        <span className="text-white/30 text-lg">-</span>
      )}

      {/* Blinking caret — only on the active slot */}
      {isActive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="h-5 w-px animate-[caret-blink_1s_ease-out_infinite] bg-white" />
        </span>
      )}
    </div>
  );
};

OTPSlot.displayName = "OTPSlot";

/**
 * Separator Component
 */
const OTPSeparator = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    role="separator"
    aria-hidden="true"
    className={cn(
      "flex items-center px-1 text-white/40 font-bold select-none",
      className,
    )}
    {...props}
  >
    -
  </div>
);

OTPSeparator.displayName = "OTPSeparator";

export { OTPInput, OTPGroup, OTPSlot, OTPSeparator };

/**
 * ─── Usage Example ───────────────────────────────────────────────────────────
 *
 * 1. Add this keyframe to your globals.css:
 *
 *   @keyframes caret-blink {
 *     0%, 70%, 100% { opacity: 1; }
 *     20%            { opacity: 0; }
 *   }
 *
 * 2. Use in your component:
 *
 *   const [otp, setOtp] = React.useState("");
 *
 *   <OTPInput value={otp} onChange={setOtp} maxLength={6}>
 *     <OTPGroup>
 *       <OTPSlot index={0} />
 *       <OTPSlot index={1} />
 *       <OTPSlot index={2} />
 *       <OTPSlot index={3} />
 *       <OTPSlot index={4} />
 *       <OTPSlot index={5} />
 *     </OTPGroup>
 *   </OTPInput>
 *
 *   Or with a separator:
 *
 *   <OTPInput value={otp} onChange={setOtp} maxLength={6}>
 *     <OTPGroup>
 *       <OTPSlot index={0} />
 *       <OTPSlot index={1} />
 *       <OTPSlot index={2} />
 *     </OTPGroup>
 *     <OTPSeparator />
 *     <OTPGroup>
 *       <OTPSlot index={3} />
 *       <OTPSlot index={4} />
 *       <OTPSlot index={5} />
 *     </OTPGroup>
 *   </OTPInput>
 */
