import {
  useId,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import type { IconName } from "../types"

interface IconProps {
  name: IconName
  className?: string
}

interface DetailProps {
  label: string
  value: string
}

export const assetPathPrefix =
  window.location.protocol === "file:" ? "./assets" : "/assets"

const shellIcons: Record<IconName, string> = {
  home: `${assetPathPrefix}/dashboard/0568d.svg`,
  calendar: `${assetPathPrefix}/dashboard/1f81b.svg`,
  message: `${assetPathPrefix}/dashboard/93ad8.svg`,
  pill: `${assetPathPrefix}/dashboard/c14c8.svg`,
  user: `${assetPathPrefix}/dashboard/58480.svg`,
  settings: `${assetPathPrefix}/dashboard/1f395.svg`,
  info: `${assetPathPrefix}/dashboard/d7292.svg`,
}

export function Icon({ name, className = "" }: IconProps) {
  return <img alt="" className={`icon ${className}`} src={shellIcons[name]} />
}
export function Brand({
  compact = false,
  variant = "recovery",
}: {
  compact?: boolean
  variant?: "login" | "shell" | "recovery"
}) {
  return (
    <div
      className={`brand brand--${variant} ${compact ? "brand--compact" : ""}`}
    >
      <span className="brand-mark">
        {variant === "login" && (
          <img alt="" src={`${assetPathPrefix}/login/ab4af.svg`} />
        )}
        {variant === "shell" && (
          <img alt="" src={`${assetPathPrefix}/dashboard/ead47.svg`} />
        )}
        {variant === "recovery" && (
          <>
            <img alt="" src={`${assetPathPrefix}/recovery/04f50.svg`} />
            <span className="brand-cross brand-cross--vertical" />
            <span className="brand-cross brand-cross--horizontal" />
          </>
        )}
      </span>
      <span>
        <b>CareConnect</b>
        {!compact && <small>HEALTH PLATFORM</small>}
      </span>
    </div>
  )
}
export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: ReactNode
}) {
  return (
    <header className="page-heading">
      <div>
        <h1 tabIndex={-1}>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </header>
  )
}
export function Card({
  children,
  className = "",
  ...sectionProps
}: {
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLElement>, "className">) {
  return (
    <section className={`card ${className}`} {...sectionProps}>
      {children}
    </section>
  )
}
export function SectionTitle({
  icon,
  children,
}: {
  icon?: IconName
  children: ReactNode
}) {
  return (
    <h2 className="section-title">
      {icon && <Icon name={icon} />}
      {children}
    </h2>
  )
}
export function Detail({ label, value }: DetailProps) {
  return (
    <span className="detail">
      <small>{label}</small>
      <b>{value}</b>
    </span>
  )
}

export function ModalDialog({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const titleId = useId()
  const triggerRef = useRef<HTMLElement | null>(
    document.activeElement as HTMLElement | null,
  )

  useLayoutEffect(() => {
    const dialog = document.querySelector<HTMLElement>(
      `[aria-labelledby="${titleId}"]`,
    )
    const firstControl = dialog?.querySelector<HTMLElement>(
      "button, input, select, textarea",
    )
    firstControl?.focus()
  }, [titleId])

  const close = () => {
    onClose()
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <div
      className="shortcut-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <section
        className="shortcut-dialog action-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault()
            close()
            return
          }
          if (event.key !== "Tab") return

          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((control) => !control.hasAttribute("disabled"))
          if (!controls.length) return

          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }}
      >
        <header role="presentation">
          <div>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            type="button"
            className="shortcut-close"
            aria-label={`Close ${title}`}
            onClick={close}
          >
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}
