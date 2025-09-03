import { useEffect } from "react";
import { useNavigate } from "react-router";

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
        <div>
            <h1>正在登录中...</h1>
        </div>
    );
}

export default Callback;