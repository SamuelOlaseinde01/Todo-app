import React from "react";
import { Link } from "react-router-dom";
import { Home } from "@mui/icons-material";
import { Error } from "@mui/icons-material";

export default function NotFound() {
  return (
    <>
      <div className="notfound-container">
        <div className="notfound">
          <Error style={{ color: "black", fontSize: "6em" }} />
          <h1>404 Page not found</h1>
          <p>Looks like something is broken. It's not you, it's us.</p>
          <p>How about going back to the home page?</p>
          <Link to={"/"} style={{ display: "flex", gap: "2px" }}>
            <Home />
            Home Page
          </Link>
        </div>
      </div>
    </>
  );
}
