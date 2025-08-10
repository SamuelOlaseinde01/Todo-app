import React from "react";
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "./admin-api";
import { toast } from "react-toastify";

export async function loader({ request }) {
  const url = new URL(request.url).searchParams.get("msg");
  return url;
}

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const password = formData.get("password");
  const creds = {
    name,
    password,
  };
  try {
    const user = await login(creds);
    const url =
      new URL(request.url).searchParams.get("redirectTo") ||
      `/admin?msg=${user.name}`;
    console.log(url);
    return redirect(url);
  } catch (err) {
    toast.error(err.message);
    return null;
  }
}

export default function AdminLogin() {
  const navigation = useNavigation();
  const msg = useLoaderData();
  const [type, setType] = React.useState("password");
  const [visibility, setVisibility] = React.useState(false);
  const hasToasted = React.useRef(false);

  React.useEffect(() => {
    if (msg === "Logout successful" && !hasToasted.current) {
      toast.success(msg);
      hasToasted.current = true;
    }
    if (msg && !hasToasted.current) {
      toast.error(msg);
      hasToasted.current = true;
    }
  }, [msg]);

  function handleClick() {
    setVisibility((prev) => !prev);
    if (!visibility) {
      setType("text");
    } else if (visibility) {
      setType("password");
    }
  }

  return (
    <>
      <div className="admin-login">
        <div className="admin-login-container">
          <h1>Admin Login</h1>
          <Link to={"/"} className="lock-icon">
            <Person />
          </Link>
          <Form method="post" className="form">
            <div className="label-container">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="name"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="label-container">
              <label htmlFor="password">Password:</label>
              <div className="input-container">
                <input
                  id="password"
                  type={type}
                  name="password"
                  placeholder="Enter your password"
                  required
                />
                <div className="eye" onClick={handleClick}>
                  {visibility ? <Visibility /> : <VisibilityOff />}
                </div>
              </div>
            </div>
            <button
              className={
                navigation.state === "submitting"
                  ? "loading-btn"
                  : "default-btn"
              }
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "Logging in..." : "Log in"}
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
