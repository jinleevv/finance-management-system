import { Label } from "@/components/ui/label";
import { MyMissingUploadedData } from "@/features/MyMissingUploadedData/data-table";
import { columns as UploadedColumns } from "./MyMissingUploadedData/columns";
import { StatusBankColumns } from "./MyMissingBankData/columns";
import { useHooks } from "@/hooks";
import { MyMissingBankData } from "./MyMissingBankData/data-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, startOfMonth } from "date-fns";

import { CalendarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function MissingTransactions() {
  const {
    clientI,
    myMissingUploadedData,
    myMissingBankData,
    userFirstName,
    userLastName,
    calenderDate,
    setCalenderDate,
    setMyMissingUploadedData,
    setMyMissingBankData,
  } = useHooks();
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  useEffect(() => {
    setDate({
      from: calenderDate.from,
      to: calenderDate.to,
    });
  }, [calenderDate]);

  async function handleFilterByDates() {
    await clientI
      .post("/api/missing-transaction-lists/", {
        date_from: date.from.toISOString().split("T")[0],
        date_to: date.to.toISOString().split("T")[0],
        first_name: userFirstName,
        last_name: userLastName,
      })
      .then((res) => {
        setMyMissingUploadedData(res.data);
      })
      .catch(() => {
        toast("Unable to filter by given dates");
      });

    await clientI
      .post("/api/status-bank-transactions/", {
        date_from: date.from.toISOString().split("T")[0],
        date_to: date.to.toISOString().split("T")[0],
        first_name: userFirstName,
        last_name: userLastName,
      })
      .then((res) => {
        let response_data = new Array();
        res.data.data.map((item) => {
          if (item.status === "Unmatched") {
            response_data.push(item);
          }
        });
        setMyMissingBankData(response_data);
      })
      .catch(() => {
        toast("Unable to filter by given dates");
      });

    setCalenderDate({
      from: date.from,
      to: date.to,
    });
  }

  return (
    <section className="w-full">
      <div className="mt-12 ml-10 mr-10">
        <Label className="grid text-2xl font-bold">Missing Transactions</Label>
        <Label className="ml-1">Compare For Missing Transactions</Label>
      </div>
      <div className="flex gap-1 mt-4 mb-4 ml-3 mr-3 justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

        <Button onClick={handleFilterByDates}>Search</Button>
      </div>
      <div className="lg:flex w-full mt-2 lg:gap-3 lg:space-y-0 space-y-5 lg:h-4/5 h-80">
        <div className="lg:w-1/2 h-full lg:ml-3 rounded-lg border p-3 overflow-auto">
          <Label className="flex text-lg font-bold justify-center">
            Remaining Items (Your List)
          </Label>
          <MyMissingUploadedData
            columns={UploadedColumns}
            data={myMissingUploadedData}
          />
        </div>
        <div className="lg:w-1/2 h-full lg:mr-3 rounded-lg border p-3 overflow-auto">
          <div className="mb-5">
            <Label className="flex text-lg font-bold justify-center">
              Remaining Items (Bank List)
            </Label>
            <Label className="flex text-sm font-bold justify-center text-red-600">
              This section must be empty
            </Label>
          </div>
          <MyMissingBankData
            columns={StatusBankColumns}
            data={myMissingBankData}
          />
        </div>
      </div>
    </section>
  );
}
