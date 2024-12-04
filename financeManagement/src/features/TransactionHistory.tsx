import { Label } from "@/components/ui/label";
import { MyDataTable } from "./MyDataTable/data-table";
import { columns } from "./MyDataTable/columns";
import { useHooks } from "@/hooks";
import { StatusBankColumns } from "./StatusBankDataTable/columns";

export function TransactionHistory() {
  const { myTableData, statusBankTableData } = useHooks();

  return (
    <>
      <div className="w-full h-screen">
        <div className="h-[800px] lg:ml-10 mt-12 lg:mr-10 ml-3 mr-3">
          <Label className="text-2xl font-bold">
            Uploaded Transactions History
          </Label>
          <MyDataTable
            columns1={columns}
            data1={myTableData}
            columns2={StatusBankColumns}
            data2={statusBankTableData}
          />
        </div>
      </div>
    </>
  );
}
