import { ethers } from "ethers";
import {
  newTokenContract,
  newIdpContract,
  tokenHolder,
} from "../../environment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import "./Stats.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const Stats = () => {
  const eth = window.ethereum;
  const [value, setValue] = useState<string | undefined>(undefined);
  const [contractWithSigner, setContractWithSigner] = useState<
    ethers.Contract | undefined
  >(undefined);
  const [idpContractWsigner, setIdpContractWsigner] = useState<
    ethers.Contract | undefined
  >(undefined);
  const toast = useRef<Toast>(null);
  const [buyTokenDialog, setBuyTokenDialog] = useState<boolean>(false);
  const [sellTokenDialog, setSellTokenDialog] = useState<boolean>(false);
  const [amountToken, setAmountToken] = useState<string>("0");

  const setData = useCallback(() => {
    const prov = new ethers.providers.Web3Provider(eth);
    const signer = prov.getSigner();
    const response = newTokenContract(prov);

    const tokenContract = response.connect(signer);

    setContractWithSigner(tokenContract);

    const responseIdp = newIdpContract(prov);
    const idpContract = responseIdp.connect(signer);

    setIdpContractWsigner(idpContract);
  }, [eth]);

  const getTokens = useCallback(async () => {
    if (!idpContractWsigner) {
      setData();
      return;
    }

    try {
      const balance = await idpContractWsigner.balance(eth.selectedAddress);
      setValue(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
      // showError(toast, "Chiamata andata male");
    }
  }, [eth.selectedAddress, idpContractWsigner, setData]);

  async function buyTokens() {
    if (!idpContractWsigner) return;

    try {
      idpContractWsigner
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
    if (!idpContractWsigner || !contractWithSigner) return;

    let sellValue = ethers.utils.parseUnits(amountToken, 18);

    try {
      await contractWithSigner.approve(tokenHolder, sellValue);
      await idpContractWsigner.sell(sellValue);
      setValue(undefined);
      setSellTokenDialog(false);
    } catch (error) {}
  }

  useEffect(() => {
    if (value === undefined) getTokens();
  }, [value, getTokens]);

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
    <img
      alt="Prime video"
      src="/images/primevideo.png"
      style={{ width: "70%" }}
    />
  );

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
      <div className="flex w-full justify-content-around">
        <div className="grid p-3 w-10">
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
                  <span className="block text-500 font-medium mb-3">
                    Noleggi
                  </span>
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
        <div className="flex flex-column gap-3 justify-content-center">
          <Button
            label="Compra token"
            severity="success"
            rounded
            onClick={() => setBuyTokenDialog(true)}
          />
          <Button
            label="Vendi token"
            severity="danger"
            rounded
            onClick={() => setSellTokenDialog(true)}
          />
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
              <div className="flex justify-content-center align-items-center bg-green-500 px-1 w-4rem border-round-lg h-2rem text-white-alpha-90">
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
                onChange={(e) => setAmountToken(e.target.value)}
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
                onChange={(e) => setAmountToken(e.target.value)}
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
