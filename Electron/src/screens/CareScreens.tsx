import { useState } from "react"

import {
  Card,
  Detail,
  Icon,
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
        <Card>
          <small>NEXT APPOINTMENT</small>
          <strong>Today, 2:30 PM</strong>
          <p>Dr. Sarah Chen · Cardiology</p>
        </Card>
        <Card>
          <small>MEDICATIONS TODAY</small>
          <strong>3 of 4 taken</strong>
          <p>Next dose at 6:00 PM</p>
        </Card>
        <Card>
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
          <div className="appointment featured">
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
              onClick={() => onNavigate("appointments")}
            >
              View details
            </button>
          </div>
          <div className="appointment">
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
      <Card className="health-card">
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

const appointments = [
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

export function Appointments() {
  return (
    <>
      <PageHeading
        title="Appointments"
        subtitle="View and manage your upcoming care visits."
        action={<button className="primary">+ Schedule appointment</button>}
      />
      <div className="tabs" role="tablist" aria-label="Appointment status">
        <button className="active" role="tab" aria-selected="true">
          Upcoming
        </button>
        <button role="tab" aria-selected="false">
          Past
        </button>
        <button role="tab" aria-selected="false">
          Cancelled
        </button>
      </div>
      <Card className="list-card">
        {appointments.map(([date, title, provider, dateTime, status]) => (
          <div className="list-row appointment-row" key={title}>
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
            <span className="chevron">›</span>
          </div>
        ))}
      </Card>
      <Card className="help-card">
        <SectionTitle icon="info">NEED HELP?</SectionTitle>
        <p>
          Call the scheduling team at <b>(555) 018-2200.</b>
          <br />
          <span>Monday–Friday, 8:00 AM–6:00 PM</span>
        </p>
      </Card>
    </>
  )
}

const medications = [
  ["Lisinopril", "10 mg tablet", "Once daily · 8:00 AM", "Taken today"],
  ["Metformin", "500 mg tablet", "Twice daily · With meals", "Next at 6:00 PM"],
  ["Atorvastatin", "20 mg tablet", "Once daily · 9:00 PM", "Due tonight"],
]

export function Medications() {
  return (
    <>
      <PageHeading
        title="Medications"
        subtitle="Track your prescriptions and daily schedule."
        action={<button className="primary">+ Add medication</button>}
      />
      <div className="metric-grid">
        <Card>
          <small>ACTIVE MEDICATIONS</small>
          <strong>3</strong>
          <p>All prescriptions current</p>
        </Card>
        <Card>
          <small>TODAY'S PROGRESS</small>
          <strong>3 of 4</strong>
          <p>One dose remaining</p>
        </Card>
        <Card>
          <small>NEXT REFILL</small>
          <strong>12 days</strong>
          <p>Lisinopril · Mar 26</p>
        </Card>
      </div>
      <Card className="list-card medication-card">
        <SectionTitle>MY MEDICATIONS</SectionTitle>
        {medications.map(([name, dose, schedule, status], index) => (
          <div className="list-row medication-row" key={name}>
            <span className="med-icon">♨</span>
            <div>
              <b>{name}</b>
              <p>{dose}</p>
            </div>
            <div>
              <small>SCHEDULE</small>
              <p>{schedule}</p>
            </div>
            <span className={`pill med-status status-${index}`}>{status}</span>
            <button className="outline">Details</button>
          </div>
        ))}
      </Card>
      <div className="info-banner">
        <Icon name="info" /> Never change or stop a medication without speaking
        to your care team.
      </div>
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
        {messages.map(([day, time, subject, sender]) => (
          <div className="list-row message-row" key={subject}>
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
              onClick={() => onNavigate("conversation")}
            >
              Details
            </button>
          </div>
        ))}
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
      </aside>
      <section className="chat">
        <header>
          <div>
            <h1 tabIndex={-1}>Dr. Sarah Smith</h1>
            <p>Neurology</p>
          </div>
          <span>▣　Secure message</span>
        </header>
        <div className="chat-body">
          <span className="today">Today</span>
          <div className="bubble received">
            Your test results are ready, please let me know if you have any
            questions.
          </div>
          <time>10:42 AM</time>
          <div className="bubble sent">
            Thank you, Dr. Smith. I have a question but prefer to discuss it
            during the upcoming visit.
          </div>
          <time className="sent-time">10:45 AM</time>
          {replies.map((reply) => (
            <div className="bubble sent" key={reply}>
              {reply}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <span>⌕</span>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message..."
            aria-label="Type a message"
            onKeyDown={(event) => {
              if (event.key === "Enter") send()
            }}
          />
          <button aria-label="Send message" onClick={send}>
            ▷
          </button>
        </div>
      </section>
    </div>
  )
}

export function Profile() {
  return (
    <>
      <PageHeading
        title="Profile"
        subtitle="Manage your personal information and account settings"
        action={<button className="primary">□　Edit Profile</button>}
      />
      <div className="profile-grid">
        <Card className="identity-card">
          <span className="profile-avatar">JD</span>
          <h2>Jane Marie Doe</h2>
          <p>Patient</p>
          <hr />
          <small>Email</small>
          <span>jane.doe@example.com</span>
          <small>Phone</small>
          <span>(555) 867-5309</span>
          <b className="active-account">●　Active Account</b>
        </Card>
        <Card className="personal-card">
          <SectionTitle icon="user">PERSONAL INFORMATION</SectionTitle>
          <div className="detail-grid">
            <Detail label="FULL NAME" value="Jane Marie Doe" />
            <Detail label="DATE OF BIRTH" value="March 14, 1985" />
            <Detail label="EMAIL ADDRESS" value="jane.doe@example.com" />
            <Detail label="PHONE NUMBER" value="(555) 867-5309" />
          </div>
        </Card>
        <Card className="address-card">
          <SectionTitle icon="info">ADDRESS</SectionTitle>
          <div className="detail-grid address">
            <Detail label="STREET ADDRESS" value="4821 Willowbrook Drive" />
            <Detail label="CITY" value="San Francisco" />
            <Detail label="STATE" value="CA" />
            <Detail label="ZIP CODE" value="94102" />
          </div>
        </Card>
        <Card className="emergency-card">
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
            <button className="outline">Change password</button>
          </div>
          <div className="settings-action-row">
            <span>
              <b>Two-step verification</b>
              <small>Add an extra layer of protection to your account.</small>
            </span>
            <button className="outline">Set up</button>
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
    </>
  )
}
