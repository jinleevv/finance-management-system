import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import CountUp from "react-countup";
import { DoughnutChart } from "@/features/DashBoardComponents/DoughnutChart";
import { StatusBadge } from "./StatusBadge";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

interface CardBalanceInformationProps {
  departmentLimit: number;
  departmentUsage: number;
  currentQuarter: string;
  firstMonth: string;
  secondMonth: string;
  thirdMonth: string;
  firstMonthInfo: any;
  secondMonthInfo: any;
  thirdMonthInfo: any;
  quarterInfo: any;
}

export function CardBalanceInformation({
  departmentLimit,
  departmentUsage,
  currentQuarter,
  firstMonth,
  secondMonth,
  thirdMonth,
  firstMonthInfo,
  secondMonthInfo,
  thirdMonthInfo,
  quarterInfo,
}: CardBalanceInformationProps) {
  let firstMonthLimit = 0;
  let firstMonthUsage = 0;
  if (firstMonthInfo) {
    firstMonthLimit = firstMonthInfo.limit;
    firstMonthUsage = firstMonthInfo.usage;
  } else {
    firstMonthLimit = 999;
    firstMonthUsage = 999;
  }

  let secondMonthLimit = 0;
  let secondMonthUsage = 0;
  if (secondMonthInfo) {
    secondMonthLimit = secondMonthInfo.limit;
    secondMonthUsage = secondMonthInfo.usage;
  } else {
    secondMonthLimit = 999;
    secondMonthUsage = 999;
  }

  let thirdMonthLimit = 0;
  let thirdMonthUsage = 0;
  if (thirdMonthInfo) {
    thirdMonthLimit = thirdMonthInfo.limit;
    thirdMonthUsage = thirdMonthInfo.usage;
  } else {
    thirdMonthLimit = 999;
    thirdMonthUsage = 999;
  }

  let quarterLimit = 0;
  let quarterUsage = 0;
  if (quarterInfo) {
    quarterLimit = quarterInfo.limit;
    quarterUsage = quarterInfo.usage;
  } else {
    quarterLimit = 999;
    quarterUsage = 999;
  }

  function formatAmount(amount: number) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    return formatter.format(amount);
  }

  return (
    <Card className="lg:flex mt-2 w-full shadow-lg">
      <CardHeader>
        <div className="h-40 w-40 lg:mt-14 lg:ml-0 ml-16">
          <DoughnutChart
            currentBalance={departmentUsage}
            remainingBalance={departmentLimit}
          />
        </div>
      </CardHeader>
      <CardContent className="w-full mt-6">
        <div className="w-full">
          <CardTitle className="text-2xl">Current Balance</CardTitle>
          <CardDescription>
            Corporate Credit Card Department Limit:{" "}
            {formatAmount(departmentLimit)}
          </CardDescription>
        </div>
        <div className="lg:flex w-full mt-5 lg:gap-7">
          <div className="h-18 border rounded-xl p-6">
            <div className="lg:flex lg:gap-12 lg:space-y-0 space-y-3">
              <div>
                <Label className="flex w-full text-md font-bold space-x-1 justify-center">
                  {firstMonth}
                </Label>
                <div className="flex w-full mt-3 -ml-1 gap-8 justify-center">
                  <Label className="text-xs font-bold">Spent</Label>
                  <Label className="text-xs font-bold">Limit</Label>
                  <Label className="text-xs font-bold">Diff</Label>
                </div>
                <div className="flex w-full justify-center ml-2">
                  <CountUp
                    decimals={2}
                    decimal="."
                    prefix="$"
                    end={firstMonthUsage}
                    duration={0.3}
                  />
                  <div className="h-5 w-0.5 ml-2 mr-2 mt-0.5 border border-black"></div>
                  <CountUp
                    decimals={2}
                    decimal="."
                    prefix="$"
                    end={firstMonthLimit}
                    duration={0.3}
                  />
                  <div className="h-5 w-0.5 ml-2 mr-2 mt-0.5 border border-black"></div>
                  {firstMonthLimit - firstMonthUsage < 0 ? (
                    <>
                      <div className="flex">
                        <Label className="mt-1 text-red-600">
                          <GoTriangleUp />
                        </Label>
                        <Label className="text-md font-normal text-red-600">
                          <CountUp
                            decimals={2}
                            decimal="."
                            prefix="$"
                            end={firstMonthLimit - firstMonthUsage}
                            duration={0.3}
                          />
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex">
                        <Label className="mt-1 text-green-600">
                          <GoTriangleDown />
                        </Label>
                        <Label className="text-md font-normal text-green-600">
                          <CountUp
                            decimals={2}
                            decimal="."
                            prefix="$"
                            end={firstMonthLimit - firstMonthUsage}
                            duration={0.3}
                          />
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <Label className="flex w-full text-md font-bold space-x-1 justify-center">
                  {secondMonth}
                </Label>
                <div className="flex w-full mt-3 -ml-1 gap-8 justify-center">
                  <Label className="text-xs font-bold">Spent</Label>
                  <Label className="text-xs font-bold">Limit</Label>
                  <Label className="text-xs font-bold">Diff</Label>
                </div>
                <div className="flex w-full justify-center ml-2">
                  <CountUp
                    decimals={2}
                    decimal="."
                    prefix="$"
                    end={secondMonthUsage}
                    duration={0.3}
                  />
                  <div className="h-5 w-0.5 ml-2 mr-2 mt-0.5 border border-black"></div>
                  <CountUp
                    decimals={2}
                    decimal="."
                    prefix="$"
                    end={secondMonthLimit}
                    duration={0.3}
                  />
                  <div className="h-5 w-0.5 ml-2 mr-2 mt-0.5 border border-black"></div>
                  {secondMonthLimit - secondMonthUsage < 0 ? (
                    <>
                      <div className="flex">
                        <Label className="mt-1 text-red-600">
                          <GoTriangleUp />
                        </Label>
                        <Label className="text-md font-normal text-red-600">
                          <CountUp
                            decimals={2}
                            decimal="."
                            prefix="$"
                            end={secondMonthLimit - secondMonthUsage}
                            duration={0.3}
                          />
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex">
                        <Label className="mt-1 text-green-600">
                          <GoTriangleDown />
                        </Label>
                        <Label className="text-md font-normal text-green-600">
                          <CountUp
                            decimals={2}
                            decimal="."
                            prefix="$"
                            end={secondMonthLimit - secondMonthUsage}
                            duration={0.3}
                          />
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:flex lg:gap-3 mt-3 lg:pr-7 lg:space-y-0 space-y-3">
              <div>
                <Label className="flex w-full text-md font-bold space-x-1 justify-center">
                  {thirdMonth}
                </Label>
                <div className="flex w-full mt-3 -ml-1 gap-8 justify-center">
                  <Label className="text-xs font-bold">Spent</Label>
                  <Label className="text-xs font-bold">Limit</Label>
                  <Label className="text-xs font-bold">Diff</Label>
                </div>
                <div className="flex w-full justify-center ml-2.5">
                  <CountUp
                    decimals={2}
                    decimal="."
                    prefix="$"
                    end={thirdMonthUsage}
                    duration={0.3}
                  />
                  <div className="h-5 w-0.5 ml-2 mr-2 mt-0.5 border border-black"></div>
                  <CountUp
                    decimals={2}
                    decimal="."
                    prefix="$"
                    end={thirdMonthLimit}
                    duration={0.3}
                  />
                  <div className="h-5 w-0.5 ml-2 mr-2 mt-0.5 border border-black"></div>
                  {thirdMonthLimit - thirdMonthUsage < 0 ? (
                    <>
                      <div className="flex">
                        <Label className="mt-1 text-red-600">
                          <GoTriangleUp />
                        </Label>
                        <Label className="text-md font-normal text-red-600">
                          <CountUp
                            decimals={2}
                            decimal="."
                            prefix="$"
                            end={thirdMonthLimit - thirdMonthUsage}
                            duration={0.3}
                          />
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex">
                        <Label className="mt-1 text-green-600">
                          <GoTriangleDown />
                        </Label>
                        <Label className="text-md font-normal text-green-600">
                          <CountUp
                            decimals={2}
                            decimal="."
                            prefix="$"
                            end={thirdMonthLimit - thirdMonthUsage}
                            duration={0.3}
                          />
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <Label className="flex w-full text-md font-bold space-x-1 justify-center">
                  {currentQuarter} Total
                </Label>
                <div className="flex w-full mt-3 -ml-1 gap-8 justify-center">
                  <Label className="text-xs font-bold">Spent</Label>
                  <Label className="text-xs font-bold">Limit</Label>
                  <Label className="text-xs font-bold">Diff</Label>
                </div>
                <div className="flex w-full justify-center ml-2.5">
                  <CountUp
                    decimals={2}
                    decimal="."
                    prefix="$"
                    end={quarterUsage}
                    duration={0.3}
                  />
                  <div className="h-5 w-0.5 ml-2 mr-2 mt-0.5 border border-black"></div>
                  <CountUp
                    decimals={2}
                    decimal="."
                    prefix="$"
                    end={quarterLimit}
                    duration={0.3}
                  />
                  <div className="h-5 w-0.5 ml-2 mr-2 mt-0.5 border border-black"></div>
                  {quarterLimit - quarterUsage < 0 ? (
                    <>
                      <div className="flex">
                        <Label className="mt-1 text-red-600">
                          <GoTriangleUp />
                        </Label>
                        <Label className="text-md font-normal text-red-600">
                          <CountUp
                            decimals={2}
                            decimal="."
                            prefix="$"
                            end={quarterLimit - quarterUsage}
                            duration={0.3}
                          />
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex">
                        <Label className="mt-1 text-green-600">
                          <GoTriangleDown />
                        </Label>
                        <Label className="text-md font-normal text-green-600">
                          <CountUp
                            decimals={2}
                            decimal="."
                            prefix="$"
                            end={quarterLimit - quarterUsage}
                            duration={0.3}
                          />
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Label className="flex text-md font-bold">
            Status:{" "}
            <div className="ml-2 -mt-0.5">
              <StatusBadge status={"Good"} />
            </div>
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
