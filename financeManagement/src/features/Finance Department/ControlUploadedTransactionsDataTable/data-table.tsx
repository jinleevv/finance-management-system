import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { useHooks } from "@/hooks";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { EditTransactionInformation } from "@/features/EditTransactionInformation";
import saveAs from "file-saver";

interface ControlUploadedTransactionsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ControlUploadedTransactionsDataTable<TData, TValue>({
  columns,
  data,
}: ControlUploadedTransactionsDataTableProps<TData, TValue>) {
  const {
    clientI,
    calenderDate,
    userFirstName,
    userLastName,
    setCalenderDate,
    setEntireUserUploadedTransactions,
  } = useHooks();
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    setDate({
      from: calenderDate.from,
      to: calenderDate.to,
    });
  }, [calenderDate]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  function handleEditError() {
    toast("Please only select one item");
  }

  function preHandleDelete() {
    const data = table.getFilteredSelectedRowModel().rows;

    if (data.length === 0) {
      toast("Unable to delete the data, please only select at least one item");
    }
  }

  async function handleDelete() {
    const data = {
      rowsData: table.getFilteredSelectedRowModel().rows,
    };
    
    await clientI
      .post("/api/delete-card-data/", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        clientI
          .post(
            "/api/entire-user-uploaded-history/",
            {
              date_from: calenderDate.from.toISOString().split("T")[0],
              date_to: calenderDate.to.toISOString().split("T")[0],
              first_name: userFirstName,
              last_name: userLastName,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((res) => {
            setEntireUserUploadedTransactions(res.data);
          })
          .catch(() => {
            toast("Unable to reload the card transaction history");
          });
      })
      .catch(() => toast("Unable to delete the data"));
  }

  async function handleEntireFilterByDates() {
    const data = JSON.stringify({
      date_from: date.from.toISOString().split("T")[0],
      date_to: date.to.toISOString().split("T")[0],
    });

    await clientI
      .post("/api/entire-filter-by-dates/", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setEntireUserUploadedTransactions(res.data);
      })
      .catch(() => {
        toast("Unable to filter by given dates");
      });

    setCalenderDate({
      from: date.from,
      to: date.to,
    });
  }

  async function handleDownloadImage() {
    const data = table.getFilteredSelectedRowModel().rows;

    if (data.length < 1) {
      toast("Please select at least one data to download image(s)");
    } else {
      const todayDate = new Date();
      const todayDateString = todayDate.toISOString().split("T")[0];
      const filenames = data.map((element: any) => element.original["img"]);

      try {
        const response = await clientI
          .post(
            "/api/receipt-download/",
            {
              filenames: filenames,
            },
            { responseType: "blob" }
          )
          .catch(() => {
            toast("Error downloading images:");
          });

        const blob = new Blob([response.data], { type: "application/zip" });
        saveAs(blob, `images_${todayDateString}.zip`);
      } catch (error) {
        toast("Error downloading images");
      }
    }
  }

  return (
    <>
      <div className="flex w-full gap-1 mt-8 mb-4 lg:justify-between justify-center">
        <div className="w-1/3 ml-2">
          <Input
            placeholder="Filter by first name..."
            value={
              (table.getColumn("first_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("first_name")?.setFilterValue(event.target.value)
            }
            className="w-full"
          />
        </div>
        <div className="flex space-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[250px] justify-start text-left font-normal",
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

          <Button className="h-full" onClick={handleEntireFilterByDates}>
            Search
          </Button>
        </div>
      </div>
      <div className="flex w-full justify-end space-x-1 mb-2">
        <Button variant="outline" onClick={handleDownloadImage}>
          Download Images
        </Button>
        {table.getFilteredSelectedRowModel().rows.length === 1 ? (
          <EditTransactionInformation
            data={table.getFilteredSelectedRowModel().rows}
          />
        ) : (
          <Button onClick={handleEditError} variant="outline">
            Edit
          </Button>
        )}
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Delete</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl">
              <DialogHeader>
                <DialogTitle>Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete? You cannot undo the action.
                </DialogDescription>
              </DialogHeader>{" "}
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Alert</AlertTitle>
                <AlertDescription>
                  Are you sure you want to delete? You cannot undo the action.
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button onClick={handleDelete}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button variant="outline" onClick={preHandleDelete}>
            Delete
          </Button>
        )}
      </div>
      <div className="rounded-lg overflow-auto">
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
    </>
  );
}
