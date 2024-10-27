import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

import { NavItem } from "@/types/nav"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/pricing-culture-logo.png"
          alt="logo"
          width={200}
          height={30}
        />
        <X className="w-6 h-6 text-white" />
        <Image src="/skyfire-logo.svg" alt="logo" width={86} height={20} />
      </Link>
    </div>
  )
}
