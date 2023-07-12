import { Link } from "react-router-dom";
import "./BottomBar.css";

const BottomBar = () => {
  return (
    <div className="flex justify-content-center w-full fixed bottom-0 mb-5">
      <div className="flex bg-primary gap-5 py-2 px-4 border-round-md">
        <Link to={"/"} className="cursor-pointer text-xl text-hover-bottom-bar">
          Home
        </Link>
        <Link
          to={"/rent"}
          className="cursor-pointer text-xl text-hover-bottom-bar"
        >
          Noleggio
        </Link>
        <Link
          to={"/platforms"}
          className="cursor-pointer text-xl text-hover-bottom-bar text-white"
        >
          Piattaforme
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
