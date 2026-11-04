import type {
  ComponentProps,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { FocusRing } from "../../foundations/FocusRing/FocusRing";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Ripple } from "../../foundations/Ripple/Ripple";
import { StateLayer } from "../../foundations/StateLayer/StateLayer";
import { useControllableState } from "../../internal/useControllableState";
import styles from "./Chip.module.css";

const join = (...names: (string | false | undefined)[]) =>
  names.filter(Boolean).join(" ");

const checkmark = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9.55 18-5.7-5.7 1.43-1.43 4.27 4.28 9.17-9.18L20.15 7.4z" />
  </svg>
);

const close = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6z" />
  </svg>
);

function Surface({ disabled }: { disabled?: boolean }) {
  return (
    <>
      <StateLayer />
      <Ripple disabled={disabled} />
      <FocusRing />
    </>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className={styles.label}>{children}</span>;
}

/* Assist and suggestion chips: actions, as buttons or links */

type ActionChipProps = ComponentProps<"button"> & {
  /** A leading icon (ADR-005). */
  icon?: ReactNode;
  /** On a raised container instead of an outline. */
  elevated?: boolean;
  /** Makes the chip a link. */
  href?: string;
};

function ActionChip({
  kind,
  icon,
  elevated = false,
  href,
  className,
  children,
  type = "button",
  disabled,
  ...props
}: ActionChipProps & { kind: "assist" | "suggestion" }): ReactElement {
  const classes = join(
    styles.chip,
    styles[kind],
    elevated && styles.elevated,
    icon !== undefined && styles.withIcon,
    className,
  );
  const content = (
    <>
      <Surface disabled={disabled} />
      {icon !== undefined && (
        <IconSlot className={styles.icon}>{icon}</IconSlot>
      )}
      <Label>{children}</Label>
    </>
  );

  if (href !== undefined && !disabled) {
    return (
      <a {...(props as ComponentProps<"a">)} href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button {...props} type={type} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}

export type AssistChipProps = ActionChipProps;

/** An M3 assist chip: a smart or automated action, as a button or a link. */
export function AssistChip(props: AssistChipProps) {
  return <ActionChip {...props} kind="assist" />;
}

export type SuggestionChipProps = ActionChipProps;

/** An M3 suggestion chip: a suggested reply or query, as a button or link. */
export function SuggestionChip(props: SuggestionChipProps) {
  return <ActionChip {...props} kind="suggestion" />;
}

/* Filter chips: toggles */

export interface FilterChipProps extends ComponentProps<"button"> {
  /** A leading icon, replaced by a checkmark while selected. */
  icon?: ReactNode;
  /** A trailing icon, such as a dropdown arrow. */
  trailingIcon?: ReactNode;
  elevated?: boolean;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

/**
 * An M3 filter chip: a toggle button (`aria-pressed`) that shows a
 * checkmark while selected.
 */
export function FilterChip({
  icon,
  trailingIcon,
  elevated = false,
  selected,
  defaultSelected,
  onSelectedChange,
  className,
  children,
  type = "button",
  disabled,
  onClick,
  ...props
}: FilterChipProps) {
  const [isSelected, setSelected] = useControllableState(
    selected,
    defaultSelected ?? false,
    onSelectedChange,
  );
  const leading = isSelected ? checkmark : icon;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) setSelected(!isSelected);
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      aria-pressed={isSelected}
      onClick={handleClick}
      className={join(
        styles.chip,
        styles.filter,
        elevated && styles.elevated,
        isSelected && styles.selected,
        leading !== undefined && styles.withIcon,
        trailingIcon !== undefined && styles.withTrailing,
        className,
      )}
    >
      <Surface disabled={disabled} />
      {leading !== undefined && (
        <IconSlot className={styles.icon}>{leading}</IconSlot>
      )}
      <Label>{children}</Label>
      {trailingIcon !== undefined && (
        <IconSlot className={styles.icon}>{trailingIcon}</IconSlot>
      )}
    </button>
  );
}

/* Input chips: entered information, removable */

type RemoveProps =
  | { onRemove?: undefined; removeLabel?: undefined }
  | {
      /** Shows a remove button after the label. */
      onRemove: () => void;
      /** The remove button's accessible name, e.g. "Remove Alice". */
      removeLabel: string;
    };

export type InputChipProps = Omit<ComponentProps<"span">, "children"> &
  RemoveProps & {
    /** The chip's text. */
    children: ReactNode;
    /** A leading icon. */
    icon?: ReactNode;
    /** A leading avatar image, shown round; wins over `icon`. */
    avatar?: ReactNode;
    selected?: boolean;
    disabled?: boolean;
    /** Makes the chip itself a button, e.g. to edit the entry. */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  };

/**
 * An M3 input chip: a piece of information the user entered, such as a
 * contact or a tag, with an optional remove button. Two separate controls
 * when both actions exist, each reachable by keyboard.
 */
export function InputChip({
  children,
  icon,
  avatar,
  selected = false,
  disabled = false,
  onClick,
  onRemove,
  removeLabel,
  className,
  ...props
}: InputChipProps) {
  const leading = avatar ?? icon;
  const content = (
    <>
      {leading !== undefined && (
        <IconSlot className={avatar ? styles.avatar : styles.icon}>
          {leading}
        </IconSlot>
      )}
      <Label>{children}</Label>
    </>
  );

  return (
    <span
      {...props}
      className={join(
        styles.chip,
        styles.input,
        selected && styles.selected,
        disabled && styles.disabled,
        avatar !== undefined
          ? styles.withAvatar
          : icon !== undefined && styles.withIcon,
        onRemove && styles.withTrailing,
        className,
      )}
    >
      {onClick ? (
        <button
          type="button"
          className={styles.action}
          disabled={disabled}
          onClick={onClick}
        >
          <Surface disabled={disabled} />
          {content}
        </button>
      ) : (
        <span className={styles.action}>{content}</span>
      )}
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
        >
          <Surface disabled={disabled} />
          <IconSlot>{close}</IconSlot>
        </button>
      )}
    </span>
  );
}
