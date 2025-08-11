function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function register(formData) {
  await sleep(1000);
  const res = await fetch(
    "https://todo-app-uhrs.onrender.com/api/v1/auth/register",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg);
  }
  return data;
}

export async function login(creds) {
  await sleep(1000);
  const res = await fetch(
    "https://todo-app-uhrs.onrender.com/api/v1/auth/login",
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
  localStorage.setItem("token", data.token);
  return data.user;
}
