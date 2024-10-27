import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { PaymentClaim } from "../context/type"
import { usdAmount } from "../util"

interface Claim {
  id: string
  destinationName: string
  value: number
  createdAt: string
}

interface ClaimsWidgetProps {
  claims: PaymentClaim[]
}

export function ClaimsWidget({ claims }: ClaimsWidgetProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(claims.length / itemsPerPage)

  const paginatedClaims = claims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="w-full flex-grow">
      <CardHeader>
        <CardTitle>Claims</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Destination</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">
                    {claim.destinationName}
                  </TableCell>
                  <TableCell>{usdAmount(claim.value)}</TableCell>
                  <TableCell className="text-right">
                    {formatDate(claim.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
