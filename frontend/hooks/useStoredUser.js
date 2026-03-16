import { useSyncExternalStore } from "react"

const subscribe = (callback) => {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleChange = () => {
    callback()
  }

  window.addEventListener("storage", handleChange)
  window.addEventListener("user-auth-changed", handleChange)

  return () => {
    window.removeEventListener("storage", handleChange)
    window.removeEventListener("user-auth-changed", handleChange)
  }
}

export default function useStoredUser() {
  return useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" ? localStorage.getItem("user") : null),
    () => null
  )
}
