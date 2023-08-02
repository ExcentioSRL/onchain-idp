import { ethers } from "ethers";
import {
  newTokenContract,
  newIdpContract,
  addressTo,
  tokenHolder,
} from "../../environment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { showError } from "../ToastComponent/ToastFunctions";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "./Stats.css";
import PrimeVideo from "../../Assets/primevideo.png";

const Stats = () => {
  const eth = window.ethereum;
  const [provider, setProvider] = useState<any | undefined>(undefined);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [contractWithSigner, setContractWithSigner] = useState<
    ethers.Contract | undefined
  >(undefined);
  const [idpContractWsigner, setIdpContractWsigner] = useState<
    ethers.Contract | undefined
  >(undefined);

  const toast = useRef<Toast>(null);

  const getTokens = useCallback(async () => {
    const prov = new ethers.providers.Web3Provider(eth);
    setProvider(prov);
    const signer = prov.getSigner();
    const response = newTokenContract(prov);

    const tokenContract = response.connect(signer);
    setContractWithSigner(tokenContract);

    const responseIdp = newIdpContract(prov);
    const idpContract = responseIdp.connect(signer);
    console.log(idpContract);
    setIdpContractWsigner((idpC) => (idpC = idpContract));

    try {
      const resp = await tokenContract.balanceOf(tokenHolder);
      setValue(ethers.utils.formatEther(resp));
    } catch (error) {
      console.log(error);
      // showError(toast, "Chiamata andata male");
    }
  }, [eth]);

  useEffect(() => {
    if (value === undefined) getTokens();
  }, [value]);

  // const addUser = async () => {
  //   if (!idpContractWsigner) return showError(toast, "idpContract non salvato");

  //   try {
  //     const resp = await idpContractWsigner.addUser(tokenHolder);
  //     console.log(resp);
  //   } catch (error: any) {
  //     console.log(error);
  //     showError(toast, error.error.data.message.split("string")[1]);
  //   }
  // };

  // const addUser2 = async () => {
  //   if (!idpContractWsigner) return showError(toast, "idpContract non salvato");
  //   try {
  //     const resp = await idpContractWsigner.addUser(addressTo);
  //     console.log(resp);
  //   } catch (error: any) {
  //     console.log(error);
  //     showError(toast, error.error.data.message.split("string")[1]);
  //   }
  // };

  // const getUserData = async () => {
  //   console.log(idpContractWsigner);
  //   if (!idpContractWsigner) return showError(toast, "idpContract non salvato");
  //   try {
  //     const resp = await idpContractWsigner.getUserData();
  //     console.log(resp);
  //   } catch (error: any) {
  //     console.log(error);
  //   }
  // };

  // const addPlatform = async () => {
  //   console.log(idpContractWsigner);
  //   if (!idpContractWsigner) return showError(toast, "idpContract non salvato");
  //   try {
  //     const resp = await idpContractWsigner.addPlatformToUser(
  //       tokenHolder,
  //       "1",
  //       "1"
  //     );
  //     console.log(resp);
  //   } catch (error: any) {
  //     console.log(error);
  //     showError(toast, error.error.data.message.split("string")[1]);
  //   }
  // };

  // const addPlatformToUser2 = async () => {
  //   if (!idpContractWsigner) return;
  //   console.log(idpContractWsigner);
  //   try {
  //     const resp = await idpContractWsigner.addPlatformToUser(
  //       addressTo,
  //       "1",
  //       "1"
  //     );
  //     console.log(resp);
  //   } catch (error: any) {
  //     console.log(error);
  //     showError(toast, error.error.data.message.split("string")[1]);
  //   }
  // };

  // const transferToken = async () => {
  //   if (contractWithSigner === undefined) return;

  //   try {
  //     const response = await contractWithSigner.transfer(addressTo, 20);
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // if (!eth.selectedAddress) return <>Non sei autorizzato</>;

  const headerPlatforms = (
    <img alt="Prime video" src={PrimeVideo} style={{ width: "70%" }} />
  );

  const headerRentals = (
    <div className="flex align-items-center">
      <img alt="Prime video" src={PrimeVideo} style={{ width: "30%" }} />
      <span className="font-semibold text-black-alpha-90">200 EXC</span>
    </div>
  );

  return (
    <div className="p-3">
      <div className="grid p-5">
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round min-height-card">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Conto</span>
                <div className="text-900 font-medium text-xl">
                  {value ? value : 0} EXC
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-green-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-wallet text-green-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round min-height-card">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">Noleggi</span>
                <div className="text-900 font-medium text-xl">100</div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-key text-blue-500 text-xl"></i>
              </div>
            </div>
            <span className="text-500 font-medium">di cui attivi: 1</span>
          </div>
        </div>
      </div>
      <div className="platforms px-5 flex flex-column gap-5 mb-5">
        <span className="title">Le tue piattaforme</span>
        <div className="flex">
          <Card header={headerPlatforms} className="md:w-12rem shadow-2">
            <div className="flex justify-content-center">Prime Video</div>
          </Card>
        </div>
      </div>
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
              <div className="bg-green-500 px-1 w-4rem border-round-lg h-2rem text-white-alpha-90">
                Attivo
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* <div className="flex gap-3">
        <Button onClick={transferToken}>trasferisci</Button>
        <Button onClick={addUser}>addUser</Button>
        <Button onClick={addUser2}>addUser2</Button>
        <Button onClick={addPlatform}>addPlatform</Button>
        <Button onClick={addPlatformToUser2}>addPlatformToUser2</Button>
        <Button onClick={getUserData}>getUserData</Button>
      </div> */}

      <Toast ref={toast}></Toast>
    </div>
  );
};

export default Stats;
