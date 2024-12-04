import { ColumnDef } from "@tanstack/react-table";
import { StatusBankTransactionsData } from "@/hooks";

export const StatusBankColumns: ColumnDef<StatusBankTransactionsData>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "trans_date",
    header: "Trans Date",
  },
  {
    accessorKey: "post_date",
    header: "Post Date",
  },
  {
    accessorKey: "billing_amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("billing_amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "merchant_name",
    header: "Merchant Name",
  },
];
