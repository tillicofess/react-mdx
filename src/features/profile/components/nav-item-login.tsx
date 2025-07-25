// import { useNavigate } from "react-router";
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
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider copy";

export default function NavItemLogin() {
  const { userInfo, login, logout } = useAuth();

  const handleLogIn = () => {
    login();
  };

  const handleLogOut = async () => {
    try {
      await logout();
      toast.success("退出成功");
    } catch (error: any) {
      toast.error("退出失败:" + error.message);
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
        {userInfo?.username ? (
          <DropdownMenuLabel>{userInfo.username}</DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel>shadcn</DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={navigateToBackend}>
          Backend
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {userInfo?.username ? (
          <DropdownMenuItem onSelect={handleLogOut}>Log out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleLogIn}>Log in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
