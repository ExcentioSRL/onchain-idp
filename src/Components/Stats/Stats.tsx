import { ethers } from "ethers";
import { tokenHolder, addressTo } from "../../environment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import "./Stats.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { PrivateUserData } from "../../Interfaces/PlatformInterface";
import { FirstRow } from "./FirstRow";
import { PrivatePlatforms } from "./PrivatePlatforms";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../global.store";
import { contractSelector } from "../../Slice/contracts.slice";

const Stats = () => {
  const eth = window.ethereum;
  const [value, setValue] = useState<string | undefined>(undefined);
  const toast = useRef<Toast>(null);
  const [buyTokenDialog, setBuyTokenDialog] = useState<boolean>(false);
  const [sellTokenDialog, setSellTokenDialog] = useState<boolean>(false);
  const [amountToken, setAmountToken] = useState<string>("0");
  const [userData, setUserData] = useState<PrivateUserData | undefined>(
    undefined
  );
  const dispatch = useDispatch<AppDispatch>();
  const contract = useSelector(contractSelector);

  const getTokens = useCallback(async () => {
    if (!contract.idpContract) {
      console.log("idp contract");
      return;
    }

    try {
      const balance = await contract.idpContract.balance(eth.selectedAddress);
      setValue(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
      // showError(toast, "Chiamata andata male");
    }
  }, [contract.idpContract, eth.selectedAddress]);

  async function buyTokens() {
    if (!contract.idpContract) {
      console.log("idp contract");
      return;
    }

    try {
      contract.idpContract
        .buy({
          value: ethers.utils.parseUnits(amountToken, 18),
        })
        .then(() => {
          setValue(undefined);
          setBuyTokenDialog(false);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function sellTokens() {
    if (!contract.idpContract || !contract.tokenContract) return;

    let sellValue = ethers.utils.parseUnits(amountToken, 18);

    try {
      await contract.tokenContract.approve(tokenHolder, sellValue);
      await contract.idpContract.sell(sellValue);
      setValue(undefined);
      setSellTokenDialog(false);
    } catch (error) {}
  }

  const getPrivateUserData = useCallback(async () => {
    if (!contract.idpContract) {
      console.log("idp contract");
      return;
    }

    try {
      const resp = await contract.idpContract.getPrivateUserDataById(
        eth.selectedAddress
      );

      const data: PrivateUserData = resp.map((r: PrivateUserData) => ({
        userAddr: r.userAddr,
        platforms: r.platforms.map((p) => ({
          cost: ethers.utils.formatEther(p.cost),
          isValid: p.isValid,
          uuid: p.uuid,
        })),
        rentals: r.rentals,
      }))[0];

      setUserData(data);
    } catch (error: any) {
      console.log(error);
    }
  }, [contract.idpContract, eth.selectedAddress]);

  useEffect(() => {
    if (value === undefined) getTokens();
    if (userData === undefined) getPrivateUserData();
  }, [value, getTokens, userData, getPrivateUserData]);

  const addUser = async () => {
    if (!contract.idpContract) {
      console.log("contract idpContract error");
      return;
    }

    try {
      const resp = await contract.idpContract.addUser(eth.selectedAddress);
      console.log(resp);
    } catch (error: any) {
      console.log(error);
      // showError(toast, error.error.data.message.split("string")[1]);
    }
  };

  const addUser2 = async () => {
    if (!contract.idpContract) {
      console.log("contract idpContract error");
      return;
    }
    try {
      const resp = await contract.idpContract.addUser(addressTo);
      console.log(resp);
    } catch (error: any) {
      console.log(error);
      // showError(toast, error.error.data.message.split("string")[1]);
    }
  };

  const addPlatform = async () => {
    if (!contract.idpContract) {
      console.log("contract idpContract error");
      return;
    }

    try {
      const resp = await contract.idpContract.addPlatformToUser(
        eth.selectedAddress,
        "64fcdab4dce9032efe803935",
        ethers.utils.parseUnits("0.000000000000000001")
      );
      console.log(resp);
    } catch (error: any) {
      console.log(error);
    }
  };

  const headerRentals = (
    <div className="flex align-items-center">
      <img
        alt="Prime video"
        src="/images/primevideo.png"
        style={{ width: "30%" }}
      />
      <span className="font-semibold text-black-alpha-90">200 EXC</span>
    </div>
  );

  return (
    <div className="p-3">
      <FirstRow
        value={value}
        setBuyTokenDialog={setBuyTokenDialog}
        setSellTokenDialog={setSellTokenDialog}
      />

      <PrivatePlatforms userData={userData} />

      <div className="platforms px-5 flex flex-column gap-5">
        <span className="title">I tuoi noleggi</span>
        <div className="flex">
          <Card header={headerRentals} className="md:w-20rem shadow-2">
            <div className="flex gap-5">
              <div className="flex flex-column">
                <span className="text-black-alpha-90">
                  Dal: 20/07/2023 16:00
                </span>
                <span className="text-black-alpha-90">
                  al: 20/07/2023 18:00
                </span>
              </div>
              <div className="flex justify-content-center align-items-center bg-green-500 px-1 w-4rem border-round-lg h-2rem text-white-alpha-90">
                Attivo
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={addUser}>addUser</Button>
        <Button onClick={addUser2}>addUser2</Button>
        <Button onClick={addPlatform}>addPlatform</Button>
        {/* <Button onClick={addPlatformToUser2}>addPlatformToUser2</Button> */}
        <Button onClick={getPrivateUserData}>getPrivateUserData</Button>
      </div>
      <Toast ref={toast}></Toast>

      {buyTokenDialog ? (
        <Dialog
          header="Quanti token vuoi comprare?"
          visible={buyTokenDialog}
          style={{ width: "50vw" }}
          onHide={() => setBuyTokenDialog(false)}
        >
          <div className="py-5">
            <span className="p-float-label">
              <InputText
                id="tokens"
                className="w-full"
                value={amountToken}
                onChange={(e) =>
                  setAmountToken((amount) => (amount = e.target.value))
                }
              />
              <label htmlFor="tokens">Token to buy</label>
            </span>
          </div>
          <Button
            label="Compra"
            severity="success"
            rounded
            onClick={buyTokens}
          />
        </Dialog>
      ) : (
        <></>
      )}

      {sellTokenDialog ? (
        <Dialog
          header="Quanti token vuoi vendere?"
          visible={sellTokenDialog}
          style={{ width: "50vw" }}
          onHide={() => setSellTokenDialog(false)}
        >
          <div className="py-5">
            <span className="p-float-label">
              <InputText
                id="tokens"
                className="w-full"
                value={amountToken}
                onChange={(e) =>
                  setAmountToken((amount) => (amount = e.target.value))
                }
              />
              <label htmlFor="tokens">Token to sell</label>
            </span>
          </div>
          <Button
            label="Vendi"
            severity="danger"
            rounded
            onClick={sellTokens}
          />
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Stats;
