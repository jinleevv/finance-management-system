import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useHooks } from "@/hooks";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  trans_date: z.string().min(1, { message: "It is required" }),
  post_date: z.string().min(1, { message: "It is required" }),
  billing_amount: z.string().min(1, { message: "It is required" }),
  merchant_name: z.string().min(1, { message: "It is required" }),
  first_name: z.string().min(1, { message: "It is required" }),
  last_name: z.string().min(1, { message: "It is required" }),
});

export function UploadBankTransactionsFrom() {
  const { clientI } = useHooks();
  const today = new Date();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = JSON.stringify({
        trans_date: values.trans_date,
        post_date: values.post_date,
        billing_amount: values.billing_amount,
        merchant_name: values.merchant_name,
        first_name: values.first_name,
        last_name: values.last_name,
      });

      await clientI
        .post("/api/upload-bank-transaction-list/", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          form.reset({
            trans_date: "",
            post_date: "",
            billing_amount: "",
            merchant_name: "",
            first_name: "",
            last_name: "",
          });
          toast("Bank transaction list has been Updated", {
            description: today.toISOString(),
          });
        })
        .catch((err) => {
          toast.error("Bank transaction upload failed", {
            description: err.response.data["message"],
          });
        });
    } catch (error) {
      toast("Bank transaction upload failed");
    }
  }
  return (
    <section className="w-full m-auto mt-0">
      <div className="h-full mt-12 ml-10 mr-10">
        <Label className="grid text-2xl font-bold">
          Bank Transactions Upload Form
        </Label>
        <Label className="ml-1">
          Corporate Card Transaction Information From Bank
        </Label>
      </div>
      <div className="h-full mt-12 ml-10 mr-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full">
            <div className="flex w-full gap-3">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="trans_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trans Date</FormLabel>
                      <FormControl>
                        <Textarea
                          id="trans_date"
                          placeholder="Trans Date"
                          className="w-[335px] sm:w-full xsm:w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="post_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Date</FormLabel>
                      <FormControl>
                        <Textarea
                          id="post_date"
                          placeholder="Post Date"
                          {...field}
                          className="w-[335px] sm:w-full xsm:w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex mt-7 w-full gap-3">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="billing_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Amount</FormLabel>
                      <FormControl>
                        <Textarea
                          id="billing_amount"
                          placeholder="Billing Amount"
                          className="w-[335px] sm:w-full xsm:w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="merchant_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant Name</FormLabel>
                      <FormControl>
                        <Textarea
                          id="merchant_name"
                          placeholder="Merchant Name"
                          className="w-[335px] sm:w-full xsm:w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex mt-7 w-full gap-3">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Textarea
                          id="first_name"
                          placeholder="First Name"
                          className="w-[335px] sm:w-full xsm:w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Textarea
                          id="last_name"
                          placeholder="Last Name"
                          className="w-[335px] sm:w-full xsm:w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Submit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Upload Bank Transaction Lists</DialogTitle>
                    <DialogDescription>
                      Upload the transaction lists
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Please review before submitting</AlertTitle>
                      <AlertDescription>
                        If you submit, you cannot undo the change!
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button onClick={() => form.handleSubmit(onSubmit)()}>
                        Continue
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
