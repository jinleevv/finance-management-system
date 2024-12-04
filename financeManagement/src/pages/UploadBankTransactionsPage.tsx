import { UploadBankTransactionsFrom } from "@/features/Finance Department/UploadBankTransactionsForm";
import { LeftSideBar } from "@/features/LeftSideBar";
import { MobileNav } from "@/features/MobileNav";
import { RightSideBar } from "@/features/RightSideBar";
import { useHooks } from "@/hooks";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function UploadBankTransactionsPage() {
  const { setCurrentPage } = useHooks();
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, []);

  return (
    <>
      <MobileNav />
      <div className="flex">
        <LeftSideBar width="w-4/12"/>
        <UploadBankTransactionsFrom />
        <RightSideBar />
      </div>
    </>
  );
}
