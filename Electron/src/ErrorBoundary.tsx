import { Component, ErrorInfo, ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("CareConnect renderer error", error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#f5f7fa] p-8 flex items-center justify-center">
          <section
            className="w-full max-w-lg rounded-xl border border-[#d5d5d5] bg-white p-8 shadow-sm"
            aria-labelledby="renderer-error-title"
          >
            <h1
              className="text-2xl font-bold text-[#2d2d2d]"
              id="renderer-error-title"
            >
              CareConnect needs to reload
            </h1>
            <p className="mt-3 leading-6 text-[#595959]">
              The application encountered an unexpected renderer error. Reload
              to restore your session.
            </p>
            <button
              className="mt-6 min-h-11 rounded bg-[#1565c0] px-5 font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffbf47]"
              onClick={() => window.location.reload()}
            >
              Reload CareConnect
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
