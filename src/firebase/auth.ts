import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "./firebaseConfig";
import { http } from "../lib/axios";

export const signInWithCredentials = async (
  email: string,
  password: string
) => {
  try {
    const storedEmail = localStorage.getItem("userEmail");

    if (storedEmail === email) {
      try {
        const meResponse = await http.get("/sso/me");

        console.log("User data from /sso/me:", meResponse.data);
        return meResponse.data;
      } catch (error) {
        console.log(
          "Failed to get user data from /sso/me, proceeding with login:",
          error
        );
      }
    }

    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const user = userCredential.user;
    const token = await user.getIdToken();

    await http.post("/sso/set-cookie", { token });

    localStorage.setItem("userEmail", user.email || "");

    const meResponse = await http.get("/sso/me");

    console.log("User data:", meResponse.data);
    return meResponse.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const test = async () => {
  try {
    const meResponse = await http.get("/sso/me");

    console.log("User data from test:", meResponse.data);
    return meResponse.data;
  } catch (error) {
    console.error("Test error:", error);
    throw error;
  }
};
