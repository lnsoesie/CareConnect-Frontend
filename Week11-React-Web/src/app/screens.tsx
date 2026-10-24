import { FormEvent, ReactNode, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import {
  Button,
  Dropdown,
  Grid,
  GridColumn,
  Modal,
  SelectField,
  Tabs,
  TextField as Field,
  Tooltip,
  Typography,
} from "./components/WebUI"
import { usePortalState } from "./store"
import { useForm } from "./useForm"

const A = "/assets"

type Route = "login" | "reset" | "home" | "appointments" | "messages" | "medications" | "profile" | "settings" | "new-message" | "conversation"

const routePaths: Record<Route, string> = {
  login: "/login",
  reset: "/reset-password",
  home: "/",
  appointments: "/appointments",
  messages: "/messages",
  medications: "/medications",
  profile: "/profile",
  settings: "/settings",
  "new-message": "/messages/new",
  conversation: "/messages/dr-sarah-smith",
}

function routeFromPath(pathname: string): Route {
  const match = (Object.entries(routePaths) as [Route, string][]).find(
    ([, path]) => path === pathname,
  )
  return match?.[0] ?? "login"
}

function useGo() {
  const navigate = useNavigate()
  return (route: Route) => navigate(routePaths[route])
}

function Brand({ auth = false }: { auth?: boolean }) {
  return (
    <div className={auth ? "auth-brand" : "brand"}>
      <img src={`${A}/${auth ? "cb298.svg" : "901e4.svg"}`} alt="" />
      <span>CareConnect</span>
    </div>
  )
}

function Login({ go }: { go: (route: Route) => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm(
    { email: "", password: "" },
    ({ email, password }) => ({
      ...(!email
        ? { email: "Enter your email address." }
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? { email: "Enter a valid email address." }
          : {}),
      ...(password.length < 6
        ? { password: "Password must be at least 6 characters." }
        : {}),
    }),
  )

  return (
    <main className="login-page">
      <div className="login-wrap">
        <Brand auth />
        <section className="login-card">
          <h1>Welcome</h1>
          <p className="muted">Sign in to your CareConnect account</p>
          <form onSubmit={form.handleSubmit(() => go("home"))} noValidate>
            <Field
              label="Email address"
              placeholder="name@example.com"
              type="email"
              name="email"
              value={form.values.email}
              onChange={(value) => form.setValue("email", value)}
              error={form.errors.email}
              autoComplete="email"
              required
            />
            <div className="password-label">
              <span>Password</span>
              <button type="button" onClick={() => go("reset")}>
                Forgot password?
              </button>
            </div>
            <div className="password-field">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setValue("password", event.target.value)
                }
                aria-invalid={Boolean(form.errors.password)}
                aria-describedby="password-error"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={`${A}/5dd9f.svg`} alt="" />
              </button>
            </div>
            {form.errors.password && (
              <p className="form-error" id="password-error">
                {form.errors.password}
              </p>
            )}
            <Button type="submit" className="full">
              Sign in
            </Button>
          </form>
          <div className="login-help">
            Need access to CareConnect?{" "}
            <button>Contact your care coordinator</button>
          </div>
          <div className="secure-note">
            <img src={`${A}/98151.svg`} alt="" />
            HIPAA-compliant · 256-bit TLS encryption
          </div>
        </section>
        <p className="auth-copyright">
          © 2026 CareConnect Health Systems. <u>Privacy Policy</u> ·{" "}
          <u>Terms of Service</u>
        </p>
      </div>
    </main>
  )
}

function Reset({ go }: { go: (route: Route) => void }) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (email.endsWith("@unknown.com")) {
      setError(true)
      setSent(false)
    } else {
      setSent(true)
      setError(false)
    }
  }

  return (
    <div className="reset-page">
      <header className="reset-header">
        <Brand />
        <span>
          <i /> Secure Connection
        </span>
      </header>
      <main className="reset-main">
        <section className="recovery-copy">
          <i />
          <h1>
            Account
            <br />
            <strong>Recovery</strong>
          </h1>
          <p>
            We&apos;ll send secure, time-limited reset instructions to your
            registered email address.
          </p>
          <ul>
            <li>
              🔒 <span>End-to-end encrypted reset link</span>
            </li>
            <li>
              ⏱ <span>Link expires in 30 minutes</span>
            </li>
            <li>
              📋 <span>HIPAA-compliant authentication</span>
            </li>
          </ul>
        </section>
        <section>
          <form className="reset-card" onSubmit={submit}>
            <div className="reset-title">
              <span>◉</span>
              <h2>Reset Password</h2>
            </div>
            <p>
              Enter your email address and we&apos;ll send you instructions to
              reset your password.
            </p>
            <Field
              label="Email Address"
              placeholder="name@organization.com"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            {error && (
              <div className="alert alert--error">
                We couldn&apos;t find an account for that email.
              </div>
            )}
            {sent && (
              <div className="alert alert--success">
                Reset instructions sent. Please check your inbox.
              </div>
            )}
            <Button type="submit" className="full">
              ⌁&nbsp;&nbsp; Send Reset Link
            </Button>
            <div className="or">
              <span />
              or
              <span />
            </div>
            <Button variant="ghost" onClick={() => go("login")}>
              ‹&nbsp;&nbsp; Back to Login
            </Button>
          </form>
          <p className="reset-tip">
            Tip: use @unknown.com email to preview the error state
          </p>
        </section>
      </main>
      <footer className="reset-footer">
        Privacy Policy　·　 Terms of Use　·　 HIPAA Notice　·　 Support　·　 ©
        2026 CareConnect Health Platform
      </footer>
    </div>
  )
}

const navItems: { route: Route; label: string; icon: string }[] = [
  { route: "home", label: "Home", icon: "e6a60.svg" },
  { route: "appointments", label: "Appointments", icon: "9e08e.svg" },
  { route: "messages", label: "Messages", icon: "82064.svg" },
  { route: "medications", label: "Medications", icon: "46a17.svg" },
  { route: "profile", label: "Profile", icon: "876b0.svg" },
  { route: "settings", label: "Settings", icon: "0e63e.svg" },
]

function Shell({
  route,
  go,
  children,
}: {
  route: Route
  go: (route: Route) => void
  children: ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const active =
    route === "new-message" || route === "conversation" ? "messages" : route
  return (
    <div className="portal">
      <div className="menu-strip">File　　Edit　　View　　Help</div>
      <header className="portal-header">
        <Button
          aria-controls="primary-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          variant="ghost"
        >
          <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
        </Button>
        <Brand />
        <div className="header-actions">
          <label className="search">
            <img src={`${A}/5e2e4.svg`} alt="" />
            <input placeholder="Search..." />
          </label>
          <Tooltip label="Notifications">
            <Button className="icon-button" aria-label="Notifications">
              <img src={`${A}/73bea.svg`} alt="" />
              <b>3</b>
            </Button>
          </Tooltip>
          <Tooltip label="Open calendar">
            <Button className="icon-button" aria-label="Calendar">
              <img src={`${A}/f03b5.svg`} alt="" />
            </Button>
          </Tooltip>
          <Dropdown
            items={[
              { label: "My profile", onSelect: () => go("profile") },
              { label: "Settings", onSelect: () => go("settings") },
              {
                label: "Sign out",
                onSelect: () => go("login"),
                danger: true,
              },
            ]}
            trigger={({ expanded, onClick }) => (
              <Button
                aria-expanded={expanded}
                aria-haspopup="menu"
                className="user-menu"
                onClick={onClick}
                variant="ghost"
              >
                <span>JD</span> Jane Doe　{expanded ? "⌃" : "⌄"}
              </Button>
            )}
          />
        </div>
      </header>
      <div className="portal-body">
        {mobileMenuOpen && (
          <Button
            aria-label="Close navigation"
            className="mobile-nav-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            variant="ghost"
          />
        )}
        <aside
          className={`sidebar ${mobileMenuOpen ? "sidebar--open" : ""}`}
          id="primary-navigation"
        >
          <nav aria-label="Primary navigation">
            {navItems.map((item) => (
              <Button
                key={item.route}
                className={active === item.route ? "active" : ""}
                onClick={() => {
                  go(item.route)
                  setMobileMenuOpen(false)
                }}
                variant="ghost"
              >
                <img src={`${A}/${item.icon}`} alt="" />
                <span>{item.label}</span>
                {item.route === "messages" && <b>2</b>}
              </Button>
            ))}
          </nav>
          <Button
            className="side-user"
            onClick={() => go("profile")}
            variant="ghost"
          >
            <span>JD</span>
            <div>
              <b>Jane Doe</b>
              <small>Patient</small>
            </div>
          </Button>
        </aside>
        <main className="content">{children}</main>
      </div>
      <footer className="statusbar">
        <span>
          <i /> Connected　 <em>Last synced: just now</em>
        </span>
        <span>
          CareConnect v2.4.1　　HIPAA Compliant　　© 2026 CareConnect Health
        </span>
      </footer>
    </div>
  )
}

function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: ReactNode
}) {
  return (
    <div className="page-header">
      <div>
        <Typography as="h1" variant="heading">
          {title}
        </Typography>
        <Typography variant="body">{subtitle}</Typography>
      </div>
      {action}
    </div>
  )
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`card ${className}`}>{children}</section>
}

function CardTitle({
  icon = "info",
  children,
}: {
  icon?: string
  children: ReactNode
}) {
  return (
    <Typography as="h2" className="card-title" variant="label">
      <span>{icon === "info" ? "ⓘ" : icon}</span>
      {children}
    </Typography>
  )
}

function Home({ go }: { go: (route: Route) => void }) {
  const { checkedTasks, toggleTask } = usePortalState()
  return (
    <>
      <PageHeader
        title="Good morning, Jane"
        subtitle="Here’s an overview of your care today."
        action={
          <span className="system-pill">●&nbsp; All systems connected</span>
        }
      />
      <div className="stat-grid">
        {[
          ["NEXT APPOINTMENT", "Today, 2:30 PM", "Dr. Sarah Chen · Cardiology"],
          ["MEDICATIONS TODAY", "3 of 4 taken", "Next dose at 6:00 PM"],
          ["CARE PLAN", "82% on track", "2 tasks due this week"],
        ].map(([label, value, note]) => (
          <Card key={label} className="stat">
            <small>{label}</small>
            <strong>{value}</strong>
            <p>{note}</p>
          </Card>
        ))}
      </div>
      <div className="home-grid">
        <Card>
          <div className="card-head">
            <CardTitle icon="▣">UPCOMING APPOINTMENTS</CardTitle>
            <Button variant="secondary" onClick={() => go("appointments")}>
              View all
            </Button>
          </div>
          <div
  className="appointment-mini"
  role="link"
  tabIndex={0}
  aria-label="View Cardiology follow-up appointment"
  onClick={() => go("appointments")}
  onKeyDown={(event) => {
    if (event.key === "Enter") {
      go("appointments")
    }
  }}
>
            <div className="date-box">
              <b>14</b>
              <span>MAR</span>
            </div>
            <div>
              <b>Cardiology follow-up</b>
              <p>Dr. Sarah Chen · Bay Medical Center</p>
              <small>
                <i>2:30 PM</i> In person
              </small>
            </div>
            <Button onClick={() => go("appointments")}>View details</Button>
          </div>
          <div className="appointment-mini">
            <div className="date-circle">21</div>
            <div>
              <b>Physical therapy</b>
              <p>10:00 AM · Virtual visit</p>
            </div>
            <span>Fri</span>
          </div>
        </Card>
        <Card>
          <CardTitle icon="⬡">TODAY&apos;S CHECKLIST</CardTitle>
          <div className="checklist">
            {[
              ["Morning medication", "Completed at 8:05 AM"],
              ["Log blood pressure", "Due before 4:00 PM"],
              ["Evening medication", "Scheduled for 6:00 PM"],
              ["Daily movement", "20 minute goal"],
            ].map(([title, note], index) => (
              <label key={title}>
                <input
                  type="checkbox"
                  checked={checkedTasks[index]}
                  onChange={() => toggleTask(index)}
                />
                <span>
                  <b>{title}</b>
                  <small>{note}</small>
                </span>
              </label>
            ))}
          </div>
        </Card>
      </div>
      <Card className="health">
        <CardTitle>HEALTH SNAPSHOT</CardTitle>
        <div>
          {[
            ["BLOOD PRESSURE", "118 / 76 mmHg"],
            ["RESTING HEART RATE", "68 bpm"],
            ["WEIGHT", "142.4 lbs"],
            ["LAST UPDATED", "Today, 9:15 AM"],
          ].map(([k, v]) => (
            <span key={k}>
              <small>{k}</small>
              <b>{v}</b>
            </span>
          ))}
        </div>
      </Card>
    </>
  )
}

function Appointments() {
  const [tab, setTab] = useState("Upcoming")
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
  useState<string[] | null>(null)
  const rows = [
    [
      "MAR 14",
      "Cardiology follow-up",
      "Dr. Sarah Chen",
      "Today · 2:30 PM",
      "Confirmed",
    ],
    [
      "MAR 21",
      "Physical therapy",
      "Michael Torres, PT",
      "Friday · 10:00 AM",
      "Scheduled",
    ],
    [
      "APR 03",
      "Annual wellness visit",
      "Dr. Robert Kim",
      "Thursday · 9:00 AM",
      "Scheduled",
    ],
  ]
  return (
    <>
      <PageHeader
        title="Appointments"
        subtitle="View and manage your upcoming care visits."
        action={
          <Button onClick={() => setScheduleOpen(true)}>
            ＋ Schedule appointment
          </Button>
        }
      />
      <Tabs
        items={["Upcoming", "Past", "Canceled"]}
        label="Appointment status"
        onChange={setTab}
        value={tab}
      />
      <Card className="list-card">
        {tab === "Upcoming" ? (
          rows.map((row) => (
            <div
  className="list-row appointment-row"
  key={row[0]}
  role="button"
  tabIndex={0}
  aria-label={`View details for ${row[1]}`}
  onClick={() => setSelectedAppointment(row)}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setSelectedAppointment(row)
    }
  }}
>
              <b className="blue">{row[0]}</b>
              <div>
                <strong>{row[1]}</strong>
                <small>{row[2]}</small>
              </div>
              <div>
                <strong>{row[3]}</strong>
                <small>In person</small>
              </div>
              <span
                className={`badge ${row[4] === "Confirmed" ? "green" : ""}`}
              >
                {row[4]}
              </span>
              <b className="chevron">›</b>
            </div>
          ))
        ) : (
          <div className="empty-state">
            No {tab.toLowerCase()} appointments to show.
          </div>
        )}
      </Card>
            {selectedAppointment && (
        <Card className="appointment-details">
          <h2>Appointment Details</h2>

          <p>
            <strong>Appointment:</strong> {selectedAppointment[1]}
          </p>

          <p>
            <strong>Date:</strong> {selectedAppointment[0]}
          </p>

          <p>
            <strong>Provider:</strong> {selectedAppointment[2]}
          </p>

          <p>
            <strong>Time:</strong> {selectedAppointment[3]}
          </p>

          <p>
            <strong>Status:</strong> {selectedAppointment[4]}
          </p>

          <Button
            onClick={() => setSelectedAppointment(null)}
            variant="secondary"
          >
            Close Details
          </Button>
        </Card>
      )}
      <Card className="help-card">
        <CardTitle>NEED HELP?</CardTitle>
        <p>
          Call the scheduling team at <b>(555) 018-2200</b>.<br />
          <small>Monday–Friday, 8:00 AM–6:00 PM</small>
        </p>
      </Card>
      <Modal
        description="Choose a visit type and preferred time. Your care team will confirm availability."
        footer={
          <>
            <Button onClick={() => setScheduleOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button form="schedule-appointment-form" type="submit">
              Request appointment
            </Button>
          </>
        }
        onClose={() => setScheduleOpen(false)}
        open={scheduleOpen}
        title="Schedule an appointment"
      >
        <form
          id="schedule-appointment-form"
          onSubmit={(event) => {
            event.preventDefault()
            setScheduleOpen(false)
          }}
        >
          <Grid>
            <GridColumn span={12}>
              <SelectField
                label="Visit type"
                name="visitType"
                options={[
                  { label: "Primary care", value: "primary" },
                  { label: "Cardiology follow-up", value: "cardiology" },
                  { label: "Physical therapy", value: "therapy" },
                ]}
              />
            </GridColumn>
            <GridColumn mobile={12} span={6} tablet={6}>
              <Field
                label="Preferred date"
                name="date"
                placeholder=""
                required
                type="date"
              />
            </GridColumn>
            <GridColumn mobile={12} span={6} tablet={6}>
              <SelectField
                label="Preferred time"
                name="time"
                options={[
                  { label: "Morning", value: "morning" },
                  { label: "Afternoon", value: "afternoon" },
                  { label: "Evening", value: "evening" },
                ]}
              />
            </GridColumn>
            <GridColumn span={12}>
              <Field
                hint="Optional"
                label="Reason for visit"
                name="reason"
                placeholder="Briefly describe what you need help with"
              />
            </GridColumn>
          </Grid>
        </form>
      </Modal>
    </>
  )
}

function Medications() {
  const { takenMedications, toggleMedication } = usePortalState()
  const [addMedicationOpen, setAddMedicationOpen] = useState(false)
  const meds = [
    ["Lisinopril", "10 mg tablet", "Once daily · 8:00 AM", "Taken today"],
    [
      "Metformin",
      "500 mg tablet",
      "Twice daily · With meals",
      "Next at 6:00 PM",
    ],
    ["Atorvastatin", "20 mg tablet", "Once daily · 9:00 PM", "Due tonight"],
  ]
  return (
    <>
      <PageHeader
        title="Medications"
        subtitle="Track your prescriptions and daily schedule."
        action={
          <Button onClick={() => setAddMedicationOpen(true)}>
            ＋ Add medication
          </Button>
        }
      />
      <div className="stat-grid">
        {[
          ["ACTIVE MEDICATIONS", "3", "All prescriptions current"],
          [
            "TODAY’S PROGRESS",
            `${takenMedications.length} of 4`,
            "One dose remaining",
          ],
          ["NEXT REFILL", "12 days", "Lisinopril · Mar 26"],
        ].map(([a, b, c]) => (
          <Card className="stat" key={a}>
            <small>{a}</small>
            <strong>{b}</strong>
            <p>{c}</p>
          </Card>
        ))}
      </div>
      <Card className="list-card medication-card">
        <CardTitle>MY MEDICATIONS</CardTitle>
        {meds.map(([name, dose, schedule, status]) => (
          <div className="list-row medication-row" key={name}>
            <span className="med-icon">◉</span>
            <div>
              <strong>{name}</strong>
              <small>{dose}</small>
            </div>
            <div>
              <small>SCHEDULE</small>
              <span>{schedule}</span>
            </div>
            <button
              className={`badge ${
                takenMedications.includes(name) ? "green" : "blue-badge"
              }`}
              onClick={() => toggleMedication(name)}
            >
              {takenMedications.includes(name) ? "Taken today" : status}
            </button>
            <Button variant="secondary">Details</Button>
          </div>
        ))}
      </Card>
      <div className="info-banner">
        ⓘ　 Never change or stop a medication without speaking to your care
        team.
      </div>
      <Modal
        description="Add a medication to your daily tracking list."
        footer={
          <>
            <Button
              onClick={() => setAddMedicationOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button form="add-medication-form" type="submit">
              Add medication
            </Button>
          </>
        }
        onClose={() => setAddMedicationOpen(false)}
        open={addMedicationOpen}
        title="Add medication"
      >
        <form
          id="add-medication-form"
          onSubmit={(event) => {
            event.preventDefault()
            setAddMedicationOpen(false)
          }}
        >
          <Grid>
            <GridColumn span={12}>
              <Field
                autoComplete="off"
                label="Medication name"
                name="medication"
                placeholder="Enter medication name"
                required
              />
            </GridColumn>
            <GridColumn mobile={12} span={6} tablet={6}>
              <Field
                label="Dose"
                name="dose"
                placeholder="e.g. 10 mg"
                required
              />
            </GridColumn>
            <GridColumn mobile={12} span={6} tablet={6}>
              <SelectField
                label="Frequency"
                name="frequency"
                options={[
                  { label: "Once daily", value: "daily" },
                  { label: "Twice daily", value: "twice" },
                  { label: "As needed", value: "needed" },
                ]}
              />
            </GridColumn>
          </Grid>
        </form>
      </Modal>
    </>
  )
}

function Messages({ go }: { go: (route: Route) => void }) {
  const rows = [
    [
      "Today",
      "9:00 AM",
      "Your test results are ready",
      "Dr. Barrow Gastroenterology",
    ],
    ["Yesterday", "3:00 PM", "Please let us know if…", "Dr. Smith Neurology"],
    ["Sept 25", "8:00 AM", "Annual wellness visit Reminder", "Dr. Robert Kim"],
    [
      "Sept 24",
      "10.30 AM",
      "Follow-up appointment scheduled",
      "Dr. Emily Chen Orthopedics",
    ],
  ]
  return (
    <>
      <PageHeader
        title="Messages"
        subtitle="View and manage your communication."
        action={
          <Button onClick={() => go("new-message")}>＋ New Message</Button>
        }
      />
      <Card className="message-list">
        {rows.map((row, index) => (
          <div className="message-row" key={row[0]}>
            <b>
              {row[0]}
              <small>{row[1]}</small>
            </b>
            <div>
              <strong>{row[2]}</strong>
              <small>{row[3]}</small>
            </div>
            <Button
              variant="secondary"
              onClick={() => index < 2 && go("conversation")}
            >
              Details
            </Button>
          </div>
        ))}
      </Card>
    </>
  )
}

function NewMessage({ go }: { go: (route: Route) => void }) {
  const [sent, setSent] = useState(false)
  const { sendConversationMessage } = usePortalState()
  const form = useForm(
    { provider: "", message: "" },
    ({ provider, message }) => ({
      ...(provider.trim().length < 2
        ? { provider: "Enter a provider name." }
        : {}),
      ...(message.trim().length < 10
        ? { message: "Message must be at least 10 characters." }
        : {}),
    }),
  )

  function submit({ message }: { provider: string; message: string }) {
    sendConversationMessage(message)
    setSent(true)
    window.setTimeout(() => go("messages"), 900)
  }
  return (
    <>
      <PageHeader
        title="New Message"
        subtitle="Compose a secure message to your provider."
        action={
          <Button variant="round" onClick={() => go("messages")}>
            ‹
          </Button>
        }
      />
      <form
        className="compose card"
        onSubmit={form.handleSubmit(submit)}
        noValidate
      >
        <Field
          label="To"
          name="provider"
          placeholder="Enter provider name"
          value={form.values.provider}
          onChange={(value) => form.setValue("provider", value)}
          error={form.errors.provider}
          required
        />
        <label className="field">
          <span>Message</span>
          <textarea
            placeholder="Type your message here"
            value={form.values.message}
            onChange={(event) => form.setValue("message", event.target.value)}
            aria-invalid={Boolean(form.errors.message)}
            aria-describedby="compose-message-error"
            required
          />
          {form.errors.message && (
            <small className="field-error" id="compose-message-error">
              {form.errors.message}
            </small>
          )}
        </label>
        <label className="attachment">
          <input type="file" />
          ⌁　 Add an attachment
        </label>
        {sent && (
          <div className="alert alert--success">
            Your secure message was sent.
          </div>
        )}
        <Button type="submit" className="full">
          ▽　 Send Message
        </Button>
      </form>
    </>
  )
}

function Conversation({ go }: { go: (route: Route) => void }) {
  const { conversationMessages, sendConversationMessage } = usePortalState()
  const [draft, setDraft] = useState("")
  function send(event: FormEvent) {
    event.preventDefault()
    if (draft.trim()) {
      sendConversationMessage(draft)
      setDraft("")
    }
  }
  return (
    <div className="conversation">
      <aside className="provider">
        <button className="back-link" onClick={() => go("messages")}>
          ‹ <span>Back to Messages</span>
        </button>
        <div className="provider-avatar">SS</div>
        <h2>Dr. Sarah Smith</h2>
        <p>Neurology</p>
        <span className="reply-pill">●　Usually replies in 1–2 days</span>
        <div className="visit">
          <b>▣　 Upcoming visit</b>
          <p>
            September 5 · 10:00 AM
            <br />
            Neurology follow-up
          </p>
        </div>
        <small className="privacy">
          ♢　 This conversation is private and protected as part of your health
          record.
        </small>
      </aside>
      <section className="chat">
        <header>
          <div>
            <h1>Dr. Sarah Smith</h1>
            <p>Neurology</p>
          </div>
          <span>▣　 Secure message</span>
        </header>
        <div className="chat-body">
          <span className="today">Today</span>
          <div className="bubble received">
            Your test results are ready, please let me know if you have any
            questions.
          </div>
          <small>10:42 AM</small>
          {conversationMessages.map((message, index) => (
            <div key={index} className="sent-wrap">
              <div className="bubble sent">{message}</div>
              <small>10:{45 + index} AM</small>
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={send}>
          <span>⌁</span>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message..."
          />
          <Button variant="round" type="submit">
            ▽
          </Button>
        </form>
      </section>
    </div>
  )
}

function Profile({ go }: { go: (route: Route) => void }) {
  const [editing, setEditing] = useState(false)
  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information and account settings"
        action={
          <Button onClick={() => setEditing(!editing)}>
            □　{editing ? "Save Profile" : "Edit Profile"}
          </Button>
        }
      />
      <div className="profile-top">
        <Card className="identity">
          <div className="avatar">JD</div>
          <h2>Jane Marie Doe</h2>
          <p>Patient</p>
          <hr />
          <small>✉　Email</small>
          <span>jane.doe@example.com</span>
          <small>⚑　Phone</small>
          <span>(555) 867-5309</span>
          <b>●　Active Account</b>
        </Card>
        <Card>
          <CardTitle icon="♙">PERSONAL INFORMATION</CardTitle>
          <div className="detail-grid">
            {[
              ["FULL NAME", "Jane Marie Doe"],
              ["DATE OF BIRTH", "March 14, 1985"],
              ["EMAIL ADDRESS", "jane.doe@example.com"],
              ["PHONE NUMBER", "(555) 867-5309"],
            ].map(([a, b]) => (
              <label key={a}>
                <small>{a}</small>
                {editing ? <input defaultValue={b} /> : <span>{b}</span>}
              </label>
            ))}
          </div>
        </Card>
      </div>
      <div className="profile-bottom">
        <Card>
          <CardTitle icon="♧">ADDRESS</CardTitle>
          <div className="detail-grid address">
            {[
              ["STREET ADDRESS", "4821 Willowbrook Drive"],
              ["CITY", "San Francisco"],
              ["STATE", "CA"],
              ["ZIP CODE", "94102"],
            ].map(([a, b]) => (
              <label key={a}>
                <small>{a}</small>
                <span>{b}</span>
              </label>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle icon="⬡">EMERGENCY CONTACT</CardTitle>
          <div className="detail-grid">
            {[
              ["CONTACT NAME", "Robert Doe"],
              ["RELATIONSHIP", "Spouse"],
              ["PHONE NUMBER", "(555) 234-5678"],
            ].map(([a, b]) => (
              <label key={a}>
                <small>{a}</small>
                <span>{b}</span>
              </label>
            ))}
          </div>
          <div className="info-banner">
            ⓘ　This contact will be notified in case of a medical emergency.
            Please keep it up to date.
          </div>
        </Card>
      </div>
      <Card className="logout-card">
        <div>
          <b>Sign Out</b>
          <p>You will be logged out of all active sessions on this device.</p>
        </div>
        <Button variant="danger" onClick={() => go("login")}>
          ↪　Logout
        </Button>
      </Card>
    </>
  )
}

function Settings() {
  const [passwordOpen, setPasswordOpen] = useState(false)
  const {
    emailReminders,
    smsReminders,
    setEmailReminders,
    setSmsReminders,
  } = usePortalState()
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your CareConnect preferences."
      />
      <Card className="settings-card">
        <CardTitle>NOTIFICATIONS</CardTitle>
        <label>
          <span>
            <b>Email reminders</b>
            <small>Appointment and medication updates</small>
          </span>
          <input
            type="checkbox"
            checked={emailReminders}
            onChange={(event) => setEmailReminders(event.target.checked)}
          />
        </label>
        <label>
          <span>
            <b>SMS reminders</b>
            <small>Receive time-sensitive updates by text</small>
          </span>
          <input
            type="checkbox"
            checked={smsReminders}
            onChange={(event) => setSmsReminders(event.target.checked)}
          />
        </label>
      </Card>
      <Card className="settings-card">
        <CardTitle icon="⌘">PRIVACY & SECURITY</CardTitle>
        <div>
          <b>Password</b>
          <Button
            onClick={() => setPasswordOpen(true)}
            variant="secondary"
          >
            Change password
          </Button>
        </div>
        <div>
          <b>Two-factor authentication</b>
          <span className="badge green">Enabled</span>
        </div>
      </Card>
      <Modal
        description="Choose a unique password with at least eight characters."
        footer={
          <>
            <Button onClick={() => setPasswordOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button form="change-password-form" type="submit">
              Update password
            </Button>
          </>
        }
        onClose={() => setPasswordOpen(false)}
        open={passwordOpen}
        title="Change password"
      >
        <form
          className="modal-form-stack"
          id="change-password-form"
          onSubmit={(event) => {
            event.preventDefault()
            setPasswordOpen(false)
          }}
        >
          <Field
            autoComplete="current-password"
            label="Current password"
            minLength={6}
            name="currentPassword"
            placeholder="Enter current password"
            required
            type="password"
          />
          <Field
            autoComplete="new-password"
            hint="Use at least eight characters."
            label="New password"
            minLength={8}
            name="newPassword"
            placeholder="Enter new password"
            required
            type="password"
          />
          <Field
            autoComplete="new-password"
            label="Confirm new password"
            minLength={8}
            name="confirmPassword"
            placeholder="Re-enter new password"
            required
            type="password"
          />
        </form>
      </Modal>
    </>
  )
}

export function PortalLayout() {
  const route = routeFromPath(useLocation().pathname)
  const go = useGo()
  return (
    <Shell route={route} go={go}>
      <Outlet />
    </Shell>
  )
}

export function LoginRoute() {
  return <Login go={useGo()} />
}

export function ResetRoute() {
  return <Reset go={useGo()} />
}

export function HomeRoute() {
  return <Home go={useGo()} />
}

export function AppointmentsRoute() {
  return <Appointments />
}

export function MedicationsRoute() {
  return <Medications />
}

export function MessagesRoute() {
  return <Messages go={useGo()} />
}

export function NewMessageRoute() {
  return <NewMessage go={useGo()} />
}

export function ConversationRoute() {
  return <Conversation go={useGo()} />
}

export function ProfileRoute() {
  return <Profile go={useGo()} />
}

export function SettingsRoute() {
  return <Settings />
}

export function NotFoundRoute() {
  const go = useGo()
  return (
    <main className="not-found">
      <Brand auth />
      <h1>Page not found</h1>
      <p>The page you requested is unavailable.</p>
      <Button onClick={() => go("home")}>Return home</Button>
    </main>
  )
}
