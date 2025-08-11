export async function login(creds) {
  const res = await fetch(
    "https://todo-app-uhrs.onrender.com/api/v1/admin/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  localStorage.setItem("adminToken", data.token);
  return data.user;
}

export async function getUsers() {
  const adminToken = localStorage.getItem("adminToken");
  const res = await fetch("https://todo-app-uhrs.onrender.com/api/v1/admin", {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data;
}

export async function getUser(id) {
  const adminToken = localStorage.getItem("adminToken");
  const res = await fetch(
    `https://todo-app-uhrs.onrender.com/api/v1/admin/${id}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data;
}

export async function deleteUser(id) {
  const adminToken = localStorage.getItem("adminToken");
  const res = await fetch(
    `https://todo-app-uhrs.onrender.com/api/v1/admin/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data;
}
