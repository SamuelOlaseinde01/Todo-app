function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function createTask(name) {
  await sleep(2000);
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/api/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(name),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data;
}

export async function getAllTasks() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/api/v1/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data;
}

export async function getTask(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data;
}

export async function updateTask(task) {
  await sleep(2000);
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:3000/api/v1/tasks/${task.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data.name;
}

export async function deleteTask(id) {
  await sleep(2000);
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data.tasks;
}
