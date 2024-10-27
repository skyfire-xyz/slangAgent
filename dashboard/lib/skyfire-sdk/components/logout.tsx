import React from "react"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LogoutButtonProps {
  onLogout: () => void
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={onLogout} className="bg-secondary">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Logout (Clears your saved API key)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
