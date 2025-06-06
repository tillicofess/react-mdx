import { atom } from "jotai";

export const authAtom = atom({
  isLoggedIn: false,
  email: "",
  role: "user",
});
