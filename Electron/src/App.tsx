import { useEffect, useState } from "react"
import { Shell } from "./components/AppShell"
import { Login, Recovery } from "./screens/AuthScreens"
import {
  Appointments,
  Conversation,
  Dashboard,
  Medications,
  Messages,
  NewMessage,
  Profile,
  Settings,
} from "./screens/CareScreens"
import type { Screen } from "./types"

export default function App() {
  const [screen, setScreen] = useState<Screen>("login")

  useEffect(() => {
    return window.careConnectDesktop?.onNavigate((destination) =>
      setScreen(destination),
    )
  }, [])

  if (screen === "login") return <Login onNavigate={setScreen} />
  if (screen === "recovery") return <Recovery onNavigate={setScreen} />
  return (
    <Shell screen={screen} onNavigate={setScreen}>
      {screen === "dashboard" && <Dashboard onNavigate={setScreen} />}
      {screen === "appointments" && <Appointments />}
      {screen === "medications" && <Medications />}
      {screen === "messages" && <Messages onNavigate={setScreen} />}
      {screen === "new-message" && <NewMessage onNavigate={setScreen} />}
      {screen === "conversation" && <Conversation onNavigate={setScreen} />}
      {screen === "profile" && <Profile />}
      {screen === "settings" && <Settings />}
    </Shell>
  )
}
