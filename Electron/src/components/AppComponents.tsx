import type { ReactNode } from "react"
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
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`card ${className}`}>{children}</section>
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
