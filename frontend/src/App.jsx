import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TrackSessionTime from "./components/TrackSessionTime";

import Main from "./layouts/Main";
import LandingPage from "./routes/LandingPage";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Home from "./routes/Home";
import Suggestion from "./routes/Suggestion";
import UserList from "./routes/UserList";
import Error404 from "./routes/Error404";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/home/folders/:folderId",
          element: <Home />,
        },
        { path: "/suggestion", element: <Suggestion /> },
        {
          path: "/users",
          element: <UserList />,
        },
      ],
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
      <TrackSessionTime />
    </div>
  );
}

export default App;
