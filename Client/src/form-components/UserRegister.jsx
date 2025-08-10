import React from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { register } from "../user/user-api";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";

export async function action({ request }) {
  const formData = await request.formData();
  const password = formData.get("password");
  const cPassword = formData.get("cpassword");
  if (password !== cPassword) {
    return toast.error("Passwords do not match!");
  }
  try {
    await register(formData);
    toast.success("Registration successful!");
    return redirect("/");
  } catch (err) {
    toast.error(err.message);
    return null;
  }
}

export default function UserRegister() {
  const navigation = useNavigation();
  const [type, setType] = React.useState("password");
  const [visibility, setVisibility] = React.useState(false);
  const [cptype, setCpType] = React.useState("password");
  const [cpVisibility, setCpVisibility] = React.useState(false);

  function handleClick() {
    setVisibility((prev) => !prev);
    if (!visibility) {
      setType("text");
    } else if (visibility) {
      setType("password");
    }
  }

  function handleCpClick() {
    setCpVisibility((prev) => !prev);
    if (!cpVisibility) {
      setCpType("text");
    } else if (cpVisibility) {
      setCpType("password");
    }
  }

  return (
    <>
      <div className="user-register">
        <div className="user-register-container">
          <h1>Sign Up</h1>
          <Link to={"/adminlogin"} className="lock-icon">
            <Lock />
          </Link>
          <Form method="post" className="form" encType="multipart/form-data">
            <div className="label-name-container">
              <div className="label-container">
                <label htmlFor="firstname">First name: </label>
                <input
                  id="firstname"
                  type="text"
                  name="firstname"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="label-container">
                <label htmlFor="lastname">Last name: </label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            <div className="label-container">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
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
            <div className="label-container">
              <label htmlFor="cpassword">Confirm password:</label>
              <div className="input-container">
                <input
                  id="cpassword"
                  type={cptype}
                  name="cpassword"
                  placeholder="Confirm your password"
                  required
                />
                <div className="eye" onClick={handleCpClick}>
                  {cpVisibility ? <Visibility /> : <VisibilityOff />}
                </div>
              </div>
            </div>
            <div className="label-container">
              <label htmlFor="image">Upload your photo(optional):</label>
              <div className="input-container">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  name="image"
                  className="input-image"
                />
              </div>
            </div>
            <button
              className={
                navigation.state === "submitting"
                  ? "loading-btn"
                  : "default-btn"
              }
            >
              {navigation.state === "submitting" ? "Signing up..." : "Sign up"}
            </button>
            <p>
              Already have an account?<Link to={"/"}>Sign in</Link>
            </p>
          </Form>
        </div>
      </div>
    </>
  );
}
