import React from "react";
import { deleteUser, getUsers } from "./admin-api";
import { useLoaderData, Form, Link, useNavigation } from "react-router-dom";
import { Delete, Visibility } from "@mui/icons-material";
import { toast } from "react-toastify";
import { authAdmin } from "./authAdmin";

export async function loader() {
  await authAdmin();
  const users = await getUsers();
  return users;
}

export async function action({ request }) {
  const formData = await request.formData();
  const id = formData.get("id");
  try {
    await deleteUser(id);
    toast.success("Successfully deleted!");
    return null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
}

export default function Users() {
  const usersObj = useLoaderData();
  const users = usersObj.users;
  const [activeUserId, setActiveUserId] = React.useState(null);
  const [activeId, setActiveId] = React.useState(null);
  const dropdownRef = React.useRef(null);
  const hamburgerRef = React.useRef(null);

  const usersLength = usersObj.usersLength;

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        hamburgerRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setActiveUserId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleClick(userId) {
    setActiveUserId((prev) => (prev === userId ? null : userId));
  }

  function deleting(id) {
    setActiveId(id);
  }

  const mappedUsers = users.map((user) => {
    const isOpen = activeUserId === user._id;
    const isDeleting = activeId === user._id;
    const name = `${user.firstname} ${user.lastname}`;

    return (
      <div className="admin-user-box-container" key={user._id}>
        <img
          src={user.profileImage || "/images/profile-user.png"}
          className="admin-user-pic"
          alt="user-image"
        />
        <h3>{name}</h3>
        <a href={`mailto:${user.email}`}>{user.email}</a>
        <div className=""></div>
        <div
          className="hamburger"
          ref={isOpen ? hamburgerRef : null}
          onClick={() => handleClick(user._id)}
        >
          <span className="span1"></span>
          <span className="span2"></span>
          <span className="span3"></span>
        </div>
        {isDeleting && (
          <div className={"user-delete"}>
            <p>Deleting...</p>
          </div>
        )}
        {isOpen && !isDeleting && (
          <div className="user-delete-view" ref={dropdownRef}>
            <Link to={`/admin/${user._id}?msg=${usersObj.adminName}`}>
              <Visibility />
              <p>View</p>
            </Link>
            <Form method="post" onSubmit={() => deleting(user._id)}>
              <input type="hidden" name="id" value={user._id} />
              <button>
                <Delete />
                <p>Delete</p>
              </button>
            </Form>
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="admin-users">
        {usersLength > 0 && <h3>Users: {usersObj.usersLength}</h3>}
        {usersLength > 0 ? (
          <div className="users">{mappedUsers}</div>
        ) : (
          <h3>There are no users!</h3>
        )}
      </div>
    </>
  );
}
