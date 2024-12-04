import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useHooks } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Footer } from "@/features/Footer";
import {
  LuBanknote,
  LuDownload,
  LuHistory,
  LuAxe,
  LuSettings2,
} from "react-icons/lu";

interface LeftSideBarProps {
  width: string;
}

export function LeftSideBar({ width }: LeftSideBarProps) {
  const {
    clientI,
    calenderDate,
    currentPage,
    userFirstName,
    userLastName,
    userDepartment,
    setEntireBankTableDate,
    setMyTableData,
    setCurrentPage,
    setDepartmentCreditCardInfo,
    setMyMissingBankData,
    setMyMissingUploadedData,
    setEntireUserUploadedTransactions,
    setCurrentQuarterLimit,
    setCurrentQuarterUsage,
  } = useHooks();
  const navigate = useNavigate();
  const style = `sticky left-0 top-0 flex h-screen ${width} flex-col justify-between border-r border-gray-200 pt-8 max-md:hidden`;

  async function handleHomeNavigate() {
    await clientI.get("/api/department-credit-balance/").then((res) => {
      const months: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth();
      const currentMonthName = months[currentMonthIndex];

      if (
        currentMonthName === "January" ||
        currentMonthName === "February" ||
        currentMonthName === "March"
      ) {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setCurrentQuarterLimit(item.q1_limit);
            setCurrentQuarterUsage(item.q1_usage);
          }
        });
      } else if (
        currentMonthName === "April" ||
        currentMonthName === "May" ||
        currentMonthName === "June"
      ) {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setCurrentQuarterLimit(item.q2_limit);
            setCurrentQuarterUsage(item.q2_usage);
          }
        });
      } else if (
        currentMonthName === "July" ||
        currentMonthName === "August" ||
        currentMonthName === "September"
      ) {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setCurrentQuarterLimit(item.q3_limit);
            setCurrentQuarterUsage(item.q3_usage);
          }
        });
      } else if (
        currentMonthName === "October" ||
        currentMonthName === "November" ||
        currentMonthName === "December"
      ) {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setCurrentQuarterLimit(item.q4_limit);
            setCurrentQuarterUsage(item.q4_usage);
          }
        });
      }
    });
    setCurrentPage("/home");
    navigate("/home");
  }

  async function handleHistoryNavigate() {
    await clientI
      .post("/api/card-transaction-history/", {
        date_from: calenderDate.from.toISOString().split("T")[0],
        date_to: calenderDate.to.toISOString().split("T")[0],
        first_name: userFirstName,
        last_name: userLastName,
      })
      .then((res) => {
        setMyTableData(res.data);
      })
      .catch(() => {
        toast("Unable to update the table");
      });
    setCurrentPage("/transaction-history");
    navigate("/transaction-history");
  }

  async function handleUploadNavigate() {
    await clientI.get("/api/department-credit-balance/").then((res) => {
      const months: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth();
      const currentMonthName = months[currentMonthIndex];

      if (
        currentMonthName === "January" ||
        currentMonthName === "February" ||
        currentMonthName === "March"
      ) {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setCurrentQuarterLimit(item.q1_limit);
            setCurrentQuarterUsage(item.q1_usage);
          }
        });
      } else if (
        currentMonthName === "April" ||
        currentMonthName === "May" ||
        currentMonthName === "June"
      ) {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setCurrentQuarterLimit(item.q2_limit);
            setCurrentQuarterUsage(item.q2_usage);
          }
        });
      } else if (
        currentMonthName === "July" ||
        currentMonthName === "August" ||
        currentMonthName === "September"
      ) {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setCurrentQuarterLimit(item.q3_limit);
            setCurrentQuarterUsage(item.q3_usage);
          }
        });
      } else if (
        currentMonthName === "October" ||
        currentMonthName === "November" ||
        currentMonthName === "December"
      ) {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setCurrentQuarterLimit(item.q4_limit);
            setCurrentQuarterUsage(item.q4_usage);
          }
        });
      }
    });
    setCurrentPage("/upload-transactions");
    navigate("/upload-transactions");
  }

  function handleUploadBankTransactionNavigate() {
    setCurrentPage("/upload-bank-transactions");
    navigate("/upload-bank-transactions");
  }

  function handleDownloadTransactionsNavigate() {
    setCurrentPage("/download-transactions");
    navigate("/download-transactions");
  }

  async function handleBankTransactionHistoryNavigate() {
    await clientI
      .get("/api/upload-bank-transaction-list/")
      .then((res) => {
        setEntireBankTableDate(res.data);
        setCurrentPage("/bank-transaction-history");
        navigate("/bank-transaction-history");
      })
      .catch(() => toast("Error: Cannot load the page"));
  }

  async function handleControlUploadedTransactionsNavigate() {
    await clientI
      .post("/api/entire-user-uploaded-history/", {
        date_from: calenderDate.from.toISOString().split("T")[0],
        date_to: calenderDate.to.toISOString().split("T")[0],
      })
      .then((res) => {
        setEntireUserUploadedTransactions(res.data);
        setCurrentPage("/control-uploaded-transactions");
        navigate("/control-uploaded-transactions");
      })
      .catch(() => toast("Error: Cannot load the page"));
  }

  function handleCreateAccountNavigate() {
    setCurrentPage("/create-account");
    navigate("/create-account");
  }

  async function handleSetDepartmentLimitNavigate() {
    await clientI
      .get("/api/department-credit-card-limit")
      .then((res) => {
        setDepartmentCreditCardInfo(res.data);
        setCurrentPage("/department-credit-limit");
        navigate("/department-credit-limit");
      })
      .catch(() => {
        toast("Unable to reach this page");
      });
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
    <section className={style}>
      <nav className="flex flex-col gap-4">
        <div className="grid text-center">
          <Label className="text-black text-2xl font-bold">Finance Management System</Label>
          <Label className="text-black text-xs mb-7">
            Manage the card transactions and receipts
          </Label>
        </div>
        <div className="w-full space-y-2 pr-2 pl-2">
          {currentPage === "/home" ? (
            <Button
              className="flex w-full h-12 text-left gap-2 overflow-auto"
              onClick={handleHomeNavigate}
            >
              <img src="/icons/home.svg" />
              <span className="w-full font-semibold text-black-2 max-xl:hidden">
                Home
              </span>
            </Button>
          ) : (
            <Button
              className="flex w-full h-12 text-left gap-2 overflow-auto"
              variant="ghost"
              onClick={handleHomeNavigate}
            >
              <img src="/icons/home.svg" />
              <span className="w-full font-semibold text-black-2 max-xl:hidden">
                Home
              </span>
            </Button>
          )}
          {currentPage === "/transaction-history" ? (
            <Button
              className="flex w-full h-12 text-left gap-2 overflow-auto"
              onClick={handleHistoryNavigate}
            >
              <img src="/icons/transaction.svg" />
              <span className="w-full font-semibold text-black-2 max-xl:hidden">
                Transaction History
              </span>
            </Button>
          ) : (
            <Button
              className="flex w-full h-12 text-left gap-2 overflow-auto"
              variant="ghost"
              onClick={handleHistoryNavigate}
            >
              <img src="/icons/transaction.svg" />
              <span className="w-full font-semibold text-black-2 max-xl:hidden">
                Transaction History
              </span>
            </Button>
          )}
          {currentPage === "/upload-transactions" ? (
            <Button
              className="flex w-full h-12 text-left gap-2 overflow-auto"
              onClick={handleUploadNavigate}
            >
              <img src="/icons/dollar-circle.svg" />
              <span className="w-full font-semibold text-black-2 max-xl:hidden">
                Upload Transactions
              </span>
            </Button>
          ) : (
            <Button
              className="flex w-full h-12 text-left gap-2 overflow-auto"
              variant="ghost"
              onClick={handleUploadNavigate}
            >
              <img src="/icons/dollar-circle.svg" />
              <span className="w-full font-semibold text-black-2 max-xl:hidden">
                Upload Transactions
              </span>
            </Button>
          )}
          {currentPage === "/missing-transactions" ? (
            <Button
              className="flex w-full h-12 text-left gap-2 overflow-auto"
              onClick={handleMissingTransactionsNavigate}
            >
              <img src="/icons/transaction.svg" />
              <span className="w-full font-semibold text-black-2 max-xl:hidden">
                Missing Transactions
              </span>
            </Button>
          ) : (
            <Button
              className="flex w-full h-12 text-left gap-2 overflow-auto"
              variant="ghost"
              onClick={handleMissingTransactionsNavigate}
            >
              <img src="/icons/transaction.svg" />
              <span className="w-full font-semibold text-black-2 max-xl:hidden">
                Missing Transactions
              </span>
            </Button>
          )}
        </div>
        {userDepartment === "Finance" || userDepartment === "Admin" ? (
          <div className="mt-5">
            <div className="ml-2 mr-2 border-t"></div>
            <div className="mt-6 pl-2 pr-2 space-y-2">
              {currentPage === "/upload-bank-transactions" ? (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  onClick={handleUploadBankTransactionNavigate}
                >
                  <LuBanknote size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Upload Bank Transactions
                  </span>
                </Button>
              ) : (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  variant="ghost"
                  onClick={handleUploadBankTransactionNavigate}
                >
                  <LuBanknote size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Upload Bank Transactions
                  </span>
                </Button>
              )}
              {currentPage === "/download-transactions" ? (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  onClick={handleDownloadTransactionsNavigate}
                >
                  <LuDownload size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Download Transactions
                  </span>
                </Button>
              ) : (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  variant="ghost"
                  onClick={handleDownloadTransactionsNavigate}
                >
                  <LuDownload size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Download Transactions
                  </span>
                </Button>
              )}
              {currentPage === "/bank-transaction-history" ? (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  onClick={handleBankTransactionHistoryNavigate}
                >
                  <LuHistory size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Bank Transaction History
                  </span>
                </Button>
              ) : (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  variant="ghost"
                  onClick={handleBankTransactionHistoryNavigate}
                >
                  <LuHistory size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Bank Transaction History
                  </span>
                </Button>
              )}
              {currentPage === "/control-uploaded-transactions" ? (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  onClick={handleControlUploadedTransactionsNavigate}
                >
                  <LuBanknote size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Control Uploaded Transactions
                  </span>
                </Button>
              ) : (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  variant="ghost"
                  onClick={handleControlUploadedTransactionsNavigate}
                >
                  <LuBanknote size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Control Uploaded Transactions
                  </span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {userDepartment === "Finance" || userDepartment === "Admin" ? (
          <div className="mt-5">
            <div className="ml-2 mr-2 border-t"></div>
            <div className="mt-6 pl-2 pr-2 space-y-2">
              {currentPage === "/create-account" ? (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  onClick={handleCreateAccountNavigate}
                >
                  <LuAxe size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Create Account
                  </span>
                </Button>
              ) : (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  variant="ghost"
                  onClick={handleCreateAccountNavigate}
                >
                  <LuAxe size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Create Account
                  </span>
                </Button>
              )}
              {currentPage === "/department-credit-limit" ? (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  onClick={handleSetDepartmentLimitNavigate}
                >
                  <LuSettings2 size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Set Department Credit Limit
                  </span>
                </Button>
              ) : (
                <Button
                  className="flex w-full h-12 text-left gap-2 overflow-auto"
                  variant="ghost"
                  onClick={handleSetDepartmentLimitNavigate}
                >
                  <LuSettings2 size={25} />
                  <span className="w-full font-semibold text-black-2 max-xl:hidden">
                    Set Department Credit Limit
                  </span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </nav>

      <Footer />
    </section>
  );
}
