import { BankDataTable } from "../StatusBankDataTable/data-table";
import { StatusBankColumns } from "../StatusBankDataTable/columns";
import { useHooks } from "@/hooks";

export function RecentBankTransactions() {
  const { statusBankTableData } = useHooks();

  return (
    <section className="flex w-full h-full flex-col gap-6 overflow-auto">
      <BankDataTable columns={StatusBankColumns} data={statusBankTableData} />
    </section>
  );
}
