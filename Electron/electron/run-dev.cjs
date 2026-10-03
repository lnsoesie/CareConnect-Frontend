const { spawn } = require("node:child_process")

const electronBinary = require("electron")

const port = process.env.PORT || "8443"

const viteUrl = `http://127.0.0.1:${port}/`

async function isViteAvailable() {
  try {
    const response = await fetch(viteUrl)

    return response.ok
  } catch {
    return false
  }
}

async function start() {
  let viteServer

  if (!(await isViteAvailable())) {
    const { createServer } = await import("vite")

    viteServer = await createServer()

    await viteServer.listen()

    console.log(`Vite development server ready at ${viteUrl}`)
  } else {
    console.log(`Using existing Vite development server at ${viteUrl}`)
  }

  const electron = spawn(electronBinary, ["."], {
    env: process.env,

    stdio: "inherit",
  })

  let isShuttingDown = false

  const stop = async (exitCode) => {
    if (isShuttingDown) return

    isShuttingDown = true

    electron.kill()

    await viteServer?.close()

    process.exitCode = exitCode
  }

  electron.on("error", (error) => {
    console.error("Failed to launch Electron:", error)

    void stop(1)
  })

  electron.on("exit", (code) => {
    void stop(code ?? 1)
  })

  process.on("SIGINT", () => void stop(0))

  process.on("SIGTERM", () => void stop(0))
}

start().catch((error) => {
  console.error("Failed to start desktop development:", error)

  process.exitCode = 1
})
