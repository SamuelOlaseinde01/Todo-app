import React from "react";
import {
  Form,
  useLoaderData,
  Link,
  redirect,
  useNavigation,
} from "react-router-dom";
import { getTask, updateTask } from "./task-api";
import { toast } from "react-toastify";
import { ArrowBack } from "@mui/icons-material";
import { authUser } from "./authUser";

export async function loader({ params }) {
  await authUser();
  const id = params.id;
  const task = await getTask(id);
  return task;
}

export async function action({ request }) {
  const formData = await request.formData();
  const id = formData.get("taskid");
  const name = formData.get("taskname");
  let completed = formData.get("completed");
  if (completed === "true") {
    completed = true;
  }
  if (completed === null) {
    completed = false;
  }
  const task = {
    id,
    name,
    completed,
  };
  try {
    const name = await updateTask(task);
    console.log(name);
    return redirect(`/user?msg=${name}`);
  } catch (error) {
    toast.error(error.message);
    return null;
  }
}

export default function Task() {
  const obj = useLoaderData();
  const navigation = useNavigation();
  const task = obj.task;
  const [isEditing, setIsEditing] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [value, setValue] = React.useState(task.name);

  function handleInputClick() {
    setIsEditing(true);
  }

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleBlur() {
    setIsEditing(false);
  }

  return (
    <div className="edit-task">
      <h2>Edit Task</h2>
      <Form className="edit-task-form" method="post">
        <input type="hidden" value={task._id} name="taskid" />
        <div className="task-label-container">
          <label htmlFor="taskname">Task name:</label>
          {isEditing ? (
            <input
              type="text"
              id="taskname"
              value={value}
              name="taskname"
              onChange={handleChange}
              onBlur={handleBlur}
              className="edit-task-name"
              autoFocus
              required
            />
          ) : (
            <input
              type="text"
              value={value}
              id="taskname"
              name="taskname"
              onClick={handleInputClick}
              className="edit-task-name"
              required
              readOnly
            />
          )}
        </div>
        <div className="task-label-container">
          <label htmlFor="completed">Completed:</label>
          <input
            type="checkbox"
            name="completed"
            id="completed"
            value={checked}
            checked={checked}
            onChange={() => {
              setChecked((prev) => !prev);
            }}
          />
        </div>
        <button
          className={
            navigation.state === "submitting" ? "editing-btn" : "edit-btn"
          }
        >
          {navigation.state === "submitting" ? "Editing task..." : "Edit task"}
        </button>
      </Form>
      <Link to={`/user?msg=${obj.name}`} className="back-to-tasks">
        <ArrowBack /> Back to Tasks
      </Link>
    </div>
  );
}
