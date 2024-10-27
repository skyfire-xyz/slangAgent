import { useEffect, useState } from "react"

export function useSanitizeHTML(htmlContent: string): string {
  const [sanitizedContent, setSanitizedContent] = useState("")

  useEffect(() => {
    const sanitizeHTML = (html: string): string => {
      const tempElement = document.createElement("div")
      tempElement.innerHTML = html
      return tempElement.textContent || tempElement.innerText || ""
    }

    setSanitizedContent(sanitizeHTML(htmlContent))
  }, [htmlContent])

  return sanitizedContent
}
