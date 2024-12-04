import { useHooks } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PersonIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { IoLogOut } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export function Footer() {
  const {
    clientII,
    userFirstName,
    userLastName,
    userDepartment,
    userEmail,
    setLoggedInUser,
    setCurrentPage,
  } = useHooks();
  const navigate = useNavigate();

  async function handleLogout(e: any) {
    e.preventDefault();
    await clientII.post("/api/logout/", { withCredentials: true }).then(() => {
      setLoggedInUser(false);
      navigate("/");
    });
  }

  function handleProfile() {
    setCurrentPage("/profile");
    navigate("/profile");
  }

  return (
    <footer className="flex w-full border-t cursor-pointer lg:p-3 p-2 space-x-4 -ml-3 lg:-ml-0">
      <div className="m-auto">
        <Avatar className="hover:shadow-lg">
          <AvatarFallback>
            <PersonIcon onClick={handleProfile} />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex w-full">
        <div className="grid w-full m-auto space-y-1">
          <Label className="w-full font-bold">
            {userFirstName} {userLastName},{" "}
            <span className="font-normal text-xs">{userDepartment}</span>
          </Label>
          <Label className="w-full text-xs">{userEmail}</Label>
        </div>
        <div className="flex w-full p-2 justify-end">
          <Button variant="ghost" onClick={handleLogout}>
            <IoLogOut />
          </Button>
        </div>
      </div>
    </footer>
  );
}
