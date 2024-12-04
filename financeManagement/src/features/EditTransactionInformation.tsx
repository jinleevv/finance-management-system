import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHooks } from "@/hooks";
import { toast } from "sonner";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface EditTransactionInformationProps {
  data: any;
}

const formSchema = z.object({
  date: z.date({
    required_error: "It is required",
  }),
  category: z.string().min(1, { message: "It is required" }),
  billing_amount: z.string().min(1, { message: "It is required" }),
  tps: z.string().min(1, { message: "It is required" }),
  tvq: z.string().min(1, { message: "It is required" }),
  merchant_name: z.string().min(1, { message: "It is required" }),
  purpose: z.string().min(1, { message: "It is required" }),
  project: z.string().min(1, { message: "It is required" }),
  attendees: z.string().min(1, { message: "It is required" }),
  department: z.string(),
});

export function EditTransactionInformation({
  data,
}: EditTransactionInformationProps) {
  const {
    clientI,
    calenderDate,
    userFirstName,
    userLastName,
    userDepartment,
    setMyMissingUploadedData,
    setMyTableData,
    setMyMissingBankData,
    setEntireUserUploadedTransactions,
  } = useHooks();
  const [checked, setChecked] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function handleStartEdit() {
    const formData = data[0];

    const originalDate = new Date(
      formData.original["trans_date"] + "T00:00:00"
    );
    form.setValue("date", originalDate);
    form.setValue("category", formData.original["category"]);
    form.setValue("department", formData.original["department"]);
    form.setValue(
      "billing_amount",
      formData.original["billing_amount"].toString()
    );
    form.setValue("tps", formData.original["tps"].toString());
    form.setValue("tvq", formData.original["tvq"].toString());
    form.setValue("merchant_name", formData.original["merchant_name"]);
    form.setValue("project", formData.original["project"]);
    form.setValue("purpose", formData.original["purpose"]);
    form.setValue("attendees", formData.original["attendees"]);
  }
  function handleCheckBox() {
    if (checked) {
      form.setValue("tvq", "");
      form.setValue("tps", "");
      setChecked(false);
    } else {
      const billingAmount = parseFloat(form.getValues().billing_amount);
      const taxableAmount = billingAmount / 1.14975;
      const tvqValue = (taxableAmount * 0.09975).toFixed(2).toString();
      const tpsValue = (taxableAmount * 0.05).toFixed(2).toString();
      form.setValue("tvq", tvqValue);
      form.setValue("tps", tpsValue);
      setChecked(true);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const editData = {
      trans_date: values.date.toISOString().split("T")[0],
      billing_amount: values.billing_amount,
      tps: values.tps,
      tvq: values.tvq,
      merchant_name: values.merchant_name,
      purpose: values.purpose.replaceAll("\n", ", "),
      category: values.category,
      attendees: values.attendees.replaceAll("\n", ", "),
      project: values.project,
    };

    await clientI
      .post(
        "/api/edit-transaction-information/",
        {
          original: data[0].original,
          edit: editData,
          department: userDepartment,
          new_department: values.department,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        if (res.data.message === "Over used") {
          toast("Transaction upload failed: Over the limit");
        } else {
          setMyTableData(res.data);
          setEntireUserUploadedTransactions(res.data);
        }
      })
      .catch(() => {
        toast("Failed to edit the selected item");
      });
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
  }

  return (
    <>
      <div>
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" onClick={handleStartEdit}>
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="block max-w-[820px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Edit Transaction Information</DialogTitle>
              <DialogDescription>
                Edit transaction information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex w-full gap-3">
                  <div className="w-1/2">
                    <Label htmlFor="date">Date</Label>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                          <FormControl>
                            <Popover {...field}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="category">Category</Label>
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="w-full h-full overflow-hidden"
                              >
                                <Button variant="outline">
                                  {field.value ? (
                                    field.value
                                  ) : (
                                    <span>Choose a category</span>
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full h-full break-all">
                                <DropdownMenuLabel>
                                  Choose a category
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <DropdownMenuRadioItem value="Business Trip (Meal)">
                                    Business Trip (Meal)
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Business Trip (Hotel,Gas,Parking,Toll,Trasportation)">
                                    Business Trip
                                    (Hotel,Gas,Parking,Toll,Trasportation)
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Meeting with Business Partners">
                                    Meeting with Business Partners
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Meeting between employees">
                                    Meeting between employees
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Business Conference, Seminar, Workshop">
                                    Business Conference, Seminar, Workshop
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Banking Fees">
                                    Banking Fees
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Car Expenses (Gas, Maintenance, Parking, Toll)">
                                    Car Expenses (Gas, Maintenance, Parking,
                                    Toll)
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Others(Ask Finance Department)">
                                    Others (Ask Finance Department)
                                  </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="department">Department</Label>
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
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
                                <DropdownMenuLabel>
                                  Department
                                </DropdownMenuLabel>
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
                  <div className="w-1/2">
                    <div className="flex gap-3">
                      <Label htmlFor="amount">Billing Amount</Label>
                      <div className="space-x-1 -mt-1">
                        <Checkbox
                          id="terms"
                          checked={checked}
                          onCheckedChange={handleCheckBox}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Auto tax
                        </label>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="billing_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                          <FormControl>
                            <Input
                              id="amount"
                              placeholder="Amount"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex w-1/2 lg:-mt-1 mt-5 gap-3">
                    <div className="w-1/2">
                      <Label htmlFor="amount">TPS(GST)</Label>
                      <FormField
                        control={form.control}
                        name="tps"
                        render={({ field }) => (
                          <FormItem>
                            <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                            <FormControl>
                              <Input
                                id="amount"
                                placeholder="Amount"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="amount">TVQ(QST)</Label>
                      <FormField
                        control={form.control}
                        name="tvq"
                        render={({ field }) => (
                          <FormItem>
                            <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                            <FormControl>
                              <Input
                                id="amount"
                                placeholder="Amount"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex w-full gap-3 mt-5">
                  <div className="w-1/2">
                    <Label htmlFor="merchant_name">Merchant Name</Label>
                    <FormField
                      control={form.control}
                      name="merchant_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                          <FormControl>
                            <Input
                              id="merchant_name"
                              placeholder="Merchant Name"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="project">Project</Label>
                    <FormField
                      control={form.control}
                      name="project"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="w-full h-full xsm:w-full overflow-hidden"
                              >
                                <Button variant="outline">
                                  {field.value ? (
                                    field.value
                                  ) : (
                                    <span>Choose a project</span>
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full h-full break-all">
                                <DropdownMenuLabel>
                                  Choose a project
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="w-full text-center"
                                >
                                  <DropdownMenuRadioItem value="CAM1">
                                    CAM1
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="CAM2">
                                    CAM2
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="PCAM">
                                    PCAM
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="N/A">
                                    N/A
                                  </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex w-full gap-3 mt-5">
                  <div className="w-1/2">
                    <Label htmlFor="purpose">Purpose of Payment</Label>
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide the specific purpose of payment"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="attendees">Attendees</Label>
                    <FormField
                      control={form.control}
                      name="attendees"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                          <FormControl>
                            <Textarea
                              placeholder="Attendees"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="w-full mt-5">
                  <Button type="submit" className="w-full">
                    Save changes
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
