import { RefObject, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { EthereumInterface } from "../../Interfaces/EthInterfaces";
import ToastComponent from "../ToastComponent/ToastComponent";
import { Toast } from "primereact/toast";
import { instance } from "../../Service/idp.service";
import "./Navbar.css";

async function getPublicAddress(
  toast: RefObject<Toast>,
  ethereum: EthereumInterface
) {
  if (!ethereum.isMetaMask) console.log("installa metamask");
  try {
    const response = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    return response[0];
  } catch (error) {
    // showError(toast, "Il wallet non è stato collegato");
  }
}

const Navbar = () => {
  const ethereum = window.ethereum;

  const toast = useRef<Toast>(null);
  const idpInstance = instance.getContract();

  async function register() {
    if (!idpInstance) return;

    try {
      const address = await getPublicAddress(toast, ethereum);

      await idpInstance.addUser(address);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="w-full flex justify-content-between py-2 px-3 "
      style={{ boxShadow: "0 1px 20px rgb(109 109 109)" }}
    >
      <div className="flex gap-4 justify-content-start align-items-center">
        <img src="images/logo.png" alt="Logo" style={{ height: "40px" }} />
        <Link
          to={"/"}
          className="cursor-pointer text-xl text-hover-navbar text-black-alpha-90	"
        >
          Home
        </Link>
        {ethereum.selectedAddress ? (
          <Link
            to={"/rent"}
            className="cursor-pointer text-xl text-hover-navbar text-black-alpha-90	"
          >
            Noleggio
          </Link>
        ) : (
          <></>
        )}
        <Link
          to={"/platforms"}
          className="cursor-pointer text-xl text-hover-navbar text-black-alpha-90	"
        >
          Piattaforme
        </Link>
      </div>
      <div className="flex gap-3 align-items-center">
        {ethereum.selectedAddress == null ? (
          <>
            <Button
              label="Registrati"
              rounded
              size="small"
              onClick={register}
            />
          </>
        ) : (
          <Link
            to={"/personal-area"}
            className="cursor-pointer text-xl text-hover-navbar text-black-alpha-90	"
          >
            Area personale
          </Link>
        )}
      </div>
      <ToastComponent toast={toast} />
    </div>
  );
};

export default Navbar;
