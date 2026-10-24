import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "round"

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant
}) {
  return (
    <button
      className={`button button--${variant} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

type TypographyVariant =
  | "display"
  | "heading"
  | "title"
  | "body"
  | "label"
  | "caption"

export function Typography<T extends ElementType = "p">({
  as,
  variant = "body",
  className = "",
  children,
  ...props
}: {
  as?: T
  variant?: TypographyVariant
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">) {
  const Component = as ?? "p"
  return (
    <Component
      className={`web-type web-type--${variant} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

type TextFieldProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "onChange"
> & {
  label: string
  error?: string
  hint?: string
  onChange?: (value: string) => void
}

export function TextField({
  label,
  error,
  hint,
  required,
  id,
  name,
  onChange,
  className = "",
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? name ?? generatedId
  const descriptionId = `${inputId}-description`

  return (
    <label className={`field ${className}`} htmlFor={inputId}>
      <span>
        {label}
        {required && <b aria-hidden="true"> *</b>}
      </span>
      <input
        {...props}
        id={inputId}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {(error || hint) && (
        <small
          className={error ? "field-error" : "field-hint"}
          id={descriptionId}
        >
          {error ?? hint}
        </small>
      )}
    </label>
  )
}

export function SelectField({
  label,
  options,
  error,
  id,
  ...props
}: ComponentPropsWithoutRef<"select"> & {
  label: string
  options: Array<{ label: string; value: string }>
  error?: string
}) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  return (
    <label className="field" htmlFor={selectId}>
      <span>{label}</span>
      <select
        {...props}
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <small className="field-error" id={`${selectId}-error`}>
          {error}
        </small>
      )}
    </label>
  )
}

export function Tabs({
  items,
  value,
  onChange,
  label,
}: {
  items: string[]
  value: string
  onChange: (value: string) => void
  label: string
}) {
  return (
    <div className="web-tabs" role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          aria-selected={value === item}
          className={value === item ? "active" : ""}
          key={item}
          onClick={() => onChange(item)}
          role="tab"
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export function Tooltip({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <span className="web-tooltip">
      {children}
      <span className="web-tooltip__bubble" role="tooltip">
        {label}
      </span>
    </span>
  )
}

export type DropdownItem = {
  label: string
  onSelect: () => void
  danger?: boolean
}

export function Dropdown({
  trigger,
  items,
  align = "end",
}: {
  trigger: (props: {
    expanded: boolean
    onClick: () => void
  }) => ReactNode
  items: DropdownItem[]
  align?: "start" | "end"
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", escape)
    }
  }, [])

  return (
    <div className="web-dropdown" ref={rootRef}>
      {trigger({ expanded: open, onClick: () => setOpen(!open) })}
      {open && (
        <div
          className={`web-dropdown__menu web-dropdown__menu--${align}`}
          role="menu"
        >
          {items.map((item) => (
            <button
              className={item.danger ? "danger" : ""}
              key={item.label}
              onClick={() => {
                item.onSelect()
                setOpen(false)
              }}
              role="menuitem"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
}: {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
}) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", close)
    return () => document.removeEventListener("keydown", close)
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="web-modal" role="presentation">
      <button
        aria-label="Close dialog"
        className="web-modal__backdrop"
        onClick={onClose}
        type="button"
      />
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="web-modal__panel"
        role="dialog"
      >
        <header className="web-modal__header">
          <div>
            <Typography as="h2" id={titleId} variant="title">
              {title}
            </Typography>
            {description && (
              <Typography variant="body">{description}</Typography>
            )}
          </div>
          <Button aria-label="Close" onClick={onClose} variant="round">
            ×
          </Button>
        </header>
        <div className="web-modal__body">{children}</div>
        {footer && <footer className="web-modal__footer">{footer}</footer>}
      </section>
    </div>
  )
}

export function Grid({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`web-grid ${className}`}>{children}</div>
}

export function GridColumn({
  children,
  span = 12,
  tablet = 12,
  mobile = 12,
}: {
  children: ReactNode
  span?: 3 | 4 | 6 | 8 | 9 | 12
  tablet?: 4 | 6 | 8 | 12
  mobile?: 6 | 12
}) {
  return (
    <div
      className={`web-grid__column web-grid__column--${span} web-grid__column--tablet-${tablet} web-grid__column--mobile-${mobile}`}
    >
      {children}
    </div>
  )
}
