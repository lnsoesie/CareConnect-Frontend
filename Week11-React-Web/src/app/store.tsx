import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type PortalState = {
  checkedTasks: boolean[]
  takenMedications: string[]
  conversationMessages: string[]
  emailReminders: boolean
  smsReminders: boolean
}

type PortalContextValue = PortalState & {
  toggleTask: (index: number) => void
  toggleMedication: (name: string) => void
  sendConversationMessage: (message: string) => void
  setEmailReminders: (enabled: boolean) => void
  setSmsReminders: (enabled: boolean) => void
}

const initialState: PortalState = {
  checkedTasks: [true, true, false, false],
  takenMedications: ["Lisinopril"],
  conversationMessages: [
    "Thank you, Dr. Smith. I have a question but prefer to discuss it during the upcoming visit.",
  ],
  emailReminders: true,
  smsReminders: false,
}

const STORAGE_KEY = "careconnect.portal-state"
const PortalContext = createContext<PortalContextValue | null>(null)

function loadState(): PortalState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? { ...initialState, ...(JSON.parse(stored) as Partial<PortalState>) }
      : initialState
  } catch {
    return initialState
  }
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortalState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<PortalContextValue>(
    () => ({
      ...state,
      toggleTask: (index) =>
        setState((current) => ({
          ...current,
          checkedTasks: current.checkedTasks.map((checked, itemIndex) =>
            itemIndex === index ? !checked : checked,
          ),
        })),
      toggleMedication: (name) =>
        setState((current) => ({
          ...current,
          takenMedications: current.takenMedications.includes(name)
            ? current.takenMedications.filter((medication) => medication !== name)
            : [...current.takenMedications, name],
        })),
      sendConversationMessage: (message) =>
        setState((current) => ({
          ...current,
          conversationMessages: [
            ...current.conversationMessages,
            message.trim(),
          ],
        })),
      setEmailReminders: (emailReminders) =>
        setState((current) => ({ ...current, emailReminders })),
      setSmsReminders: (smsReminders) =>
        setState((current) => ({ ...current, smsReminders })),
    }),
    [state],
  )

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  )
}

export function usePortalState() {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error("usePortalState must be used within PortalProvider")
  }
  return context
}
