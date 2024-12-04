import { Label } from "@/components/ui/label";
import { useHooks } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  oldPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPasswordCheck: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function Profile() {
  const {
    clientI,
    clientII,
    userFullName,
    userDepartment,
    userEmail,
    setLoggedInUser,
  } = useHooks();
  const navigate = useNavigate();
  const today = new Date();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    if (values.newPassword !== values.newPasswordCheck) {
      toast("New password does not match");
    } else {
      const data = JSON.stringify({
        email: userEmail,
        old_password: values.oldPassword,
        new_password: values.newPassword,
      });

      await clientI
        .post("/api/update-password/", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          clientII
            .post("/api/logout/", { withCredentials: true })
            .then(() => {
              setLoggedInUser(false);
              navigate("/");
            })
            .then(() => {
              form.reset({
                oldPassword: "",
                newPassword: "",
                newPasswordCheck: "",
              });
              toast("Password has been updated, please login again", {
                description: today.toISOString(),
              });
            })
            .catch(() => {
              toast("Failed to update password");
            });
        })
        .catch((err) => {
          if (err.response["data"]["reason"] === "Non existing user") {
            toast(`Password update failed: Current password is wrong}`, {
              description: today.toISOString(),
            });
          } else if (err.response["data"]["new_password"]) {
            toast(
              `Password update failed: ${err.response["data"]["new_password"]}`,
              {
                description: today.toISOString(),
              }
            );
          } else {
            toast(`Password update failed`, {
              description: today.toISOString(),
            });
          }
        });
    }
  }

  return (
    <section className="w-full">
      <div className="mt-12 ml-10 mr-10">
        <Label className="grid text-2xl font-bold">Profile</Label>
        <Label className="ml-1">User Profile Information</Label>
      </div>
      <div className="mt-12 ml-10 mr-10">
        <div className="space-x-10 rounded-lg border p-3">
          <Label>Name: {userFullName}</Label>
          <Label>Department: {userDepartment}</Label>
          <Label>Email: {userEmail}</Label>
        </div>
      </div>
      <div className="mt-5 ml-10 mr-10 rounded-lg border p-3">
        <div>
          <Label className="grid text-lg font-bold">Update Password</Label>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Current password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>New password</FormLabel>
                    <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                    <FormControl>
                      <Input
                        placeholder="New password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPasswordCheck"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>New password check</FormLabel>
                    <FormMessage className="-mt-2 text-[13.5px]"></FormMessage>
                    <FormControl>
                      <Input
                        placeholder="New password check"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-full mt-5 justify-end">
                <Button type="submit">Update password</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
