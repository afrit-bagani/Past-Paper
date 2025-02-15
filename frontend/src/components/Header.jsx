import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { VscGithub } from "react-icons/vsc";
import { BASE_URL } from "../config";

function Header() {
  const [departments, setDepartments] = useState([]);
  const location = useLocation();

  useEffect(() => {
    (async function fetchDept() {
      try {
        const res = await fetch("/api/folders?parentId=null");
        const data = await res.json();
        setDepartments(data.folders);
      } catch (error) {
        console.error("Error while fetching department in header", error);
      }
    })();
  }, []);

  // fn to track which tab is active
  const isActive = (path) =>
    path === location.pathname.split("/")[1] ? "bg-info" : "";

  return (
    <nav className="navbar bg-primary navbar-expand-sm" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="logo" width={35} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/home"
                className={`nav-link text-white font-semibold px-3 py-2 rounded ${isActive(
                  "home"
                )}`}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/suggestion"
                className={`nav-link text-white font-semibold px-3 py-2 rounded ${isActive(
                  "suggestion"
                )}`}
                aria-current="Suggestion"
              >
                Suggestion
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Department
              </Link>
              <ul className="dropdown-menu">
                {departments.map((dept) => (
                  <li key={dept._id}>
                    <Link
                      to={`/home/folders/${dept._id}`}
                      className="dropdown-item"
                    >
                      {dept.folderName}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="" className="btn btn-primary me-2">
                <VscGithub size={30} />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={`${BASE_URL}/login`}
                className={`btn btn-dark ${isActive("login")}`}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
