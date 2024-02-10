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
import { useSelector } from "react-redux";
import { userSelector } from "../../Slice/user.slice";
const Stats = () => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const toast = useRef<Toast>(null);
  const [userData, setUserData] = useState<PrivateUserData | undefined>(
    undefined
  );

  const user = useSelector(userSelector);

  const contractIdp = idpInstance.getContract();
  const contractToken = tokenInstance.getContract();

  const getTokens = useCallback(async () => {
    if (!contractToken) {
      console.log("contractToken");
      return;
    }

    try {
      const balance = await contractToken.balanceOf(user.userAddress);
      setValue(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  }, [user.userAddress, contractToken]);

  const getPrivateUserData = useCallback(async () => {
    if (!contractIdp) {
      console.log("idp contract");
      return;
    }

    try {
      const resp = await contractIdp.getPrivateUserDataById(user.userAddress);

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
  }, [user.userAddress, contractIdp]);

  useEffect(() => {
    if (value === undefined) getTokens();
    if (userData === undefined) getPrivateUserData();
  }, [value, getTokens, userData, getPrivateUserData]);

  return (
    <>
      <div className="p-3">
        <FirstRow value={value} getTokens={getTokens} />

        <PrivatePlatforms userData={userData} />
        <RentCard userData={userData} />
        <Toast ref={toast}></Toast>
      </div>
    </>
  );
};

export default Stats;
