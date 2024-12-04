import { useHooks } from "@/hooks";
import { EntireBankDataTable } from "./EntireBankDataTable/data-table";
import { EntireBankColumns } from "./EntireBankDataTable/columns";
import { Label } from "@/components/ui/label";

export function BankTransactionHistory() {
  const { entireBankTableData } = useHooks();

  return (
    <section className="w-full m-auto mt-0">
      <div className="h-full mt-12 ml-10 mr-10">
        <Label className="grid text-2xl font-bold">
          Corporate Card Bank Transaction History
        </Label>
        <Label className="ml-1">Corporate Card Bank Transaction History</Label>
      </div>
      <div className="h-full mt-12 ml-10 mr-10">
        <EntireBankDataTable
          columns={EntireBankColumns}
          data={entireBankTableData}
        />
      </div>
    </section>
  );
}
