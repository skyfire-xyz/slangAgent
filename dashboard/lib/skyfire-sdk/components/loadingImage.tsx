import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface LoadingImageWidgetProps {
  src: string
  alt: string
  size: number
  loading: boolean
}

export default function LoadingImageWidget({
  src,
  alt,
  size,
  loading,
}: LoadingImageWidgetProps) {
  const strokeWidth = 2
  const padding = 4 // Add padding to create space between image and loader
  const imageSize = size - padding * 2 - strokeWidth * 2
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={imageSize}
          height={imageSize}
          className="rounded-full"
        />
      </div>
      {loading && (
        <svg
          className="absolute top-0 left-0 -rotate-90"
          width={size}
          height={size}
        >
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--primary-foreground))"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      )}
    </div>
  )
}
