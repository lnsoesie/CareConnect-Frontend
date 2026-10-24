import { createBrowserRouter, Navigate } from "react-router"
function RouteFallback() {
  return (
    <div role="status" aria-live="polite">
      Loading CareConnect...
    </div>
  )
}

export const router = createBrowserRouter(
  [
    {
      path: "/login",
      lazy: async () => ({
        Component: (await import("./screens")).LoginRoute,
      }),
    },
    {
      path: "/reset-password",
      lazy: async () => ({
        Component: (await import("./screens")).ResetRoute,
      }),
    },
    {
      
  path: "/",
  HydrateFallback: RouteFallback,
  lazy: async () => ({
    Component: (await import("./screens")).PortalLayout,
  }),
  children: [
        {
          index: true,
          lazy: async () => ({
            Component: (await import("./screens")).HomeRoute,
          }),
        },
        {
          path: "appointments",
          lazy: async () => ({
            Component: (await import("./screens")).AppointmentsRoute,
          }),
        },
        {
          path: "medications",
          lazy: async () => ({
            Component: (await import("./screens")).MedicationsRoute,
          }),
        },
        {
          path: "messages",
          lazy: async () => ({
            Component: (await import("./screens")).MessagesRoute,
          }),
        },
        {
          path: "messages/new",
          lazy: async () => ({
            Component: (await import("./screens")).NewMessageRoute,
          }),
        },
        {
          path: "messages/dr-sarah-smith",
          lazy: async () => ({
            Component: (await import("./screens")).ConversationRoute,
          }),
        },
        {
          path: "profile",
          lazy: async () => ({
            Component: (await import("./screens")).ProfileRoute,
          }),
        },
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("./screens")).SettingsRoute,
          }),
        },
      ],
    },
    {
      path: "/404",
      lazy: async () => ({
        Component: (await import("./screens")).NotFoundRoute,
      }),
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ],
  { basename: import.meta.env.BASE_URL },
)
