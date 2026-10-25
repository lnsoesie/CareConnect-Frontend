import { RouterProvider } from "react-router"
import { router } from "./routes"
import { PortalProvider } from "./store"

export default function App() {
  return (
    <PortalProvider>
      <RouterProvider router={router} />
    </PortalProvider>
  )
}
