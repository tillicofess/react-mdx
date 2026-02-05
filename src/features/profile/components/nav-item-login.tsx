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
import { useAuth } from "@/providers/auth/auth.tsx";

export default function NavItemLogin() {
  const { isAuthenticated, user, login, logout } = useAuth();

  // 登录
  const handleSignIn = () => {
    login();
  };

  // 退出
  const handleLogOut = async () => {
    logout();
    toast.success("退出成功");
  };

  // 进入后台
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
        {isAuthenticated && user?.name ? (
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel>shadcn</DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={navigateToBackend}>
          Backend
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isAuthenticated && user?.name ? (
          <DropdownMenuItem onSelect={handleLogOut}>Sign out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleSignIn}>Sign in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
