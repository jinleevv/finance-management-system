import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useHooks } from "@/hooks";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function DownloadTransaction() {
  const { clientI } = useHooks();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const [totalChecked, setTotalChecked] = useState<boolean>(true);
  const [employeeChecked, setEmployeeChecked] = useState<boolean>(false);

  function handleTotalCheckedClicked() {
    setTotalChecked(true);
    setEmployeeChecked(false);
  }

  function handleEmployeeCheckedClicked() {
    setTotalChecked(false);
    setEmployeeChecked(true);
  }

  async function handleTotalClick() {
    try {
      const data = JSON.stringify({
        date_from: date.from.toISOString().split("T")[0],
        date_to: date.to.toISOString().split("T")[0],
      });

      await clientI
        .post("/api/download-transaction/", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          if (res.data.data.length !== 0) {
            const jsonData = res.data.data;

            const cleanedData = jsonData.map(
              ({ id, ...rest }: { id: any }) => rest
            );

            const worksheet = XLSX.utils.json_to_sheet(cleanedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // Buffer to store the generated Excel file
            const excelBuffer = XLSX.write(workbook, {
              bookType: "xlsx",
              type: "array",
            });
            const blob = new Blob([excelBuffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            });

            const nameDate = new Date();
            const fileDownloadName =
              "Transactions_List_" +
              nameDate.toISOString().split("T")[0] +
              ".xlsx";
            saveAs(blob, fileDownloadName);
          } else {
            toast("There is no data that intersect with each other");
          }
        });
    } catch (err) {
      toast("Something went wront, please contact IT department");
    }
  }

  async function handleEmployeeClick() {
    try {
      const data = JSON.stringify({
        date_from: date.from.toISOString().split("T")[0],
        date_to: date.to.toISOString().split("T")[0],
      });

      await clientI
        .post("/api/download-transaction/", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          if (res.data.data.length !== 0) {
            const jsonData = res.data.data;

            // Group data by 'Full Name'
            const groupedData = jsonData.reduce(
              (acc: { [key: string]: any[] }, item: any) => {
                const { "Full Name": fullName, ...rest } = item; // Extract 'Full Name' and remove it from rest
                if (!acc[fullName]) {
                  acc[fullName] = [];
                }
                acc[fullName].push({ fullName, ...rest });
                return acc;
              },
              {}
            );

            // Iterate over each group and create a separate Excel file
            Object.keys(groupedData).forEach((fullName) => {
              const cleanedData = groupedData[fullName];
              const worksheet = XLSX.utils.json_to_sheet(cleanedData);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

              // Buffer to store the generated Excel file
              const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
              });
              const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
              });

              const nameDate = new Date();
              const fileDownloadName = `${fullName}_Transactions_List_${
                nameDate.toISOString().split("T")[0]
              }.xlsx`;
              saveAs(blob, fileDownloadName);
            });
          }
        });
    } catch (err) {
      toast("Something went wront, please contact IT department");
    }
  }

  return (
    <section className="w-full">
      <div className="mt-12 ml-10 mr-10">
        <Label className="grid text-2xl font-bold">Download Transactions</Label>
        <Label className="ml-1">Download Total Transaction Information</Label>
      </div>
      <div className="flex mt-12 pl-10 pr-10 gap-3">
        <div className="flex gap-1.5">
          <Checkbox
            checked={totalChecked}
            onClick={handleTotalCheckedClicked}
          />{" "}
          <Label className="mt-0.5">Total File</Label>
        </div>
        <div className="flex gap-1.5">
          <Checkbox
            checked={employeeChecked}
            onClick={handleEmployeeCheckedClicked}
          />{" "}
          <Label className="mt-0.5">By Each Employee</Label>
        </div>
      </div>
      <div className="flex w-full mt-2 pl-10 pr-10 gap-3">
        <div className="w-1/2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full h-full justify-start text-left font-normal",
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
            <PopoverContent className="w-auto" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex w-1/2">
          {totalChecked ? (
            <Button onClick={handleTotalClick} className="">
              Download
            </Button>
          ) : (
            <Button onClick={handleEmployeeClick} className="">
              Download
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
