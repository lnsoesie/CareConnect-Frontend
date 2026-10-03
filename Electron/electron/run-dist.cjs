const { spawn } = require("node:child_process")

const electronBinary = require("electron")
const child = spawn(electronBinary, ["."], {
  env: {
    ...process.env,
    CARECONNECT_LOAD_DIST: "1",
  },
  stdio: "inherit",
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
  } else {
    process.exit(code ?? 1)
  }
})
