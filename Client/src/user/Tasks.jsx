import React from "react";
import { Form, useLoaderData, Link, useNavigation } from "react-router-dom";
import { createTask, deleteTask, getAllTasks } from "./task-api";
import { toast } from "react-toastify";
import {
  Delete,
  EditNote,
  CheckBoxRounded,
  RadioButtonCheckedRounded,
} from "@mui/icons-material";
import { authUser } from "./authUser";

export async function loader() {
  await authUser();
  const tasks = await getAllTasks();
  return tasks;
}

export async function action({ request }) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "create") {
    const name = formData.get("taskname");
    try {
      await createTask({ name });
    } catch (error) {
      toast.error(error.message);
    }
    return null;
  }

  if (_action === "delete") {
    const id = formData.get("id");
    try {
      await deleteTask(id);
    } catch (error) {
      toast.error(error.message);
    }
    return null;
  }

  return null;
}

export default function Tasks() {
  const tasks = useLoaderData();
  const navigation = useNavigation();
  const [randTask, setRandTask] = React.useState();
  const [deletingTaskIds, setDeletingTaskIds] = React.useState([]);

  React.useEffect(() => {
    if (
      navigation.state === "submitting" &&
      navigation.formData.get("_action") === "delete"
    ) {
      const taskId = navigation.formData.get("id");

      setDeletingTaskIds((prev) => [...new Set([...prev, taskId])]);

      const timer = setTimeout(() => {
        setDeletingTaskIds((prev) => prev.filter((id) => id !== taskId));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [navigation]);

  const isCreating =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "create";

  const tasksPlaceholder = [
    "wake up at 6:30 AM",
    "workout for 30 minutes",
    "finish frontend bug fix",
    "clean the kitchen",
    "buy groceries",
    "respond to team emails",
    "watch a TED Talk",
    "book dentist appointment",
    "take out the trash",
    "water the plants",
    "submit school project",
    "vacuum the living room",
    "write a journal entry",
    "call the electrician",
    "review pull request",
    "update resume",
    "prepare breakfast",
    "study for math test",
  ];

  React.useEffect(() => {
    const randnum = Math.floor(Math.random() * tasksPlaceholder.length);
    setRandTask(tasksPlaceholder[randnum]);
  }, []);

  const mappedTasks = tasks.tasks.map((task) => {
    const isDeleting = deletingTaskIds.includes(task._id);
    return (
      <div
        className={task.completed ? "task-completed" : "task"}
        key={task._id}
      >
        <div
          className={
            task.completed
              ? "task-opacity-container"
              : "task-uncompleted-opacity"
          }
        >
          <div className={task.completed ? "task-name-completed" : "task-name"}>
            {task.completed && <RadioButtonCheckedRounded />}
            <p>{task.name}</p>
          </div>
          <div className="edit-del">
            <Link
              to={`/user/${task._id}?msg=${tasks.name}`}
              style={{ color: "black" }}
            >
              <EditNote />
            </Link>
            <Form method="post" style={{ cursor: "pointer" }}>
              <input type="hidden" name="_action" value="delete" />
              <input type="hidden" name="id" value={task._id} />
              <button type="submit" disabled={isDeleting}>
                <Delete />
              </button>
            </Form>
          </div>
        </div>
        {isDeleting && (
          <div className={"delete-loading"}>
            <p>Deleting...</p>
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="task-container">
        <div className="task-page">
          <h2>Task Manager</h2>
          <Form method="post">
            <input type="hidden" name="_action" value="create" />
            <input
              type="text"
              name="taskname"
              placeholder={`e.g. ${randTask}`}
              required
            />
            <button className={isCreating ? "creating-btn" : "create-btn"}>
              {isCreating ? "Creating..." : "Create"}
            </button>
          </Form>
        </div>
        <div className="tasks">{mappedTasks}</div>
      </div>
    </>
  );
}
