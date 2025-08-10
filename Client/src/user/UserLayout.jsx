import React from "react";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import { PowerSettingsNew } from "@mui/icons-material";
import { authUser } from "./authUser";

export async function loader() {
  await authUser();
  return null;
}

export default function UserLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
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
            to={`/?msg=Logout successful`}
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
