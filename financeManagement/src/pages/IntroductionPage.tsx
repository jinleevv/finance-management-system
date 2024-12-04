import { Button } from "@/components/ui/button";
import { BackgroundAnimation } from "@/features/BackgroundAnimation";
import { IntroductionPageAnimation } from "@/features/IntroductionPageAnimation";
import { useHooks } from "@/hooks";
import { BackpackIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function IntroductionPage() {
  const navigate = useNavigate();
  const {
    clientI,
    clientII,
    loggedInUser,
    userDepartment,
    setLoggedInUser,
    setUserFirstName,
    setUserLastName,
    setUserFullName,
    setUserEmail,
    setUserDepartment,
    setCurrentQuarterLimit,
    setCurrentQuarterUsage,
  } = useHooks();

  useEffect(() => {
    clientII
      .get("/api/sessionid-exist/")
      .then((res) => {
        if (res.status === 204) {
          toast(
            "Please log in to the website. Either your session is expired or you are not logged in",
            { id: 1 }
          );
          setLoggedInUser(false);
        } else {
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
            })
            .catch(() => {
              setLoggedInUser(false);
            });
        }
      })
      .catch(() => {
        setLoggedInUser(false);
        toast("Something went wrong", { id: 1 });
      });
  }, []);

  async function handleClick() {
    if (!loggedInUser) {
      navigate("/login");
    } else {
      const response = await clientII.get("/api/sessionid-exist/");

      if (response.status === 200) {
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
      }
    }
  }
  return (
    <>
      <BackgroundAnimation />
      <div className="w-full h-full">
        <div className="grid">
          <p className="w-full h-1/2 translate-y-1/3 mb-4 mt-40">
            <IntroductionPageAnimation />
          </p>
          <Button
            className="w-auto translate-y-12 m-auto text-[18px] gap-3"
            onClick={handleClick}
          >
            <BackpackIcon className="mt-0.5" />
            Get Started
          </Button>
        </div>
      </div>
    </>
  );
}
