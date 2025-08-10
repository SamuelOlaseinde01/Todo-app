import React from "react";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import { PowerSettingsNew } from "@mui/icons-material";
import { authAdmin } from "./authAdmin";

export async function loader({ request }) {
  await authAdmin();
  const url = new URL(request.url).pathname;
  return url;
}

export default function AdminLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const msg = searchParams.get("msg");
  const url = useLoaderData();

  console.log(url);

  function handleClick() {
    localStorage.removeItem("adminToken");
  }
  return (
    <>
      <header>
        <h2>Welcome, {msg}</h2>
        <Link
          to={`/adminlogin?msg=Logout successful&redirectTo=${url}`}
          onClick={handleClick}
          className="logout-btn"
        >
          <PowerSettingsNew />
          <p>Log out</p>
        </Link>
      </header>
      <Outlet />
    </>
  );
}
