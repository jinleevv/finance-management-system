import { Label } from "@/components/ui/label";
import { CardBalanceInformation } from "@/features/DashBoardComponents/CardBalanceInformation";
import { RecentBankTransactions } from "./DashBoardComponents/RecentBankTransactions";
import { Button } from "@/components/ui/button";
import { useHooks } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function DashBoard() {
  const {
    clientI,
    userFullName,
    userDepartment,
    currentQuarterLimit,
    currentQuarterUsage,
    setCurrentPage,
  } = useHooks();
  const navigate = useNavigate();
  const [currentQuarter, setCurrentQuarter] = useState<string>("");
  const [firstMonth, setFirstMonth] = useState<string>("");
  const [secondMonth, setSecondMonth] = useState<string>("");
  const [thirdMonth, setThirdMonth] = useState<string>("");
  const [firstMonthInfo, setFirstMonthInfo] = useState<{}>();
  const [secondMonthInfo, setSecondMonthInfo] = useState<{}>();
  const [thirdMonthInfo, setThirdMonthInfo] = useState<{}>();
  const [quarterInfo, setQuarterInfo] = useState<{}>();

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

  useEffect(() => {
    if (
      currentMonthName === "January" ||
      currentMonthName === "February" ||
      currentMonthName === "March"
    ) {
      clientI.get("/api/department-credit-card-limit/").then((res) => {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setFirstMonthInfo({
              limit: item.january_limit,
              usage: item.january_usage,
            });
            setSecondMonthInfo({
              limit: item.february_limit,
              usage: item.february_usage,
            });
            setThirdMonthInfo({
              limit: item.march_limit,
              usage: item.march_usage,
            });
            setQuarterInfo({
              limit: item.q1_limit,
              usage: item.q1_usage,
            });
          }
        });
      });
      setCurrentQuarter("1Q");
      setFirstMonth("January");
      setSecondMonth("February");
      setThirdMonth("March");
    } else if (
      currentMonthName === "April" ||
      currentMonthName === "May" ||
      currentMonthName === "June"
    ) {
      clientI.get("/api/department-credit-card-limit/").then((res) => {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setFirstMonthInfo({
              limit: item.april_limit,
              usage: item.april_usage,
            });
            setSecondMonthInfo({
              limit: item.may_limit,
              usage: item.may_usage,
            });
            setThirdMonthInfo({
              limit: item.june_limit,
              usage: item.june_usage,
            });
            setQuarterInfo({
              limit: item.q2_limit,
              usage: item.q2_usage,
            });
          }
        });
      });
      setCurrentQuarter("2Q");
      setFirstMonth("April");
      setSecondMonth("May");
      setThirdMonth("June");
    } else if (
      currentMonthName === "July" ||
      currentMonthName === "August" ||
      currentMonthName === "September"
    ) {
      clientI.get("/api/department-credit-card-limit/").then((res) => {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setFirstMonthInfo({
              limit: item.july_limit,
              usage: item.july_usage,
            });
            setSecondMonthInfo({
              limit: item.august_limit,
              usage: item.august_usage,
            });
            setThirdMonthInfo({
              limit: item.september_limit,
              usage: item.september_usage,
            });
            setQuarterInfo({
              limit: item.q3_limit,
              usage: item.q3_usage,
            });
          }
        });
      });
      setCurrentQuarter("3Q");
      setFirstMonth("July");
      setSecondMonth("August");
      setThirdMonth("September");
    } else if (
      currentMonthName === "October" ||
      currentMonthName === "November" ||
      currentMonthName === "December"
    ) {
      clientI.get("/api/department-credit-card-limit/").then((res) => {
        res.data.map((item) => {
          if (item.department === userDepartment) {
            setFirstMonthInfo({
              limit: item.october_limit,
              usage: item.october_usage,
            });
            setSecondMonthInfo({
              limit: item.november_limit,
              usage: item.november_usage,
            });
            setThirdMonthInfo({
              limit: item.december_limit,
              usage: item.december_usage,
            });
            setQuarterInfo({
              limit: item.q4_limit,
              usage: item.q4_usage,
            });
          }
        });
      });
      setCurrentQuarter("4Q");
      setFirstMonth("October");
      setSecondMonth("November");
      setThirdMonth("December");
    }
  }, []);

  function handleViewAll() {
    setCurrentPage("/transaction-history");
    navigate("/transaction-history");
  }

  return (
    <div className="w-full h-screen">
      <div className="w-full mt-12 lg:pl-10 lg:pr-10 pl-4 pr-4">
        <div className="grid">
          <Label className="text-3xl">
            Welcome, <span>{userFullName}</span>
          </Label>
          <Label className="mb-2">
            Access & manage your account and transactions efficiently.
          </Label>
        </div>
        <CardBalanceInformation
          departmentLimit={currentQuarterLimit}
          departmentUsage={currentQuarterUsage}
          currentQuarter={currentQuarter}
          firstMonth={firstMonth}
          secondMonth={secondMonth}
          thirdMonth={thirdMonth}
          firstMonthInfo={firstMonthInfo}
          secondMonthInfo={secondMonthInfo}
          thirdMonthInfo={thirdMonthInfo}
          quarterInfo={quarterInfo}
        />
      </div>
      <div className="lg:h-[305px] h-[340px] ml-10 mt-12 mr-10">
        <div className="flex justify-between">
          <Label className="text-2xl">Recent transactions</Label>
          <Button variant="outline" onClick={handleViewAll}>
            View All
          </Button>
        </div>
        <RecentBankTransactions />
      </div>
    </div>
  );
}
