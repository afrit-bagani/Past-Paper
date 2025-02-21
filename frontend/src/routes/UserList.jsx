import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import NotificationToast from "../components/NotificationToast";
import { BACKEND_URL } from "../config";

function UserList() {
  const [users, setUsers] = useState([]);
  const [toastData, setToastData] = useState(null);

  // toast message
  const showToast = (message, variant) => {
    setToastData({ message, variant });
  };

  // fetch all users
  useEffect(() => {
    (async function getAllUsers() {
      const res = await fetch(`${BACKEND_URL}/users`, {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data.users);
    })();
  }, []);

  // promte user to moderartor
  const promoteUser = async (userId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/users/approve/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Request to promote user failed");
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: "Moderator" } : user
        )
      );
      showToast(data.message, "success");
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch error: \n", error);
    }
  };

  // demote moderator to user
  const demoteUser = async (userId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/users/disapprove/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Request to deomote user failed");
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: "User" } : user
        )
      );
      showToast(data.message, "success");
    } catch (error) {
      showToast(error.message, "danger");
      console.error("Fetch error: \n", error);
    }
  };

  if (!users || users.length === 0) {
    return <p className="h3 text-center mt-3">No user to show</p>;
  }

  return (
    <div className="container mt-5">
      {toastData && (
        <NotificationToast
          message={toastData.message}
          variant={toastData.variant}
          onClose={() => setToastData(null)}
        />
      )}
      <h1 className="text-center text-primary fw-bold mb-4">Users</h1>
      {/* Table Container */}
      <div className="table-responsive">
        <table className="table table-hover shadow-sm rounded overflow-hidden">
          <thead className="table-primary">
            <tr className="text-center">
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Registerd On</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center align-middle">
                <td className="fw-semibold">{user.name}</td>
                <td className="fw-semibold">{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString("en-GB")}</td>
                <td>
                  <span
                    className={`badge ${
                      user.role == "Moderator" ? "bg-info" : "bg-secondary"
                    } px-3 py-2`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => demoteUser(user._id)}
                      disabled={user.role == "User"}
                    >
                      <ImCross />
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => promoteUser(user._id)}
                      disabled={user.role == "Moderator"}
                    >
                      <FaCheck color="green" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
