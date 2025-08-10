import React from "react";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import { PowerSettingsNew } from "@mui/icons-material";
import { authUser } from "./authUser";

export async function loader({ request }) {
  await authUser();
  const url = new URL(request.url).pathname;
  return url;
}

export default function UserLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const url = useLoaderData();
  const msg = searchParams.get("msg");

  function handleClick() {
    localStorage.removeItem("token");
  }
  return (
    <>
      <div className="user-container">
        <header>
          <h2 style={{ textTransform: "capitalize" }}>Welcome, {msg}</h2>
          <Link
            to={`/?msg=Logout successful&${url}`}
            onClick={handleClick}
            className="logout-btn"
          >
            <PowerSettingsNew />
            <p>Log out</p>
          </Link>
        </header>
        <Outlet />
      </div>
    </>
  );
}
