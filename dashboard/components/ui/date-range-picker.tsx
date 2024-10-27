"use client"

import React, { useEffect, useRef, useState, type FC } from "react"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "./button"
import { Calendar } from "./calendar"
import { DateInput } from "./date-input"
import { Label } from "./label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Switch } from "./switch"

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void
  /** Initial value for start date */
  initialDateFrom?: Date | string
  /** Initial value for end date */
  initialDateTo?: Date | string
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string
  /** Alignment of popover */
  align?: "start" | "center" | "end"
  /** Option for locale */
  locale?: string
  /** Option for showing compare feature */
  showCompare?: boolean

  selectedComp: number | undefined
  onClose: () => void
  onSelect: (range: DateRange) => void
}

const formatDate = (date: Date, locale: string = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    const parts = dateInput.split("-").map((part) => parseInt(part, 10))
    const date = new Date(parts[0], parts[1] - 1, parts[2])
    return date
  } else {
    return dateInput
  }
}

interface DateRange {
  from: Date
  to: Date | undefined
}

interface Preset {
  name: string
  label: string
}

const PRESETS: Preset[] = [
  { name: "last7", label: "Last 7 days" },
  { name: "last14", label: "Last 14 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisWeek", label: "This Week" },
  { name: "lastWeek", label: "Last Week" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
]

const MAX_DATE_RANGE = 31 // Maximum allowed date range in days

const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const DateRangePicker: FC<DateRangePickerProps> & {
  filePath: string
} = ({
  initialDateFrom = new Date(new Date().setDate(new Date().getDate() - 6)),
  initialDateTo = new Date(new Date().setHours(0, 0, 0, 0)),
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = "end",
  locale = "en-US",
  showCompare = true,
  selectedComp,
  onClose,
  onSelect,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)

  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom),
  })
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
          to: initialCompareTo
            ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
            : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
        }
      : undefined
  )

  const openedRangeRef = useRef<DateRange | undefined>()
  const openedRangeCompareRef = useRef<DateRange | undefined>()

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined
  )

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 960 : false
  )

  const [warningMessage, setWarningMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const setRangeWithLimit = (newRange: DateRange) => {
    const daysDifference = getDaysDifference(
      newRange.from,
      newRange.to || newRange.from
    )
    if (daysDifference > MAX_DATE_RANGE) {
      setWarningMessage(`Date range cannot exceed ${MAX_DATE_RANGE} days`)
      return
    }
    setWarningMessage(null)
    setRange(newRange)
  }

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName)
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
    const from = new Date()
    const to = new Date()
    const first = from.getDate() - from.getDay()

    switch (preset.name) {
      case "last7":
        from.setDate(from.getDate() - 6)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "last14":
        from.setDate(from.getDate() - 13)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "last30":
        from.setDate(from.getDate() - 29)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "thisWeek":
        from.setDate(first)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "lastWeek":
        from.setDate(from.getDate() - 7 - from.getDay())
        to.setDate(to.getDate() - to.getDay() - 1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "thisMonth":
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "lastMonth":
        from.setMonth(from.getMonth() - 1)
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setDate(0)
        to.setHours(23, 59, 59, 999)
        break
    }

    return { from, to }
  }

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset)
    setRangeWithLimit(range)
    if (rangeCompare) {
      const rangeCompare = {
        from: new Date(
          range.from.getFullYear() - 1,
          range.from.getMonth(),
          range.from.getDate()
        ),
        to: range.to
          ? new Date(
              range.to.getFullYear() - 1,
              range.to.getMonth(),
              range.to.getDate()
            )
          : undefined,
      }
      setRangeCompare(rangeCompare)
    }
  }

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name)

      const normalizedRangeFrom = new Date(range.from)
      normalizedRangeFrom.setHours(0, 0, 0, 0)
      const normalizedPresetFrom = new Date(
        presetRange.from.setHours(0, 0, 0, 0)
      )

      const normalizedRangeTo = new Date(range.to ?? 0)
      normalizedRangeTo.setHours(0, 0, 0, 0)
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0
      )

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name)
        return
      }
    }

    setSelectedPreset(undefined)
  }

  const resetValues = (): void => {
    setRangeWithLimit({
      from:
        typeof initialDateFrom === "string"
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === "string"
          ? getDateAdjustedForTimezone(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === "string"
        ? getDateAdjustedForTimezone(initialDateFrom)
        : initialDateFrom,
    })
    setRangeCompare(
      initialCompareFrom
        ? {
            from:
              typeof initialCompareFrom === "string"
                ? getDateAdjustedForTimezone(initialCompareFrom)
                : initialCompareFrom,
            to: initialCompareTo
              ? typeof initialCompareTo === "string"
                ? getDateAdjustedForTimezone(initialCompareTo)
                : initialCompareTo
              : typeof initialCompareFrom === "string"
              ? getDateAdjustedForTimezone(initialCompareFrom)
              : initialCompareFrom,
          }
        : undefined
    )
  }

  useEffect(() => {
    checkPreset()
  }, [range])

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string
    label: string
    isSelected: boolean
  }): JSX.Element => (
    <Button
      className={cn(isSelected && "pointer-events-none")}
      variant="ghost"
      onClick={() => {
        setPreset(preset)
      }}
    >
      <>
        <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
          <CheckIcon width={18} height={18} />
        </span>
        {label}
      </>
    </Button>
  )

  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    )
  }

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range
      openedRangeCompareRef.current = rangeCompare
    }
  }, [isOpen])

  return (
    <Dialog open={selectedComp !== undefined}>
      <DialogContent className="md:min-w-[800px] min-w-full">
        <DialogHeader>
          <DialogTitle>Please pick date range</DialogTitle>
          <DialogDescription>
            <div className="flex py-2 justify-center">
              <div className="flex">
                <div className="flex flex-col">
                  <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                    {showCompare && (
                      <div className="flex items-center space-x-2 pr-4 py-1">
                        <Switch
                          defaultChecked={Boolean(rangeCompare)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              if (!range.to) {
                                setRangeWithLimit({
                                  from: range.from,
                                  to: range.from,
                                })
                              }
                              setRangeCompare({
                                from: new Date(
                                  range.from.getFullYear(),
                                  range.from.getMonth(),
                                  range.from.getDate() - 365
                                ),
                                to: range.to
                                  ? new Date(
                                      range.to.getFullYear() - 1,
                                      range.to.getMonth(),
                                      range.to.getDate()
                                    )
                                  : new Date(
                                      range.from.getFullYear() - 1,
                                      range.from.getMonth(),
                                      range.from.getDate()
                                    ),
                              })
                            } else {
                              setRangeCompare(undefined)
                            }
                          }}
                          id="compare-mode"
                        />
                        <Label htmlFor="compare-mode">Compare</Label>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <DateInput
                          value={range.from}
                          onChange={(date) => {
                            const toDate =
                              range.to == null || date > range.to
                                ? date
                                : range.to
                            setRangeWithLimit({ from: date, to: toDate })
                          }}
                        />
                        <div className="py-1">-</div>
                        <DateInput
                          value={range.to}
                          onChange={(date) => {
                            const fromDate =
                              date < range.from ? date : range.from
                            setRangeWithLimit({ from: fromDate, to: date })
                          }}
                        />
                      </div>
                      {rangeCompare != null && (
                        <div className="flex gap-2">
                          <DateInput
                            value={rangeCompare?.from}
                            onChange={(date) => {
                              if (rangeCompare) {
                                const compareToDate =
                                  rangeCompare.to == null ||
                                  date > rangeCompare.to
                                    ? date
                                    : rangeCompare.to
                                setRangeCompare((prevRangeCompare) =>
                                  prevRangeCompare
                                    ? {
                                        ...prevRangeCompare,
                                        from: date,
                                        to: compareToDate,
                                      }
                                    : { from: date, to: date }
                                )
                              } else {
                                setRangeCompare({
                                  from: date,
                                  to: new Date(),
                                })
                              }
                            }}
                          />
                          <div className="py-1">-</div>
                          <DateInput
                            value={rangeCompare?.to}
                            onChange={(date) => {
                              if (rangeCompare && rangeCompare.from) {
                                const compareFromDate =
                                  date < rangeCompare.from
                                    ? date
                                    : rangeCompare.from
                                setRangeCompare({
                                  ...rangeCompare,
                                  from: compareFromDate,
                                  to: date,
                                })
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {isSmallScreen && (
                    <Select
                      defaultValue={selectedPreset}
                      onValueChange={(value) => {
                        setPreset(value)
                      }}
                    >
                      <SelectTrigger className="w-[180px] mx-auto mb-2">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PRESETS.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <div>
                    <Calendar
                      mode="range"
                      onSelect={(
                        value: { from?: Date; to?: Date } | undefined
                      ) => {
                        if (value?.from != null) {
                          setRangeWithLimit({ from: value.from, to: value?.to })
                        }
                      }}
                      selected={range}
                      numberOfMonths={isSmallScreen ? 1 : 2}
                      defaultMonth={
                        new Date(
                          new Date().setMonth(
                            new Date().getMonth() - (isSmallScreen ? 0 : 1)
                          )
                        )
                      }
                    />
                  </div>
                  {warningMessage && (
                    <div className="text-red-500 text-sm mt-2">
                      {warningMessage}
                    </div>
                  )}
                </div>
              </div>
              {!isSmallScreen && (
                <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-6">
                  <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6">
                    {PRESETS.map((preset) => (
                      <PresetButton
                        key={preset.name}
                        preset={preset.name}
                        label={preset.label}
                        isSelected={selectedPreset === preset.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 md:flex-row">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (
                !areRangesEqual(range, openedRangeRef.current) ||
                !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
              ) {
                onUpdate?.({ range, rangeCompare })
              }
              onSelect(range)
            }}
            disabled={warningMessage !== null}
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

DateRangePicker.displayName = "DateRangePicker"
DateRangePicker.filePath =
  "libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx"
