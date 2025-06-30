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
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

export default function NavItemLogin() {
  const navigate = useNavigate();
  const { customUser, signOut } = useAuth();

  const handleLogIn = () => {
    navigate("/login");
  };

  const handleLogOut = async () => {
    await signOut();
    toast.success("退出成功");
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
        {customUser?.email ? (
          <DropdownMenuLabel>{customUser.email}</DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel>shadcn</DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={navigateToBackend}>
          Backend
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {customUser?.email ? (
          <DropdownMenuItem onSelect={handleLogOut}>Log out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleLogIn}>Log in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
