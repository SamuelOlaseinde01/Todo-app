import { useEffect } from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function TaskError() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.log(error);

  useEffect(() => {
    toast.error(error.statusText || "An error occurred");
    navigate(-1);
  }, [error, navigate]);

  return null;
}
