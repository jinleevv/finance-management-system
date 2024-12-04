import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useHooks } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/features/Footer";

export function MobileNav() {
  const {
    currentPage,
    clientI,
    calenderDate,
    userFirstName,
    userLastName,
    setMyMissingUploadedData,
    setMyMissingBankData,
    setCurrentPage,
  } = useHooks();
  const navigate = useNavigate();

  function handleHomeNavigate() {
    setCurrentPage("Home");
    navigate("/home");
  }

  function handleHistoryNavigate() {
    setCurrentPage("Transaction History");
    navigate("/transaction-history");
  }

  function handleUploadNavigate() {
    setCurrentPage("Upload Transactions");
    navigate("/upload-transactions");
  }

  async function handleMissingTransactionsNavigate() {
    await clientI
      .post("/api/missing-transaction-lists/", {
        date_from: calenderDate.from.toISOString().split("T")[0],
        date_to: calenderDate.to.toISOString().split("T")[0],
        first_name: userFirstName,
        last_name: userLastName,
      })
      .then((res) => {
        setMyMissingUploadedData(res.data);
      });
    await clientI
      .post("/api/status-bank-transactions/", {
        date_from: calenderDate.from.toISOString().split("T")[0],
        date_to: calenderDate.to.toISOString().split("T")[0],
        first_name: userFirstName,
        last_name: userLastName,
      })
      .then((res) => {
        let response_data = new Array();
        res.data.data.map((item) => {
          if (item.status === "Unmatched") {
            response_data.push(item);
          }
        });
        setMyMissingBankData(response_data);
      });
    setCurrentPage("/missing-transactions");
    navigate("/missing-transactions");
  }
  return (
    <section className="sticky flex w-full p-3 justify-between border-b border-gray-200 shadow-sm md:hidden">
      <Label className="text-2xl font-bold">Finance Management System</Label>
      <Sheet>
        <SheetTrigger>
          <img
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <div className="mb-10">
            <Label className="text-2xl font-bold">
              Finance Management System
            </Label>
          </div>
          <SheetClose asChild>
            <nav>
              <div className="space-y-2">
                {currentPage === "/home" ? (
                  <SheetClose asChild>
                    <Button
                      className="flex w-full h-16 text-left gap-2 overflow-auto"
                      onClick={handleHomeNavigate}
                    >
                      <img src="/icons/home.svg" />
                      <span className="w-full font-semibold text-black-2">
                        Home
                      </span>
                    </Button>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Button
                      className="flex w-full h-16 text-left gap-2 overflow-auto"
                      variant="ghost"
                      onClick={handleHomeNavigate}
                    >
                      <img src="/icons/home.svg" />
                      <span className="w-full font-semibold text-black-2">
                        Home
                      </span>
                    </Button>
                  </SheetClose>
                )}
                {currentPage === "/transaction-history" ? (
                  <SheetClose asChild>
                    <Button
                      className="flex w-full h-16 text-left gap-2 overflow-auto"
                      onClick={handleHistoryNavigate}
                    >
                      <img src="/icons/transaction.svg" />
                      <span className="w-full font-semibold text-black-2">
                        Transaction History
                      </span>
                    </Button>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Button
                      className="flex w-full h-16 text-left gap-2 overflow-auto"
                      variant="ghost"
                      onClick={handleHistoryNavigate}
                    >
                      <img src="/icons/transaction.svg" />
                      <span className="w-full font-semibold text-black-2">
                        Transaction History
                      </span>
                    </Button>
                  </SheetClose>
                )}
                {currentPage === "/upload-transactions" ? (
                  <SheetClose asChild>
                    <Button
                      className="flex w-full h-16 text-left gap-2 overflow-auto"
                      onClick={handleUploadNavigate}
                    >
                      <img src="/icons/dollar-circle.svg" />
                      <span className="w-full font-semibold text-black-2">
                        Upload Transactions
                      </span>
                    </Button>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Button
                      className="flex w-full h-16 text-left gap-2 overflow-auto"
                      variant="ghost"
                      onClick={handleUploadNavigate}
                    >
                      <img src="/icons/dollar-circle.svg" />
                      <span className="w-full font-semibold text-black-2">
                        Upload Transactions
                      </span>
                    </Button>
                  </SheetClose>
                )}
                {currentPage === "/missing-transactions" ? (
                  <SheetClose asChild>
                    <Button
                      className="flex w-full h-16 text-left gap-2 overflow-auto"
                      onClick={handleMissingTransactionsNavigate}
                    >
                      <img src="/icons/transaction.svg" />
                      <span className="w-full font-semibold text-black-2">
                        Missing Transactions
                      </span>
                    </Button>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Button
                      className="flex w-full h-16 text-left gap-2 overflow-auto"
                      variant="ghost"
                      onClick={handleMissingTransactionsNavigate}
                    >
                      <img src="/icons/transaction.svg" />
                      <span className="w-full font-semibold text-black-2">
                        Missing Transactions
                      </span>
                    </Button>
                  </SheetClose>
                )}
              </div>
              <div className="mt-48 -ml-4">
                <Footer />
              </div>
            </nav>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </section>
  );
}
