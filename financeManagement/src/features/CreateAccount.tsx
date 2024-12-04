import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useHooks } from "@/hooks";

const formSchema = z.object({
  first_name: z.string().min(2).max(50, {
    message: "The length of name should be in between 2 to 50 characters",
  }),
  last_name: z.string().min(2).max(50, {
    message: "The length of name should be in between 2 to 50 characters",
  }),
  department: z.string(),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Invalid password" }),
  confirm_password: z.string().min(8, { message: "Invalid password" }),
});

export function CreateAccount() {
  const navigate = useNavigate();
  const { clientI } = useHooks();
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [failedUserCreation, setFailedUserCreation] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.confirm_password) {
      setInvalidPassword(true);
    } else {
      try {
        const data = JSON.stringify({
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          department: values.department,
          password: values.password,
        });

        await clientI
          .post("/api/register/", data, {
            headers: { "Content-Type": "application/json" },
          })
          .then(() => {
            setFailedUserCreation(false);
            navigate("/login");
          })
          .catch(() => {
            setFailedUserCreation(true);
          });
      } catch (error) {
        setFailedUserCreation(true);
      }
    }
  }
  return (
    <section className="w-full">
      <div className="mt-12 ml-10 mr-10">
        <Label className="grid text-2xl font-bold">Create an account</Label>
        <Label className="ml-1">Create an account</Label>
      </div>
      {invalidPassword && (
        <Alert variant="destructive" className="mt-5 ml-10 mr-10">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Password does not match! Please enter it again
          </AlertDescription>
        </Alert>
      )}
      {failedUserCreation && (
        <Alert variant="destructive" className="mt-5 ml-10 mr-10">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Failed to create a user! Please contact IT administrator
          </AlertDescription>
        </Alert>
      )}
      <div className="h-full mt-12 ml-10 mr-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full">
            <div className="flex w-full gap-3">
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          id="first_name"
                          placeholder="First Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          id="last_name"
                          placeholder="Last Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="w-full">
                            <Button variant="outline">
                              {field.value ? (
                                field.value
                              ) : (
                                <span>Department</span>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            <DropdownMenuLabel>Department</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="w-full"
                            >
                              <DropdownMenuRadioItem value="Procurement">
                                Procurement
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="Construction">
                                Construction
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="Production & Safety">
                                Production & Safety
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="Quality & Technology">
                                Quality & Technology
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="Maintenance">
                                Maintenance
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="President">
                                President
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="IT Security">
                                IT Security
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="Finance">
                                Finance
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="HR General Affairs">
                                HR General Affairs
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="Marketing">
                                Marketing
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="Compliance">
                                Compliance
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full gap-3 mt-7">
              <div className="w-full">
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
              </div>
            </div>
            <div className="flex w-full gap-3 mt-7">
              <div className="w-1/2">
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
                          placeholder="Create Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
