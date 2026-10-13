import { useRef, useState, type FormEvent, type KeyboardEvent } from "react"

import {
  Card,
  Detail,
  Icon,
  ModalDialog,
  PageHeading,
  SectionTitle,
} from "../components/AppComponents"

import type { Screen } from "../types"

export function Dashboard({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  return (
    <>
      <PageHeading
        title="Good morning, Jane"
        subtitle="Here's an overview of your care today."
        action={<span className="all-connected">● All systems connected</span>}
      />
      <div className="metric-grid">
        <Card tabIndex={0}>
          <small>NEXT APPOINTMENT</small>
          <strong>Today, 2:30 PM</strong>
          <p>Dr. Sarah Chen · Cardiology</p>
        </Card>
        <Card tabIndex={0}>
          <small>MEDICATIONS TODAY</small>
          <strong>3 of 4 taken</strong>
          <p>Next dose at 6:00 PM</p>
        </Card>
        <Card tabIndex={0}>
          <small>CARE PLAN</small>
          <strong>82% on track</strong>
          <p>2 tasks due this week</p>
        </Card>
      </div>
      <div className="dashboard-grid">
        <Card>
          <div className="card-heading">
            <SectionTitle>UPCOMING APPOINTMENTS</SectionTitle>
            <button
              className="outline"
              onClick={() => onNavigate("appointments")}
            >
              View all
            </button>
          </div>
          <div className="appointment featured" tabIndex={0}>
            <time>
              <b>14</b>
              <small>MAR</small>
            </time>
            <div>
              <b>Cardiology follow-up</b>
              <p>Dr. Sarah Chen · Bay Medical Center</p>
              <span>2:30 PM</span>　 In person
            </div>
            <button
              className="primary"
              aria-label="View details"
              onClick={() => onNavigate("appointments")}
            >
              View details
            </button>
          </div>
          <div className="appointment" tabIndex={0}>
            <time>
              <b>21</b>
            </time>
            <div>
              <b>Physical therapy</b>
              <p>10:00 AM · Virtual visit</p>
            </div>
            <span>Fri</span>
          </div>
        </Card>
        <Card>
          <SectionTitle icon="info">TODAY'S CHECKLIST</SectionTitle>
          {[
            ["Morning medication", "Completed at 8:05 AM", true],
            ["Log blood pressure", "Due before 4:00 PM", true],
            ["Evening medication", "Scheduled for 6:00 PM", false],
            ["Daily movement", "20 minute goal", false],
          ].map(([name, detail, done]) => (
            <label className="check-row" key={String(name)}>
              <input type="checkbox" defaultChecked={Boolean(done)} />
              <span>
                <b>{name}</b>
                <small>{detail}</small>
              </span>
            </label>
          ))}
        </Card>
      </div>
      <Card className="health-card" tabIndex={0}>
        <SectionTitle icon="info">HEALTH SNAPSHOT</SectionTitle>
        <div className="health-grid">
          <span>
            <small>BLOOD PRESSURE</small>
            <b>118 / 76 mmHg</b>
          </span>
          <span>
            <small>RESTING HEART RATE</small>
            <b>68 bpm</b>
          </span>
          <span>
            <small>WEIGHT</small>
            <b>142.4 lbs</b>
          </span>
          <span>
            <small>LAST UPDATED</small>
            <b>Today, 9:15 AM</b>
          </span>
        </div>
      </Card>
    </>
  )
}

type AppointmentStatus = "Upcoming" | "Past" | "Cancelled"

interface AppointmentItem {
  date: string
  title: string
  provider: string
  dateTime: string
  status: AppointmentStatus | "Confirmed" | "Scheduled"
}

const initialAppointments: AppointmentItem[] = [
  {
    date: "MAR 14",
    title: "Cardiology follow-up",
    provider: "Dr. Sarah Chen",
    dateTime: "Today · 2:30 PM",
    status: "Confirmed",
  },
  {
    date: "MAR 21",
    title: "Physical therapy",
    provider: "Michael Torres, PT",
    dateTime: "Friday · 10:00 AM",
    status: "Scheduled",
  },
  {
    date: "APR 03",
    title: "Annual wellness visit",
    provider: "Dr. Robert Kim",
    dateTime: "Thursday · 9:00 AM",
    status: "Scheduled",
  },
]

const appointmentTabs: AppointmentStatus[] = ["Upcoming", "Past", "Cancelled"]

export function Appointments() {
  const [activeTab, setActiveTab] = useState<AppointmentStatus>("Upcoming")
  const [appointmentList, setAppointmentList] = useState(initialAppointments)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const visibleAppointments = appointmentList.filter((appointment) =>
    activeTab === "Upcoming"
      ? appointment.status === "Confirmed" || appointment.status === "Scheduled"
      : appointment.status === activeTab,
  )

  const selectTab = (index: number) => {
    const nextIndex =
      (index + appointmentTabs.length) % appointmentTabs.length
    setActiveTab(appointmentTabs[nextIndex])
    tabRefs.current[nextIndex]?.focus()
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = appointmentTabs.indexOf(
      event.currentTarget.textContent as AppointmentStatus,
    )
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault()
      selectTab(index + 1)
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault()
      selectTab(index - 1)
    } else if (event.key === "Home") {
      event.preventDefault()
      selectTab(0)
    } else if (event.key === "End") {
      event.preventDefault()
      selectTab(appointmentTabs.length - 1)
    }
  }

  const scheduleAppointment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = String(formData.get("appointment") ?? "").trim()
    const provider = String(formData.get("provider") ?? "").trim()
    const date = String(formData.get("date") ?? "")
    const time = String(formData.get("time") ?? "")
    if (!title || !provider || !date || !time) return

    const appointmentDate = new Date(`${date}T00:00:00`)
    const formattedDate = appointmentDate
      .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      .toUpperCase()
    const formattedDateTime = `${appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })} · ${time}`
    setAppointmentList((current) => [
      ...current,
      {
        date: formattedDate,
        title,
        provider,
        dateTime: formattedDateTime,
        status: "Scheduled",
      },
    ])
    setActiveTab("Upcoming")
    setAnnouncement(`Appointment scheduled: ${title}.`)
    setShowScheduleForm(false)
  }

  return (
    <>
      <PageHeading
        title="Appointments"
        subtitle="View and manage your upcoming care visits."
        action={
          <button
            className="primary"
            onClick={() => setShowScheduleForm(true)}
          >
            + Schedule appointment
          </button>
        }
      />
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <div
        className="tabs"
        role="tablist"
        aria-label="Appointment status"
        aria-orientation="horizontal"
      >
        {appointmentTabs.map((tab, index) => (
          <button
            key={tab}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            className={activeTab === tab ? "active" : ""}
            id={`appointment-tab-${tab.toLowerCase()}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls="appointment-panel"
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={handleTabKeyDown}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        id="appointment-panel"
        role="tabpanel"
        aria-labelledby={`appointment-tab-${activeTab.toLowerCase()}`}
      >
        <Card className="list-card">
          <div role="list" aria-label={`${activeTab} appointments`}>
            {visibleAppointments.length ? (
              visibleAppointments.map(
                ({ date, title, provider, dateTime, status }) => (
                  <div
                    className="list-row appointment-row"
                    key={title}
                    role="listitem"
                    tabIndex={0}
                  >
                    <time>{date}</time>
                    <div>
                      <b>{title}</b>
                      <p>{provider}</p>
                    </div>
                    <div>
                      <b>{dateTime}</b>
                      <p>In person</p>
                    </div>
                    <span
                      className={`pill ${status === "Confirmed" ? "confirmed" : ""}`}
                    >
                      {status}
                    </span>
                    <span className="chevron" aria-hidden="true">
                      ›
                    </span>
                  </div>
                ),
              )
            ) : (
              <p className="empty-state" role="listitem" tabIndex={0}>
                No {activeTab.toLowerCase()} appointments.
              </p>
            )}
          </div>
        </Card>
      </div>
      <Card className="help-card">
        <SectionTitle icon="info">NEED HELP?</SectionTitle>
        <p>
          Call the scheduling team at <b>(555) 018-2200.</b>
          <br />
          <span>Monday–Friday, 8:00 AM–6:00 PM</span>
        </p>
      </Card>
      {showScheduleForm && (
        <ModalDialog
          title="Schedule appointment"
          onClose={() => setShowScheduleForm(false)}
        >
          <form className="action-form" onSubmit={scheduleAppointment}>
            <label>
              Appointment
              <input name="appointment" required />
            </label>
            <label>
              Provider
              <input name="provider" required />
            </label>
            <label>
              Date
              <input name="date" type="date" required />
            </label>
            <label>
              Time
              <input name="time" type="time" required />
            </label>
            <button className="primary" type="submit">
              Schedule appointment
            </button>
          </form>
        </ModalDialog>
      )}
    </>
  )
}

interface MedicationItem {
  name: string
  dose: string
  schedule: string
  status: string
}

const initialMedications: MedicationItem[] = [
  {
    name: "Lisinopril",
    dose: "10 mg tablet",
    schedule: "Once daily · 8:00 AM",
    status: "Taken today",
  },
  {
    name: "Metformin",
    dose: "500 mg tablet",
    schedule: "Twice daily · With meals",
    status: "Next at 6:00 PM",
  },
  {
    name: "Atorvastatin",
    dose: "20 mg tablet",
    schedule: "Once daily · 9:00 PM",
    status: "Due tonight",
  },
]

export function Medications() {
  const [medicationList, setMedicationList] = useState(initialMedications)
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [announcement, setAnnouncement] = useState("")

  const addMedication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const dose = String(formData.get("dose") ?? "").trim()
    const schedule = String(formData.get("schedule") ?? "").trim()
    if (!name || !dose || !schedule) return

    setMedicationList((current) => [
      ...current,
      { name, dose, schedule, status: "Added today" },
    ])
    setAnnouncement(`Medication added: ${name}.`)
    setShowAddForm(false)
  }

  return (
    <>
      <PageHeading
        title="Medications"
        subtitle="Track your prescriptions and daily schedule."
        action={
          <button
            className="primary"
            onClick={() => setShowAddForm(true)}
          >
            + Add medication
          </button>
        }
      />
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <div className="metric-grid">
        <Card tabIndex={0}>
          <small>ACTIVE MEDICATIONS</small>
          <strong>{medicationList.length}</strong>
          <p>All prescriptions current</p>
        </Card>
        <Card tabIndex={0}>
          <small>TODAY'S PROGRESS</small>
          <strong>3 of 4</strong>
          <p>One dose remaining</p>
        </Card>
        <Card tabIndex={0}>
          <small>NEXT REFILL</small>
          <strong>12 days</strong>
          <p>Lisinopril · Mar 26</p>
        </Card>
      </div>
      <Card className="list-card medication-card">
        <SectionTitle>MY MEDICATIONS</SectionTitle>
        <div role="list" aria-label="My medications">
          {medicationList.map(({ name, dose, schedule, status }, index) => (
            <div
              className="list-row medication-row"
              key={name}
              role="listitem"
              tabIndex={0}
            >
              <span className="med-icon" aria-hidden="true">♨</span>
              <div>
                <b>{name}</b>
                <p>{dose}</p>
              </div>
              <div>
                <small>SCHEDULE</small>
                <p>{schedule}</p>
              </div>
              <span className={`pill med-status status-${index}`}>{status}</span>
              <button
                className="outline"
                aria-label="Details"
                onClick={() =>
                  setSelectedMedication({ name, dose, schedule, status })
                }
              >
                Details
              </button>
            </div>
          ))}
        </div>
      </Card>
      <div className="info-banner" tabIndex={0}>
        <Icon name="info" /> Never change or stop a medication without speaking
        to your care team.
      </div>
      {showAddForm && (
        <ModalDialog
          title="Add medication"
          onClose={() => setShowAddForm(false)}
        >
          <form className="action-form" onSubmit={addMedication}>
            <label>
              Medication name
              <input name="name" required />
            </label>
            <label>
              Dose
              <input name="dose" placeholder="e.g. 10 mg tablet" required />
            </label>
            <label>
              Schedule
              <input name="schedule" placeholder="e.g. Once daily · 8:00 AM" required />
            </label>
            <button className="primary" type="submit">
              Add medication
            </button>
          </form>
        </ModalDialog>
      )}
      {selectedMedication && (
        <ModalDialog
          title={selectedMedication.name}
          onClose={() => setSelectedMedication(null)}
        >
          <div
            className="action-form medication-details"
            tabIndex={0}
            aria-label={`${selectedMedication.name}. Dose: ${selectedMedication.dose}. Schedule: ${selectedMedication.schedule}. Status: ${selectedMedication.status}. Never change or stop a medication without speaking to your care team.`}
          >
            <p>
              <b>Dose</b>
              <span>{selectedMedication.dose}</span>
            </p>
            <p>
              <b>Schedule</b>
              <span>{selectedMedication.schedule}</span>
            </p>
            <p>
              <b>Status</b>
              <span>{selectedMedication.status}</span>
            </p>
            <p className="medication-safety-note">
              Never change or stop a medication without speaking to your care
              team.
            </p>
          </div>
        </ModalDialog>
      )}
    </>
  )
}

const messages = [
  [
    "Today",
    "9.00 AM",
    "Your test results are ready",
    "Dr. Barrow Gastroenterology",
  ],
  ["Yesterday", "3.00 PM", "Please let us know if...", "Dr. Smith Neurology"],
  ["Sept 25", "8.00 AM", "Annual wellness visit Reminder", "Dr. Robert Kim"],
]

export function Messages({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  return (
    <>
      <PageHeading
        title="Messages"
        subtitle="View and manage your communication."
        action={
          <button className="primary" onClick={() => onNavigate("new-message")}>
            + New Message
          </button>
        }
      />
      <Card className="list-card messages-card">
        <div role="list" aria-label="Messages">
          {messages.map(([day, time, subject, sender]) => (
            <div
              className="list-row message-row"
              key={subject}
              role="listitem"
              tabIndex={0}
            >
              <time>
                <b>{day}</b>
                <b>{time}</b>
              </time>
              <div>
                <b>{subject}</b>
                <p>{sender}</p>
              </div>
              <button
                className="outline"
                aria-label="Details"
                onClick={() => onNavigate("conversation")}
              >
                Details
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

export function NewMessage({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  return (
    <>
      <PageHeading
        title="New Message"
        subtitle="Compose a secure message to your provider."
        action={
          <button
            className="round-back"
            aria-label="Back to messages"
            onClick={() => onNavigate("messages")}
          >
            ‹
          </button>
        }
      />
      <form
        className="compose-card"
        onSubmit={(event) => {
          event.preventDefault()
          onNavigate("messages")
        }}
      >
        <label>
          To
          <input placeholder="Enter provider name" required />
        </label>
        <label>
          Message
          <textarea placeholder="Type your message here" required />
        </label>
        <label className="attachment">
          ⌕　 Add an attachment
          <input type="file" />
        </label>
        <button className="primary send-message" type="submit">
          ▷　 Send Message
        </button>
      </form>
    </>
  )
}

export function Conversation({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  const [draft, setDraft] = useState("")
  const [replies, setReplies] = useState<string[]>([])
  const send = () => {
    if (draft.trim()) {
      setReplies((current) => [...current, draft.trim()])
      setDraft("")
    }
  }
  return (
    <div className="conversation-layout">
      <aside className="provider-panel">
        <button
          className="provider-back"
          onClick={() => onNavigate("messages")}
        >
          ‹ <span>Back to Messages</span>
        </button>
        <div
          className="provider-summary"
          role="group"
          aria-label="Provider information"
          tabIndex={0}
        >
          <span className="provider-avatar">SS</span>
          <h2>Dr. Sarah Smith</h2>
          <p>Neurology</p>
          <span className="reply-time">●　Usually replies in 1–2 days</span>
          <div className="visit-card">
            <b>▣　Upcoming visit</b>
            <p>
              September 5 · 10:00 AM
              <br />
              Neurology follow-up
            </p>
          </div>
          <p className="privacy">
            ♢　This conversation is private and protected as part of your health
            record.
          </p>
        </div>
      </aside>
      <section className="chat">
        <header>
          <div>
            <h1 tabIndex={-1}>Dr. Sarah Smith</h1>
            <p>Neurology</p>
          </div>
          <span>▣　Secure message</span>
        </header>
        <div
          className="chat-body"
          role="log"
          aria-live="polite"
          aria-label="Conversation with Dr. Sarah Smith"
        >
          <span className="today">Today</span>
          <div
            className="bubble received"
            role="group"
            aria-label="Message from Dr. Sarah Smith at 10:42 AM: Your test results are ready, please let me know if you have any questions."
            tabIndex={0}
          >
            Your test results are ready, please let me know if you have any
            questions.
          </div>
          <time>10:42 AM</time>
          <div
            className="bubble sent"
            role="group"
            aria-label="Message from you at 10:45 AM: Thank you, Dr. Smith. I have a question but prefer to discuss it during the upcoming visit."
            tabIndex={0}
          >
            Thank you, Dr. Smith. I have a question but prefer to discuss it
            during the upcoming visit.
          </div>
          <time className="sent-time">10:45 AM</time>
          {replies.map((reply) => (
            <div
              className="bubble sent"
              key={reply}
              role="group"
              aria-label={`Message from you: ${reply}`}
              tabIndex={0}
            >
              {reply}
            </div>
          ))}
        </div>
        <form
          className="chat-input"
          aria-label="Reply to Dr. Sarah Smith"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <span aria-hidden="true">⌕</span>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message..."
            aria-label="Type a message"
          />
          <button type="submit" aria-label="Send message">
            ▷
          </button>
        </form>
      </section>
    </div>
  )
}

interface ProfileDetails {
  name: string
  email: string
  phone: string
}

const initialProfile: ProfileDetails = {
  name: "Jane Marie Doe",
  email: "jane.doe@example.com",
  phone: "(555) 867-5309",
}

export function Profile() {
  const [profile, setProfile] = useState(initialProfile)
  const [editing, setEditing] = useState(false)
  const [announcement, setAnnouncement] = useState("")

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const phone = String(formData.get("phone") ?? "").trim()
    if (!name || !email || !phone) return
    setProfile({ name, email, phone })
    setAnnouncement("Profile saved.")
    setEditing(false)
  }

  return (
    <>
      <PageHeading
        title="Profile"
        subtitle="Manage your personal information and account settings"
        action={
          <button className="primary" onClick={() => setEditing(true)}>
            □　Edit Profile
          </button>
        }
      />
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <div className="profile-grid">
        <Card className="identity-card" tabIndex={0}>
          <span className="profile-avatar">JD</span>
          <h2>{profile.name}</h2>
          <p>Patient</p>
          <hr />
          <small>Email</small>
          <span>{profile.email}</span>
          <small>Phone</small>
          <span>{profile.phone}</span>
          <b className="active-account">●　Active Account</b>
        </Card>
        <Card className="personal-card" tabIndex={0}>
          <SectionTitle icon="user">PERSONAL INFORMATION</SectionTitle>
          <div className="detail-grid">
            <Detail label="FULL NAME" value={profile.name} />
            <Detail label="DATE OF BIRTH" value="March 14, 1985" />
            <Detail label="EMAIL ADDRESS" value={profile.email} />
            <Detail label="PHONE NUMBER" value={profile.phone} />
          </div>
        </Card>
        <Card className="address-card" tabIndex={0}>
          <SectionTitle icon="info">ADDRESS</SectionTitle>
          <div className="detail-grid address">
            <Detail label="STREET ADDRESS" value="4821 Willowbrook Drive" />
            <Detail label="CITY" value="San Francisco" />
            <Detail label="STATE" value="CA" />
            <Detail label="ZIP CODE" value="94102" />
          </div>
        </Card>
        <Card className="emergency-card" tabIndex={0}>
          <SectionTitle icon="info">EMERGENCY CONTACT</SectionTitle>
          <div className="detail-grid">
            <Detail label="CONTACT NAME" value="Robert Doe" />
            <Detail label="RELATIONSHIP" value="Spouse" />
            <Detail label="PHONE NUMBER" value="(555) 234-5678" />
          </div>
          <div className="emergency-note">
            ⓘ　This contact will be notified in case of a medical emergency.
            Please keep it up to date.
          </div>
        </Card>
      </div>
      {editing && (
        <ModalDialog
          title="Edit profile"
          onClose={() => setEditing(false)}
        >
          <form className="action-form" onSubmit={saveProfile}>
            <label>
              Full name
              <input name="name" defaultValue={profile.name} required />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                defaultValue={profile.email}
                required
              />
            </label>
            <label>
              Phone number
              <input name="phone" defaultValue={profile.phone} required />
            </label>
            <button className="primary" type="submit">
              Save profile
            </button>
          </form>
        </ModalDialog>
      )}
    </>
  )
}

function SettingToggle({
  title,
  description,
  defaultChecked = false,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <label className="setting-row">
      <span>
        <b>{title}</b>
        <small>{description}</small>
      </span>
      <input type="checkbox" defaultChecked={defaultChecked} />
    </label>
  )
}

export function Settings() {
  const [saved, setSaved] = useState(false)
  const [accountDialog, setAccountDialog] = useState<"password" | "two-step" | null>(
    null,
  )
  const [twoStepEnabled, setTwoStepEnabled] = useState(false)
  const [accountMessage, setAccountMessage] = useState("")
  const [accountError, setAccountError] = useState("")

  const saveAccountAction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (accountDialog === "two-step") {
      setTwoStepEnabled(true)
      setAccountMessage(
        "Two-step verification setup is saved for this demo account.",
      )
    } else {
      const formData = new FormData(event.currentTarget)
      if (formData.get("new-password") !== formData.get("confirm-password")) {
        setAccountError("The new passwords do not match.")
        return
      }
      setAccountMessage("Your password change request is saved for this demo.")
    }
    setAccountError("")
    setAccountDialog(null)
  }

  return (
    <>
      <PageHeading
        title="Settings"
        subtitle="Manage your CareConnect preferences."
        action={
          <button
            className="primary"
            onClick={() => {
              setSaved(true)
              window.setTimeout(() => setSaved(false), 2200)
            }}
          >
            Save changes
          </button>
        }
      />
      {saved && (
        <div className="save-confirmation" role="status" aria-live="polite">
          ✓ Your settings have been saved.
        </div>
      )}
      <div className="settings-grid">
        <Card className="settings-card">
          <SectionTitle icon="message">NOTIFICATIONS</SectionTitle>
          <SettingToggle
            title="Appointment reminders"
            description="Receive reminders before scheduled appointments."
            defaultChecked
          />
          <SettingToggle
            title="Medication reminders"
            description="Get notified when it is time to take a medication."
            defaultChecked
          />
          <SettingToggle
            title="New messages"
            description="Receive an alert when your care team sends a message."
            defaultChecked
          />
        </Card>

        <Card className="settings-card">
          <SectionTitle icon="user">ACCOUNT</SectionTitle>
          <div className="settings-action-row">
            <span>
              <b>Password</b>
              <small>Last changed 3 months ago</small>
            </span>
            <button
              className="outline"
              onClick={() => {
                setAccountMessage("")
                setAccountError("")
                setAccountDialog("password")
              }}
            >
              Change password
            </button>
          </div>
          <div className="settings-action-row">
            <span>
              <b>Two-step verification</b>
              <small>Add an extra layer of protection to your account.</small>
            </span>
            <button
              className="outline"
              onClick={() => {
                setAccountMessage("")
                setAccountError("")
                setAccountDialog("two-step")
              }}
            >
              {twoStepEnabled ? "Enabled" : "Set up"}
            </button>
          </div>
          <label className="select-setting">
            <span>
              <b>Language</b>
              <small>Choose your preferred display language.</small>
            </span>
            <select defaultValue="English">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </label>
        </Card>
      </div>
      <div className="settings-support">
        <Icon name="info" />
        <span>
          <b>Need help with your settings?</b>
          Contact CareConnect Support at <strong>(555) 018-2200</strong>.
        </span>
      </div>
      {accountMessage && (
        <p className="save-confirmation" role="status" aria-live="polite">
          {accountMessage}
        </p>
      )}
      {accountDialog && (
        <ModalDialog
          title={
            accountDialog === "password"
              ? "Change password"
              : "Set up two-step verification"
          }
          onClose={() => setAccountDialog(null)}
        >
          {accountDialog === "password" ? (
            <form className="action-form" onSubmit={saveAccountAction}>
              <p>
                This demo validates the request locally and does not update a
                real account password.
              </p>
              <label>
                Current password
                <input
                  name="current-password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              <label>
                New password
                <input
                  name="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
              <label>
                Confirm new password
                <input
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
              <button className="primary" type="submit">
                Save password change request
              </button>
            </form>
          ) : (
            <form className="action-form" onSubmit={saveAccountAction}>
              <p>
                Add an extra sign-in step by confirming your email address.
              </p>
              <label>
                Email address
                <input
                  name="two-step-email"
                  type="email"
                  defaultValue="jane.doe@example.com"
                  required
                />
              </label>
              <button className="primary" type="submit">
                Enable two-step verification
              </button>
            </form>
          )}
          {accountError && (
            <p className="form-error" role="alert">
              {accountError}
            </p>
          )}
        </ModalDialog>
      )}
    </>
  )
}
