"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import { usePricingCulture } from "@/lib/pricing-culture/context"
import { MarketCompObject, MarketCompParams } from "@/lib/pricing-culture/type"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const columns: ColumnDef<MarketCompObject>[] = [
  {
    id: "params",
    accessorKey: "params",
    header: "",
    cell: ({ row }) => {
      const params = row.getValue("params") as MarketCompParams

      return (
        <div className="capitalize bg-gradient p-4 rounded-lg">
          {params.img_url ? (
            <img
              src={params.img_url}
              className="invert h-[50px] w-[100px] object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-[50px] text-black">
              No Image
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    id: "price_range",
    accessorFn: (row) =>
      `${row.params.min_price ? formatPrice(row.params.min_price) : "NaN"} - ${
        row.params.max_price ? formatPrice(row.params.max_price) : "NaN"
      }`,
    header: "Price Range",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("price_range")}</div>
    ),
  },
  {
    id: "available",
    accessorFn: (row) => (row.available_for_buyer ? "Yes" : "No"),
    header: "Availability",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("available")}</div>
    ),
  },
]

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectComp, setSelectComp] = React.useState<number | undefined>()
  const { marketComps } = usePricingCulture()

  const table = useReactTable({
    data: marketComps,
    columns,
    enableRowSelection: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640
      setColumnVisibility({
        description: !isMobile,
        available: !isMobile,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const routetr = useRouter()

  return (
    <div className="w-full">
      <DateRangePicker
        align="start"
        locale="en-GB"
        showCompare={false}
        selectedComp={selectComp}
        onClose={() => setSelectComp(undefined)}
        onSelect={(range) => {
          routetr.push(
            `/detail/${selectComp}?from=${
              range.from?.toISOString().split("T")[0]
            }&to=${range.to?.toISOString().split("T")[0]}`
          )
        }}
      />
      <div className="flex items-center py-4">
        <Input
          placeholder="Search"
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setSelectComp(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
