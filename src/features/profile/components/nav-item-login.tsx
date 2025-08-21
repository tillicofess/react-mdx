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
import * as Setting from "@/features/auth/Setting";
import { useAuth } from "@/providers/AuthProvider";

export default function NavItemLogin() {
  const { userInfo, signOut } = useAuth();

  // 登录
  const handleSignIn = () => {
    const url = Setting.getSigninUrl();
    Setting.goToLink(url);
  };

  // 退出
  const handleLogOut = async () => {
    signOut();
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
        {userInfo?.name ? (
          <DropdownMenuLabel>{userInfo.name}</DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel>shadcn</DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={navigateToBackend}>
          Backend
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {userInfo?.name ? (
          <DropdownMenuItem onSelect={handleLogOut}>Sign out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleSignIn}>Sign in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
