import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Main() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Main;
