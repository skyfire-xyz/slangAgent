"use client"


export default function Hero() {

  return (
    <div className="bg-gradient-to-b from-[#1A1C26] via-black to-[#ffd941] text-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">

          <div className="relative">
            <div
              className="absolute inset-0 bg-white/0 rounded-xl"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
