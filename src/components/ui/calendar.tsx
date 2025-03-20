import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, CaptionProps } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  recommendedDate?: Date;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  recommendedDate,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(props.month || new Date());

  const handleMonthChange = (newDate: Date) => {
    setCurrentMonth(newDate);
    props.onMonthChange?.(newDate);
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={currentMonth}
      onMonthChange={handleMonthChange}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }: CaptionProps) => {
          const currentDate = displayMonth || new Date();
          const [selectedMonth, setSelectedMonth] = React.useState(currentDate.getMonth());
          const [selectedYear, setSelectedYear] = React.useState(currentDate.getFullYear());

          React.useEffect(() => {
            setSelectedMonth(currentDate.getMonth());
            setSelectedYear(currentDate.getFullYear());
          }, [currentDate]);

          const handleMonthSelect = (value: string) => {
            const newDate = new Date(currentDate);
            newDate.setMonth(parseInt(value));
            setSelectedMonth(parseInt(value));
            handleMonthChange(newDate);
          };

          const handleYearSelect = (value: string) => {
            const newDate = new Date(currentDate);
            newDate.setFullYear(parseInt(value));
            setSelectedYear(parseInt(value));
            handleMonthChange(newDate);
          };

          return (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={handleMonthSelect}
                >
                  <SelectTrigger className="w-[140px] bg-background dark:bg-background border-input">
                    <SelectValue>
                      {format(new Date(2000, selectedMonth), "MMMM", { locale: es })}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background dark:bg-background">
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {format(new Date(2000, i), "MMMM", { locale: es })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={handleYearSelect}
                >
                  <SelectTrigger className="w-[100px] bg-background dark:bg-background border-input">
                    <SelectValue>
                      {selectedYear}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background dark:bg-background">
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        },
        DayContent: ({ date, ...props }) => {
          const isRecommended = recommendedDate && 
            date.getDate() === recommendedDate.getDate() &&
            date.getMonth() === recommendedDate.getMonth() &&
            date.getFullYear() === recommendedDate.getFullYear();

          return (
            <div className={cn(
              "relative w-full h-full flex items-center justify-center",
              isRecommended && "before:absolute before:inset-0 before:bg-blue-100 before:rounded-md before:opacity-50"
            )}>
              <span className={cn(
                "text-sm relative z-10",
                isRecommended && "text-green-600 font-medium"
              )}>
                {date.getDate()}
              </span>
              {isRecommended && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full z-10" />
              )}
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
