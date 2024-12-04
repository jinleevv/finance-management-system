import { Label } from "@/components/ui/label";
import { ControlUploadedTransactionsDataTable } from "./Finance Department/ControlUploadedTransactionsDataTable/data-table";
import { useHooks } from "@/hooks";
import { columns } from "./Finance Department/ControlUploadedTransactionsDataTable/columns";

export function ControlUploadedTransactions() {
  const { entireUserUploadedTransactions } = useHooks();
  return (
    <section className="w-full h-full">
      <div className="mt-12 ml-10 mr-10">
        <Label className="grid text-2xl font-bold">
          Control Uploaded Transactions
        </Label>
        <Label className="ml-1">Edit/Delete Uploaded Transactions</Label>
      </div>
      <div className="h-[800px] mt-7 ml-10 mr-10 overflow-auto">
        <ControlUploadedTransactionsDataTable
          columns={columns}
          data={entireUserUploadedTransactions}
        />
      </div>
    </section>
  );
}
