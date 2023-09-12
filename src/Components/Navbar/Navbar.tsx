import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { EthereumInterface } from "../../Interfaces/EthInterfaces";
import "./Navbar.css";
import ToastComponent from "../ToastComponent/ToastComponent";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { setContract } from "../../Slice/contracts.slice";
import { AppDispatch } from "../../global.store";
import { setData } from "../../Service/contract.service";

async function getPublicAddress(
  toast: RefObject<Toast>,
  ethereum: EthereumInterface
) {
  if (ethereum.isMetaMask) {
    if (ethereum.selectedAddress != null) {
      return ethereum.selectedAddress;
    } else {
      try {
        const response = (await ethereum.request({
          method: "eth_requestAccounts",
        })) as string[];
        return response[0];
      } catch (error) {
        // showError(toast, "Il wallet non è stato collegato");
      }
    }
  }
}

const Navbar = () => {
  const ethereum = window.ethereum;
  const [publicAddress, setPublicAddress] = useState<string | undefined>();
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch<AppDispatch>();

  const login = useCallback(() => {
    const response = getPublicAddress(toast, ethereum);

    if (typeof response === "string") {
      // showSuccess(toast, "Il wallet è stato collegato");
      setPublicAddress(response);
      const data = setData();
      dispatch(setContract(data));
    } else if (response) {
      response.then((res) => {
        if (typeof res === "string") {
          // showSuccess(toast, "Il wallet è stato collegato");
          setPublicAddress(res);
          const data = setData();
          dispatch(setContract(data));
        } else {
          // showError(toast, "Il wallet non è stato collegato");
          setPublicAddress(undefined);
        }
      });
    } else {
      // showError(toast, "Il wallet non è stato collegato");
      setPublicAddress(undefined);
    }
  }, [dispatch, ethereum]);

  useEffect(() => {
    if (publicAddress === undefined) login();
  }, [login, publicAddress]);

  return (
    <div className="w-full flex justify-content-between bg-primary py-2 px-3 ">
      <div className="flex gap-4 justify-content-start align-items-center">
        <img src="images/logo.png" alt="Logo" style={{ height: "40px" }} />
        <Link
          to={"/"}
          className="cursor-pointer text-xl text-hover-navbar text-white"
        >
          Home
        </Link>
        {publicAddress ? (
          <Link
            to={"/rent"}
            className="cursor-pointer text-xl text-hover-navbar text-white"
          >
            Noleggio
          </Link>
        ) : (
          <></>
        )}
        <Link
          to={"/platforms"}
          className="cursor-pointer text-xl text-hover-navbar text-white"
        >
          Piattaforme
        </Link>
      </div>
      <div className="flex gap-3 align-items-center">
        {publicAddress === undefined ? (
          <Button label="Accedi" rounded size="small" onClick={login} />
        ) : (
          <Link
            to={"/personal-area"}
            className="cursor-pointer text-xl text-hover-navbar text-white"
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
