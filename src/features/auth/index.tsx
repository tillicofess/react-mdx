// import { AuthCallback as CasdoorAuthCallback } from "casdoor-react-sdk";
// import * as Setting from "./Setting";
// import { useNavigate } from "react-router";
// import { Spinner } from "@/components/ui/spinner";
// import { useAuth } from "@/providers/AuthProvider";

// export default function AuthCallback() {
//     const navigate = useNavigate();
//     const { setToken } = useAuth();

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//             <div className="flex flex-col items-center gap-4 p-8 rounded-lg bg-background shadow-md">
//                 <Spinner size="lg" className="text-primary" />
//                 <p className="text-lg font-medium">正在登录中，请稍候...</p>
//             </div>
//             <CasdoorAuthCallback
//                 sdk={Setting.CasdoorSDK}
//                 serverUrl={Setting.ServerUrl}
//                 saveTokenFromResponse={(res) => {
//                     localStorage.setItem("token", (res as any).accessToken);
//                     localStorage.setItem("refreshToken", (res as any).refreshToken);
//                     setToken(true);
//                     navigate('/');
//                 }}
//                 isGetTokenSuccessful={(res) => {
//                     return !!(res as any).accessToken;
//                 }}
//             />
//         </div>
//     )
// }