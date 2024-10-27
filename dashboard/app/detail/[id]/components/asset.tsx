import Link from "next/link"
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  Link1Icon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

import { AssetInfo } from "@/lib/pricing-culture/type"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { useSanitizeHTML } from "../hooks/use-sanitize-html"
import Chart from "./chart"

interface AssetProps {
  asset: AssetInfo
  price: string
}
export default function Asset({ asset, price }: AssetProps) {
  const sanitizedDescription = useSanitizeHTML(asset?.description)
  return (
    <Card className="w-full h-[calc(100%-1.5rem)] flex flex-col">
      <CardHeader>
        <CardTitle>
          <Link
            href={asset.url}
            target="_blank"
            className="flex gap-4 hover:underline items-center"
          >
            {asset.name}
            <Link1Icon className="mr-2 h-4 w-4" />
          </Link>
        </CardTitle>
        <CardDescription className="text-xl font-bold">
          {formatPrice(price)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 pb-4">
          <CardDescription>{sanitizedDescription}</CardDescription>
        </div>
        <div className="mt-auto">
          <Carousel className="w-[85%] mx-auto">
            <CarouselContent>
              {asset.media.map((url: string, index: number) => (
                <CarouselItem key={index} className="basis-1/3">
                  <img src={url} alt={url} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  )
}
