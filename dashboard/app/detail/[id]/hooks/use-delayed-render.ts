import { useEffect, useState } from "react"

export function useDelayedRender(delayTime = 1000) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), delayTime)
    return () => clearTimeout(timer)
  }, [delayTime])

  return shouldRender
}
