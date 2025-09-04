import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";

function Callback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const storedState = localStorage.getItem("state");
    const navigate = useNavigate();

    if (state !== storedState) {
        console.error("State mismatch");
        return;
    }
    useEffect(() => {
        if (code) {
            // 交换 code 为 token
            fetch("http://127.0.0.1:3001/exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    state,
                }),
                credentials: "include",
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code === 200) {
                        localStorage.removeItem("state");
                        navigate("/");
                    } else {
                        console.error("Token exchange failed");
                    }
                });
        }
    }, [code]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 p-8 rounded-lg bg-background shadow-md">
                <Spinner size="lg" className="text-primary" />
                <p className="text-lg font-medium">正在登录中，请稍候...</p>
            </div>
        </div>
    );
}

export default Callback;