import React from "react";
import {
  Form,
  Link,
  redirect,
  useNavigation,
  useLoaderData,
} from "react-router-dom";
import { login } from "../user/user-api";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";

export async function loader({ request }) {
  const msg = new URL(request.url).searchParams.get("msg");
  return msg;
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const creds = { email, password };

  try {
    const user = await login(creds);
    return redirect(`/user?msg=${user.name}`);
  } catch (err) {
    toast.error(err.message || "Login failed");
    return null;
  }
}

export default function UserLogin() {
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
    setType((prev) => (prev === "password" ? "text" : "password"));
  }

  return (
    <div className="user-login">
      <div className="user-login-container">
        <h1>Sign in</h1>
        <Link to={"/adminlogin"} className="lock-icon">
          <Lock />
        </Link>
        <Form method="post" className="form">
          <div className="label-container">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
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
              navigation.state === "submitting" ? "loading-btn" : "default-btn"
            }
          >
            {navigation.state === "submitting" ? "Signing in..." : "Sign in"}
          </button>
          <p>
            Don't have an account? <Link to={"/register"}>Sign up</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
