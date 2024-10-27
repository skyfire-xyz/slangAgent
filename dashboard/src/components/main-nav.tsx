import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"


export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image
        src="images/aichat/logo-slangAgent.svg"
        alt="logo"
        width={227}
        height={53}
        />
        <X className="w-6 h-6 text-white" />
        <Image src="images/aichat/skyfire-logo.svg" alt="logo" width={86} height={20} />
      </Link>
    </div>
  )
}
