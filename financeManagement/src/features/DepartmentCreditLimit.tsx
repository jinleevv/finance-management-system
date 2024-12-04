import { Label } from "@/components/ui/label";
import { useHooks } from "@/hooks";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

const FormSchema = z.object({
  department: z.string().min(1, "Please provide a limit"),
  month: z.string().min(1, "Please provide a limit"),
  limit: z.string().min(1, "Please provide a limit"),
});

export function DepartmentCreditLimit() {
  const { clientI, departmentCreditCardInfo, setDepartmentCreditCardInfo } =
    useHooks();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [Q1Selected, setQ1Selected] = useState<boolean>(true);
  const [Q2Selected, setQ2Selected] = useState<boolean>(false);
  const [Q3Selected, setQ3Selected] = useState<boolean>(false);
  const [Q4Selected, setQ4Selected] = useState<boolean>(false);

  function handleTabChange(value: string) {
    if (value === "1Q") {
      setQ1Selected(true);
      setQ2Selected(false);
      setQ3Selected(false);
      setQ4Selected(false);
    } else if (value === "2Q") {
      setQ1Selected(false);
      setQ2Selected(true);
      setQ3Selected(false);
      setQ4Selected(false);
    } else if (value === "3Q") {
      setQ1Selected(false);
      setQ2Selected(false);
      setQ3Selected(true);
      setQ4Selected(false);
    } else if (value === "4Q") {
      setQ1Selected(false);
      setQ2Selected(false);
      setQ3Selected(false);
      setQ4Selected(true);
    }
  }

  function formatAmount(amount: number) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    return formatter.format(Math.abs(amount));
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await clientI
      .post("/api/department-credit-card-limit/", {
        department: data.department,
        month: data.month,
        limit: data.limit,
      })
      .then(() => {
        clientI.get("/api/department-credit-card-limit/").then((res) => {
          setDepartmentCreditCardInfo(res.data);
        });
        toast("Change has been applied");
      })
      .catch(() => toast("Failed to upload"));
  }

  return (
    <section className="w-full">
      <div className="mt-12 ml-10 mr-10">
        <Label className="grid text-2xl font-bold">
          Set Credit Card Limit for Each Department
        </Label>
        <Label className="ml-1">Set Credit Card Limit</Label>
      </div>
      <div className="w-full mt-4 pl-10 pr-10">
        <Tabs defaultValue="1Q" onValueChange={handleTabChange}>
          <TabsList className="bg-white gap-10">
            <TabsTrigger
              value="1Q"
              className="bg-white shadow-none border-0 p-0 items-start data-[state=active]:shadow-none"
            >
              <div
                className={cn(`gap-[18px] border-b-2 flex transition-all`, {
                  "border-black": Q1Selected,
                })}
              >
                <p
                  className={cn(
                    `text-16 line-clamp-1 flex-1 font-medium text-black`,
                    {
                      "text-black": Q1Selected,
                    }
                  )}
                >
                  1Q
                </p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="2Q"
              className="bg-white shadow-none border-0 p-0 items-start data-[state=active]:shadow-none"
            >
              <div
                className={cn(`gap-[18px] border-b-2 flex transition-all`, {
                  "border-black": Q2Selected,
                })}
              >
                <p
                  className={cn(
                    `text-16 line-clamp-1 flex-1 font-medium text-black`,
                    {
                      "text-black": Q2Selected,
                    }
                  )}
                >
                  2Q
                </p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="3Q"
              className="bg-white shadow-none border-0 p-0 items-start data-[state=active]:shadow-none"
            >
              <div
                className={cn(`gap-[18px] border-b-2 flex transition-all`, {
                  "border-black": Q3Selected,
                })}
              >
                <p
                  className={cn(
                    `text-16 line-clamp-1 flex-1 font-medium text-black`,
                    {
                      "text-black": Q3Selected,
                    }
                  )}
                >
                  3Q
                </p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="4Q"
              className="bg-white shadow-none border-0 p-0 items-start data-[state=active]:shadow-none"
            >
              <div
                className={cn(`gap-[18px] border-b-2 flex transition-all`, {
                  "border-black": Q4Selected,
                })}
              >
                <p
                  className={cn(
                    `text-16 line-clamp-1 flex-1 font-medium text-black`,
                    {
                      "text-black": Q4Selected,
                    }
                  )}
                >
                  4Q
                </p>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="1Q" className="rounded-lg border p-4">
            <div>
              <div className="flex w-full space-y-7">
                <Label className="font-bold text-lg">Limit:</Label>
                <div className="flex ml-32 w-full">
                  <div className="flex w-full">
                    <Label className="font-bold">January </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">February </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">March </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">Q1 Limit</Label>
                  </div>
                </div>
              </div>
              <div className="h-52 overflow-auto">
                {departmentCreditCardInfo.map((item) => {
                  return (
                    <div className="flex w-full mt-4 p-2">
                      <Label className="font-bold w-44 overflow-auto mr-6">
                        {item.department}
                      </Label>
                      <div className="flex w-full">
                        <div className="flex w-full">
                          <Label>{formatAmount(item.january_limit)}</Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.february_limit)} </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.march_limit)} </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.q1_limit)} </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="w-full border-t mt-2"></div>
              <div className="flex w-full mt-5 space-y-7">
                <Label className="font-bold text-lg">Usage:</Label>
                <div className="flex ml-32 w-full">
                  <div className="flex w-full">
                    <Label className="font-bold">January </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">February </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">March </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">Q1 Summary </Label>
                  </div>
                </div>
              </div>
              <div className="h-52 overflow-auto">
                {departmentCreditCardInfo.map((item) => {
                  const remainingJan = item.january_limit - item.january_usage;
                  const remainingFeb =
                    item.february_limit - item.february_usage;
                  const remainingMarch = item.march_limit - item.march_usage;
                  const remainingQ1 = item.q1_limit - item.q1_usage;
                  return (
                    <div className="flex w-full mt-5 p-2">
                      <Label className="font-bold w-44 overflow-auto mr-2">
                        {item.department}
                      </Label>
                      <div className="flex ml-6 w-full">
                        <div className="flex -ml-2 w-full">
                          <Label>{formatAmount(item.january_usage)}</Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingJan < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingJan < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingJan)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingJan)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.february_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingFeb < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingFeb < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingFeb)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingFeb)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.march_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingMarch < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingMarch < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingMarch)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingMarch)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.q1_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingQ1 < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingQ1 < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingQ1)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingQ1)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="2Q" className="rounded-lg border p-4">
            <div>
              <div className="flex w-full space-y-7">
                <Label className="font-bold text-lg">Limit:</Label>
                <div className="flex ml-32 w-full">
                  <div className="flex w-full">
                    <Label className="font-bold">April </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">May </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">June </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">Q2 Limit </Label>
                  </div>
                </div>
              </div>
              <div className="h-52 overflow-auto">
                {departmentCreditCardInfo.map((item) => {
                  return (
                    <div className="flex w-full mt-4 p-2">
                      <Label className="font-bold w-44 overflow-auto mr-6">
                        {item.department}
                      </Label>
                      <div className="flex w-full">
                        <div className="flex w-full">
                          <Label>{formatAmount(item.april_limit)}</Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.may_limit)} </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.june_limit)} </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.q2_limit)} </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="w-full border-t mt-2"></div>
              <div className="flex w-full mt-5 space-y-7">
                <Label className="font-bold text-lg">Usage:</Label>
                <div className="flex ml-32 w-full">
                  <div className="flex w-full">
                    <Label className="font-bold">April </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">May </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">June </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">Q2 Summary </Label>
                  </div>
                </div>
              </div>
              <div className="h-52 overflow-auto">
                {departmentCreditCardInfo.map((item) => {
                  const remainingApril = item.april_limit - item.april_usage;
                  const remainingMay = item.may_limit - item.may_usage;
                  const remainingJune = item.june_limit - item.june_usage;
                  const remainingQ2 = item.q2_limit - item.q2_usage;

                  return (
                    <div className="flex w-full mt-5 p-2">
                      <Label className="font-bold w-44 overflow-auto mr-2">
                        {item.department}
                      </Label>
                      <div className="flex ml-6 w-full">
                        <div className="flex -ml-4 w-full">
                          <Label>{formatAmount(item.april_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingApril < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingApril < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingApril)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingApril)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.may_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingMay < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingMay < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingMay)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingMay)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.june_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingJune < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingJune < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingJune)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingJune)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.q2_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingQ2 < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingQ2 < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingQ2)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingQ2)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="3Q" className="rounded-lg border p-4">
            <div>
              <div className="flex w-full space-y-7">
                <Label className="font-bold text-lg">Limit:</Label>
                <div className="flex ml-32 w-full">
                  <div className="flex w-full">
                    <Label className="font-bold">July </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">August </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">September </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">Q3 Limit </Label>
                  </div>
                </div>
              </div>
              <div className="h-52 overflow-auto">
                {departmentCreditCardInfo.map((item) => {
                  return (
                    <div className="flex w-full mt-4 p-2">
                      <Label className="font-bold w-44 overflow-auto mr-6">
                        {item.department}
                      </Label>
                      <div className="flex w-full">
                        <div className="flex w-full">
                          <Label>{formatAmount(item.july_limit)}</Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.august_limit)} </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.september_limit)} </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.q3_limit)} </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="w-full border-t mt-2"></div>
              <div className="flex w-full mt-5 space-y-7">
                <Label className="font-bold text-lg">Usage:</Label>
                <div className="flex ml-32 w-full">
                  <div className="flex w-full">
                    <Label className="font-bold">July </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">August </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">September </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">Q3 Summary</Label>
                  </div>
                </div>
              </div>
              <div className="h-52 overflow-auto">
                {departmentCreditCardInfo.map((item) => {
                  const remainingJuly = item.july_limit - item.july_usage;
                  const remainingAugust = item.august_limit - item.august_usage;
                  const remainingSeptember =
                    item.september_limit - item.september_usage;
                  const remainingQ3 = item.q3_limit - item.q3_usage;

                  return (
                    <div className="flex w-full mt-5 p-2">
                      <Label className="font-bold w-44 overflow-auto mr-2">
                        {item.department}
                      </Label>
                      <div className="flex ml-6 w-full">
                        <div className="flex -ml-6 w-full">
                          <Label>{formatAmount(item.july_usage)}</Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingJuly < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingJuly < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingJuly)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingJuly)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.august_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingAugust < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingAugust < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingAugust)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingAugust)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.september_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingSeptember < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingSeptember < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingSeptember)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingSeptember)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.q3_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingQ3 < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingQ3 < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingQ3)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingQ3)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="4Q" className="rounded-lg border p-4">
            <div>
              <div className="flex w-full space-y-7">
                <Label className="font-bold text-lg">Limit:</Label>
                <div className="flex ml-32 w-full">
                  <div className="flex w-full">
                    <Label className="font-bold">October </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">November </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">December </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">Q4 Limit </Label>
                  </div>
                </div>
              </div>
              <div className="h-52 overflow-auto">
                {departmentCreditCardInfo.map((item) => {
                  return (
                    <div className="flex w-full mt-4 p-2">
                      <Label className="font-bold w-44 overflow-auto mr-6">
                        {item.department}
                      </Label>
                      <div className="flex w-full">
                        <div className="flex w-full">
                          <Label>{formatAmount(item.october_limit)}</Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.november_limit)} </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.december_limit)} </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.q4_limit)} </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="w-full border-t mt-2"></div>
              <div className="flex w-full mt-5 space-y-7">
                <Label className="font-bold text-lg">Usage:</Label>
                <div className="flex ml-32 w-full">
                  <div className="flex w-full">
                    <Label className="font-bold">October </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">November </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">December </Label>
                  </div>
                  <div className="flex w-full">
                    <Label className="font-bold">Q4 Summary </Label>
                  </div>
                </div>
              </div>
              <div className="h-52 overflow-auto">
                {departmentCreditCardInfo.map((item) => {
                  const remainingOctober =
                    item.october_limit - item.october_usage;
                  const remainingNovember =
                    item.november_limit - item.november_usage;
                  const remainingDecember =
                    item.december_limit - item.december_usage;
                  const remainingQ4 = item.q4_limit - item.q4_usage;
                  return (
                    <div className="flex w-full mt-5 p-2">
                      <Label className="font-bold w-44 overflow-auto mr-2">
                        {item.department}
                      </Label>
                      <div className="flex ml-10 w-full">
                        <div className="flex -ml-4 w-full">
                          <Label>{formatAmount(item.october_usage)}</Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingOctober < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingOctober < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingOctober)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingOctober)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.november_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingNovember < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingNovember < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingNovember)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingNovember)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.december_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingDecember < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingDecember < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingDecember)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingDecember)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                        <div className="flex w-full">
                          <Label>{formatAmount(item.q4_usage)} </Label>
                          <div className="h-5 ml-2 mr-2 -mt-0.5 border border-black"></div>
                          <Label
                            className={
                              remainingQ4 < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {remainingQ4 < 0 ? (
                              <>
                                <div className="flex">
                                  <GoTriangleUp />
                                  {formatAmount(remainingQ4)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex">
                                  <GoTriangleDown />
                                  {formatAmount(remainingQ4)}
                                </div>
                              </>
                            )}
                          </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12 ml-10 mr-10 p-3 border rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-3">
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Procurement">
                            Procurement
                          </SelectItem>
                          <SelectItem value="Construction Director">
                            Construction Director
                          </SelectItem>
                          <SelectItem value="Construction">
                            Construction
                          </SelectItem>
                          <SelectItem value="Production & Safety">
                            Production & Safety
                          </SelectItem>
                          <SelectItem value="Quality & Technology">
                            Quality & Technology
                          </SelectItem>
                          <SelectItem value="Maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="President">President</SelectItem>
                          <SelectItem value="IT Security">
                            IT Security
                          </SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR General Affairs">
                            HR General Affairs
                          </SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Compliance">Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Limit Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="January">January</SelectItem>
                          <SelectItem value="February">February</SelectItem>
                          <SelectItem value="March">March</SelectItem>
                          <SelectItem value="April">April</SelectItem>
                          <SelectItem value="May">May</SelectItem>
                          <SelectItem value="June">June</SelectItem>
                          <SelectItem value="July">July</SelectItem>
                          <SelectItem value="August">August</SelectItem>
                          <SelectItem value="September">September</SelectItem>
                          <SelectItem value="October">October</SelectItem>
                          <SelectItem value="November">November</SelectItem>
                          <SelectItem value="December">December</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Limit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full mt-3 justify-end">
              <Button type="submit">Apply</Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
