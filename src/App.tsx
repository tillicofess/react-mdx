import { useEffect } from "react";
import { cn } from "@/lib/utils";
import Header from "@/features/profile/header";
import Blog from "@/features/blog/components";
import { getUserInfo } from "@/firebase/auth";
import { useSetAtom } from "jotai";
import { authAtom } from "@/hooks/auth";

function Pattern() {
  return (
    <div
      className={cn(
        "relative flex h-4 w-full border-x border-grid",
        "before:absolute before:-left-[100vw] before:h-4 before:w-[200vw]",
        "before:bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:[--pattern-foreground:var(--color-black)]/5 dark:before:[--pattern-foreground:var(--color-white)]/5"
      )}
    />
  );
}

function App() {
  const setLogin = useSetAtom(authAtom);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserInfo();
        if (user.email) {
          setLogin(() => {
            return {
              isLoggedIn: true,
              email: user.email,
              role: user.role,
            };
          });
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="max-w-screen overflow-x-hidden">
      <div className="mx-auto px-4 md:max-w-3xl">
        <Header />
        <Pattern />

        <Blog />
        <Pattern />
      </div>
    </div>
  );
}

export default App;
