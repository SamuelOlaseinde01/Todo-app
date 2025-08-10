import { redirect } from "react-router-dom";

export async function authAdmin() {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    throw redirect("/adminlogin?msg=You must log in first");
  }
}
