import React from "react";
import { getUser } from "./admin-api";
import { Link, useLoaderData } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { authAdmin } from "./authAdmin";

export async function loader({ params }) {
  await authAdmin();
  const user = await getUser(params.id);
  return user.user;
}

export async function action({ request }) {
  const formData = request.formData();
}

export default function User() {
  const user = useLoaderData();
  const name = `${user.firstname} ${user.lastname}`;
  return (
    <>
      <div className="admin-user-container">
        <img
          src={user.profileImage || "/images/profile-user.png"}
          className="admin-user-pic"
          alt=""
          srcset=""
        />
        <h4>_id: {user._id}</h4>
        <h3>Name: {name}</h3>
        <h3>
          Email: <a href={`mailto:${user.email}`}>{user.email}</a>
        </h3>
        <h3>
          Created on:{" "}
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(user.createdAt))}
        </h3>
      </div>
      <Link to={"/admin?msg=admin"} className="back">
        <ArrowBack />
      </Link>
    </>
  );
}
