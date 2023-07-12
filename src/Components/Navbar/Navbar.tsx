import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import logo from "../../Assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="w-full flex justify-content-between bg-primary py-2 px-3 ">
      <div className="flex gap-4 justify-content-start align-items-center">
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
        <Link
          to={"/"}
          className="cursor-pointer text-xl text-hover-navbar text-white"
        >
          Home
        </Link>
        <Link
          to={"/rent"}
          className="cursor-pointer text-xl text-hover-navbar text-white"
        >
          Noleggio
        </Link>
        <Link
          to={"/platforms"}
          className="cursor-pointer text-xl text-hover-navbar text-white"
        >
          Piattaforme
        </Link>
      </div>
      <div className="flex gap-3">
        <Button label="Accedi" rounded size="small" />
        {/* <Button label="signup" severity="secondary" rounded size="small" /> */}
      </div>
    </div>
  );
};

export default Navbar;
