import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useHooks } from "@/hooks";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(8, { message: "Invalid password" }),
});

export function LoginCard() {
  const navigate = useNavigate();
  const [invalidLogin, setInvalidLogin] = useState(false);
  const {
    clientI,
    clientII,
    userFirstName,
    userLastName,
    calenderDate,
    userDepartment,
    setLoggedInUser,
    setStatusBankTableData,
    setUserFirstName,
    setUserLastName,
    setUserFullName,
    setUserEmail,
    setUserDepartment,
    setCurrentQuarterLimit,
    setCurrentQuarterUsage,
  } = useHooks();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await clientII
        .post(
          "/api/login/",
          { email: values.email, password: values.password },
          { withCredentials: true }
        )
        .then(() => {
          clientII
            .get("/api/user/")
            .then((res) => {
              const first_name = res.data.user.first_name;
              const last_name = res.data.user.last_name;
              setUserFirstName(first_name);
              setUserLastName(last_name);
              setUserFullName(first_name + " " + last_name);
              setUserEmail(res.data.user.email);
              setUserDepartment(res.data.user.department);
              setLoggedInUser(true);

              clientI
                .post("/api/status-bank-transactions/", {
                  date_from: calenderDate.from.toISOString().split("T")[0],
                  date_to: calenderDate.to.toISOString().split("T")[0],
                  first_name: userFirstName,
                  last_name: userLastName,
                })
                .then((res) => {
                  setStatusBankTableData(res.data.data);
                  setInvalidLogin(false);
                });
            })
            .catch(() => {
              setLoggedInUser(false);
            });
        })
        .catch(() => {
          setInvalidLogin(true);
        });

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
      navigate("/home");
    } catch (error) {
      if (error.response.data["reason"] === "Non existing user") {
        setInvalidLogin(true);
      }
    }
  }

  return (
    <Card className="lg:w-1/2 sm:w-full h-svh rounded-r-3xl">
      <CardHeader className="lg:mt-40">
        <CardTitle>Login</CardTitle>
        <CardDescription>Ulitum CAM finance management account</CardDescription>
        {invalidLogin && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Email and password does not match or not in the system! <br />
              Please try again
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Finance Management Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
