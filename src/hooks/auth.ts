import { atom } from "jotai";

export const authAtom = atom({
  email: "",
  role: "user",
});
