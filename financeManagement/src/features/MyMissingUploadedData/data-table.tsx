import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditTransactionInformation } from "../EditTransactionInformation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useHooks } from "@/hooks";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function MyMissingUploadedData<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  const {
    clientI,
    calenderDate,
    userFirstName,
    userLastName,
    userDepartment,
    setMyMissingUploadedData,
  } = useHooks();

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
      userDepartment: userDepartment,
    };

    await clientI
      .post("/api/delete-card-data/", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        clientI
          .post("/api/missing-transaction-lists/", {
            date_from: calenderDate.from.toISOString().split("T")[0],
            date_to: calenderDate.to.toISOString().split("T")[0],
            first_name: userFirstName,
            last_name: userLastName,
          })
          .then((res) => {
            setMyMissingUploadedData(res.data);
          });
      })
      .catch(() => toast("Unable to delete the data"));
  }

  return (
    <div className="rounded-md">
      <div className="flex w-full justify-end gap-2 mt-3 mb-3">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
