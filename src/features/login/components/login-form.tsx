import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { signInWithCredentials } from "@/firebase/auth";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import { authAtom } from "@/hooks/auth";
import { getUserInfo } from "@/firebase/auth";
import { toast } from "sonner";

interface SignInResult {
  success: boolean;
  email?: string;
  role?: string;
  error?: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(authAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (user && user.email) {
        navigate("/");
        return;
      }

      const fetchedUser = await getUserInfo();
      if (fetchedUser?.email) {
        setUser({ email: fetchedUser.email, role: fetchedUser.role || "user" });
        navigate("/");
      }
    };

    init();
  }, [user, setUser]);

  // 处理登录
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      if (!email || !password) {
        return;
      }
      const result = await signIn("credentials", formData);
      if (!result.success) {
        toast.error(result.error || "Login failed");
        return;
      }
      toast("登录成功！");
      setUser({ email: result.email!, role: result.role || "user" });
    } finally {
      setLoading(false);
    }
  };

  // 登录
  const signIn = async (
    id: string,
    formData?: FormData
  ): Promise<SignInResult> => {
    if (id === "credentials") {
      const email = formData?.get("email") as string;
      const password = formData?.get("password") as string;
      try {
        const result = await signInWithCredentials(email, password);
        return { success: true, email: result.email, role: result.role };
      } catch (error: any) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: "Unsupported login method" };
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  signIn("google");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
            </div>
            <form onSubmit={handleEmailLogin}>
              <div className="grid gap-6">
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {!loading ? (
                      "Login"
                    ) : (
                      <>
                        <Loader2Icon className="animate-spin" />
                        Please wait
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* 同意条款 */}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        点击“继续”表示您已阅读并同意我们的 <a href="#">服务条款</a>,
        并了解我们如何使用 <a href="#">Cookie</a>。
      </div>
    </div>
  );
}
