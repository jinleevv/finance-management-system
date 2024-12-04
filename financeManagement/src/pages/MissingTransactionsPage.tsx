import { LeftSideBar } from "@/features/LeftSideBar";
import { MissingTransactions } from "@/features/MissingTransactions";
import { MobileNav } from "@/features/MobileNav";
import { useHooks } from "@/hooks";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function MissingTransactionsPage() {
  const { setCurrentPage } = useHooks();
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, []);
  return (
    <>
      <MobileNav />
      <div className="flex">
        <LeftSideBar width="w-3/12" />
        <MissingTransactions />
      </div>
    </>
  );
}
