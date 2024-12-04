import { LeftSideBar } from "@/features/LeftSideBar";
import { MobileNav } from "@/features/MobileNav";
import { RightSideBar } from "@/features/RightSideBar";
import { TransactionHistory } from "@/features/TransactionHistory";
import { useHooks } from "@/hooks";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function TransactionHistoryPage() {
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
        <TransactionHistory />
        <RightSideBar />
      </div>
    </>
  );
}
