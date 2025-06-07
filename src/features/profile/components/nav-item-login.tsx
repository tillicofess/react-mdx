import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { authAtom } from "@/hooks/auth";

import { signOut } from "@/firebase/auth";

export default function NavItemLogin() {
  const navigate = useNavigate();
  const [login, setLogin] = useAtom(authAtom);

  const handleLogIn = () => {
    navigate("/login");
  };

  const handleLogOut = async () => {
    const res = await signOut();
    if (res.message == "已退出") {
      setLogin({
        isLoggedIn: false,
        email: "",
        role: "user",
      });
    }
  };

  const navigateToBackend = () => {
    window.open("https://ticscreek.top");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <CircleUserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {login.isLoggedIn ? (
          <DropdownMenuLabel>{login.email}</DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel>shadcn</DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={navigateToBackend}>
          Backend
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {login.isLoggedIn ? (
          <DropdownMenuItem onSelect={handleLogOut}>Log out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleLogIn}>Log in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
