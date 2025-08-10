import { redirect } from "react-router-dom";

export async function authUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw redirect(`/?msg=You must log in first`);
  }
}
