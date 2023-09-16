import { ethers } from "ethers";
import { tokenHolder, addressTo } from "../../environment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import "./Stats.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { PrivateUserData } from "../../Interfaces/PlatformInterface";
import { FirstRow } from "./FirstRow";
import { PrivatePlatforms } from "./PrivatePlatforms";
import { instance as idpInstance } from "../../Service/idp.service";
import { instance as tokenInstance } from "../../Service/token.service";
import { RentCard } from "./RentCard";

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
  const [loading, setLoading] = useState<boolean>(false);

  const contractIdp = idpInstance.getContract();
  const providerIdp = idpInstance.getProvider();
  const contractToken = tokenInstance.getContract();

  const getTokens = useCallback(async () => {
    if (!contractToken) {
      console.log("contractToken");
      return;
    }

    try {
      const balance = await contractToken.balanceOf(eth.selectedAddress);
      setValue(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
      // showError(toast, "Chiamata andata male");
    }
  }, [eth.selectedAddress, contractToken]);

  async function buyTokens() {
    if (!contractIdp || !providerIdp) {
      console.log("idp contract");
      return;
    }

    try {
      await contractIdp.buy({
        value: ethers.utils.parseUnits(amountToken, 18),
      });
      setAmountToken("0");
      setBuyTokenDialog(false);
      setLoading(true);
      providerIdp.on("block", async (transaction) => {
        await getTokens();
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function sellTokens() {
    if (!contractIdp || !contractToken || !providerIdp) return;

    let sellValue = ethers.utils.parseUnits(amountToken, 18);

    try {
      await contractToken.approve(tokenHolder, sellValue);
      await contractIdp.sell(sellValue);
      setSellTokenDialog(false);
      setAmountToken("0");
      setLoading(true);
      providerIdp.on("block", async (transaction) => {
        await getTokens();
        setLoading(false);
      });
    } catch (error) {}
  }

  const getPrivateUserData = useCallback(async () => {
    if (!contractIdp) {
      console.log("idp contract");
      return;
    }

    try {
      const resp = await contractIdp.getPrivateUserDataById(
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

      setUserData((ud) => (ud = data));
    } catch (error: any) {
      console.log(error);
    }
  }, [eth.selectedAddress, contractIdp]);

  useEffect(() => {
    if (value === undefined) getTokens();
    if (userData === undefined) getPrivateUserData();
  }, [value, getTokens, userData, getPrivateUserData]);

  const addPlatform = async () => {
    if (!contractIdp) {
      console.log("contract idpContract error");
      return;
    }

    try {
      const resp = await contractIdp.addPlatformToUser(
        eth.selectedAddress,
        "64e9b4d93fbdd0167a72cacc",
        ethers.utils.parseUnits("0.000000000000000001")
      );
      console.log(resp);
    } catch (error: any) {
      console.log(error);
    }
  };

  const addPlatformToUser2 = async () => {
    if (!contractIdp) {
      console.log("contract idpContract error");
      return;
    }

    try {
      const resp = await contractIdp.addPlatformToUser(
        addressTo,
        "64e9b4d93fbdd0167a72cacc",
        ethers.utils.parseUnits("0.000000000000000001")
      );
      console.log(resp);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-3">
        <FirstRow
          value={value}
          setBuyTokenDialog={setBuyTokenDialog}
          setSellTokenDialog={setSellTokenDialog}
          loading={loading}
        />

        <PrivatePlatforms userData={userData} />
        <RentCard userData={userData} />
        <div className="flex gap-3 mt-3">
          <Button onClick={addPlatform}>addPlatform</Button>
          <Button onClick={addPlatformToUser2}>addPlatformToUser2</Button>
          {/* <Button onClick={getPrivateUserData}>getPrivateUserData</Button> */}
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
                    setAmountToken((am) => (am = e.target.value))
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
    </>
  );
};

export default Stats;
