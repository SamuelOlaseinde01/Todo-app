import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import UserLogin, {
  action as userLoginAction,
  loader as userLoginLoader,
} from "./form-components/UserLogin";
import UserRegister, {
  action as userRegisterAction,
} from "./form-components/UserRegister";
import Tasks, {
  action as tasksAction,
  loader as tasksLoader,
} from "./user/Tasks";
import Task, { loader as taskLoader, action as taskAction } from "./user/Task";
import AdminLogin, {
  action as adminLoginAction,
  loader as adminLoginLoader,
} from "./admin/AdminLogin";
import AdminLayout, { loader as adminLayoutLoader } from "./admin/AdminLayout";
import UserLayout, { loader as userLayoutLoader } from "./user/UserLayout";
import Users, {
  loader as usersLoader,
  action as usersAction,
} from "./admin/Users";
import User, { loader as userLoader, action as userAction } from "./admin/User";
import "./style.css";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route
          element={<UserLogin />}
          path="/"
          action={userLoginAction}
          loader={userLoginLoader}
        />
        <Route
          element={<UserRegister />}
          path="/register"
          action={userRegisterAction}
        />
        <Route
          element={<AdminLogin />}
          path="/adminlogin"
          action={adminLoginAction}
          loader={adminLoginLoader}
        />
        <Route element={<UserLayout />} path="/user" loader={userLayoutLoader}>
          <Route
            element={<Tasks />}
            index
            loader={tasksLoader}
            action={tasksAction}
          />
          <Route
            element={<Task />}
            path=":id"
            loader={taskLoader}
            action={taskAction}
          />
        </Route>
        <Route
          element={<AdminLayout />}
          path="/admin"
          loader={adminLayoutLoader}
        >
          <Route
            element={<Users />}
            loader={usersLoader}
            action={usersAction}
            index
          />
          <Route
            element={<User />}
            path=":id"
            loader={userLoader}
            action={userAction}
          />
        </Route>
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        limit={1}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
