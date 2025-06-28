import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Header from "@/features/profile/header";
import Accordions from "@/features/profile/components/accordion";
import { TeckStack } from "@/features/profile/components/teck-stack";
import Blog from "@/features/blog/components";
import { getUserInfo } from "@/firebase/auth";
import { useAtom } from "jotai";
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
  const [user, setUser] = useAtom(authAtom);
  const hasFetchedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    console.log("user", user);
    const init = async () => {
      if (hasFetchedRef.current || user?.email) return;

      hasFetchedRef.current = true;
      const fetchedUser = await getUserInfo();
      if (fetchedUser?.email) {
        setUser({ email: fetchedUser.email, role: fetchedUser.role || "user" });
      }
    };

    init();
    setIsLoading(false);
  }, [user, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-screen overflow-x-hidden">
      <div className="mx-auto px-4 md:max-w-3xl">
        <Header />
        <Pattern />

        <TeckStack />
        <Pattern />

        <Accordions />
        <Pattern />

        <Blog />
        <Pattern />
      </div>
    </div>
  );
}

export default App;
