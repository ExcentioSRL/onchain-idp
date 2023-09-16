import { ethers } from "ethers";
import { Button } from "primereact/button";
import { useState } from "react";
import { tokenHolder } from "../../environment";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { instance as idpInstance } from "../../Service/idp.service";
import { instance as tokenInstance } from "../../Service/token.service";
import { CardToken } from "./Card/CardToken";
import { CardRentValue } from "./Card/CardRentValue";
interface FirstRowProps {
  value: string | undefined;
  getTokens: () => Promise<void>;
}

export const FirstRow = ({ value, getTokens }: FirstRowProps) => {
  const [buyTokenDialog, setBuyTokenDialog] = useState<boolean>(false);
  const [sellTokenDialog, setSellTokenDialog] = useState<boolean>(false);
  const [amountToken, setAmountToken] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);

  const contractIdp = idpInstance.getContract();
  const providerIdp = idpInstance.getProvider();
  const contractToken = tokenInstance.getContract();

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
  return (
    <div className="flex w-full justify-content-around">
      <div className="grid p-3 w-10">
        <CardToken loading={loading} value={value} />
        <CardRentValue />
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
                onChange={(e) => setAmountToken((am) => (am = e.target.value))}
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
