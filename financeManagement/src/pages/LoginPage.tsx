import { BackgroundAnimation } from "@/features/BackgroundAnimation";
import { LoginCard } from "@/features/LoginCard";
import { useHooks } from "@/hooks";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LoginPage() {
  const {
    clientII,
    loggedInUser,
    setLoggedInUser,
    setUserFirstName,
    setUserLastName,
    setUserEmail,
    setUserDepartment,
    setUserFullName,
    setCurrentPage,
  } = useHooks();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(location.pathname);
    if (loggedInUser) {
      navigate("/home");
    }
  });

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
          navigate("/home");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex">
      <LoginCard />
      <BackgroundAnimation />
    </div>
  );
}
