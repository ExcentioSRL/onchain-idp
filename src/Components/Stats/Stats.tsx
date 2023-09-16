import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import "./Stats.css";
import { PrivateUserData } from "../../Interfaces/PlatformInterface";
import { FirstRow } from "./FirstRow";
import { PrivatePlatforms } from "./PrivatePlatforms";
import { instance as idpInstance } from "../../Service/idp.service";
import { instance as tokenInstance } from "../../Service/token.service";
import { RentCard } from "./RentCard";
import { addressTo } from "../../environment";
import { Button } from "primereact/button";

const Stats = () => {
  const eth = window.ethereum;
  const [value, setValue] = useState<string | undefined>(undefined);
  const toast = useRef<Toast>(null);
  const [userData, setUserData] = useState<PrivateUserData | undefined>(
    undefined
  );

  const contractIdp = idpInstance.getContract();
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

  const addUser2 = async () => {
    if (!contractIdp) {
      console.log("contract idpContract error");
      return;
    }
    try {
      const resp = await contractIdp.addUser(addressTo);
      console.log(resp);
    } catch (error: any) {
      console.log(error);
      // showError(toast, error.error.data.message.split("string")[1]);
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
        "64fcdab4dce9032efe803935",
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
        <FirstRow value={value} getTokens={getTokens} />

        <PrivatePlatforms userData={userData} />
        <RentCard userData={userData} />
        {/* <Button onClick={addPlatformToUser2}>addPlatformToUser2</Button> */}

        <Toast ref={toast}></Toast>
      </div>
    </>
  );
};

export default Stats;
