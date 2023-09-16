import { useCallback, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { PlatformRentInterface, UserRentInterface } from "../Rent";
import { ethers } from "ethers";
import { instance as tokenInstance } from "../../../Service/token.service";
import { instance as idpInstance } from "../../../Service/idp.service";
import { tokenHolder } from "../../../environment";

export interface LabelValue<T = any> {
  label: string;
  value: T;
}

const RentDialog = ({
  data,
  onClose,
}: {
  data: UserRentInterface;
  onClose: any;
}) => {
  const [platforms, setPlatforms] = useState<any | undefined>(undefined);
  const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>(
    undefined
  );
  const [fromDate, setFromDate] = useState<any>(new Date());
  const [toDate, setToDate] = useState<any>();
  const [totalCost, setTotalCost] = useState<number | undefined>(undefined);
  const tokenContract = tokenInstance.getContract();
  const idpContract = idpInstance.getContract();

  const getAllPlatformsName = useCallback(() => {
    setPlatforms(
      data.platforms.map((platform: PlatformRentInterface) => ({
        label: platform.name,
        value: platform.id,
      }))
    );
  }, [data.platforms]);

  useEffect(() => {
    getAllPlatformsName();
  }, [getAllPlatformsName]);

  function convertInHour(milliseconds: number) {
    //divido i millisecondi per mille e poi per 60 così da avere i minuti
    return (milliseconds / (1000 * 60)).toFixed(0);
  }

  const calculateCost = () => {
    if (!selectedPlatform) return;

    let p = data.platforms.find((platform) => platform.id === selectedPlatform);

    if (!p) return;

    let timeConverted = convertInHour(
      new Date(toDate).getTime() - new Date(fromDate).getTime()
    );

    //TODO
    let cost =
      parseInt(timeConverted) * Number(ethers.utils.parseEther(p.cost));

    return cost;
  };

  const sendRental = async () => {
    if (!tokenContract || !idpContract) {
      console.log("error");
      return;
    }

    try {
      let amount = ethers.utils.parseUnits("0.009", 18);
      let response = await tokenContract.increaseAllowance(tokenHolder, amount);

      const rent = {
        transactionId: response.hash,
        amount: amount,
        platformId: selectedPlatform,
        renter: data.publicAddress,
        hirer: window.ethereum.selectedAddress,
        startDate: new Date(fromDate).getTime(),
        endDate: new Date(toDate).getTime(),
      };

      let rentResp = await idpContract.addRent(
        rent.transactionId,
        rent.renter,
        rent.hirer,
        rent.startDate,
        rent.endDate,
        rent.amount,
        rent.platformId
      );

      console.log(rentResp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog
        header="Noleggia"
        visible={true}
        onHide={() => {
          onClose();
        }}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        {platforms ? (
          <div className="flex flex-column gap-2 mb-4">
            <div>Seleziona la piattaforma che vuoi noleggiare</div>
            <Dropdown
              value={selectedPlatform}
              onChange={(e) =>
                setSelectedPlatform((platform) => (platform = e.value))
              }
              options={platforms}
              optionLabel="label"
              optionValue="value"
              placeholder="Seleziona una piattaforma"
              className="w-full md:w-20rem"
            />
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-column gap-2 mb-4">
          <span>
            Seleziona la data e l'ora quando vuoi iniziare il noleggio:
          </span>
          <Calendar
            className="w-full md:w-20rem"
            value={fromDate}
            onChange={(e) => {
              setFromDate((fromDate: any) => (fromDate = e.value));
              setTotalCost((cost) => (cost = undefined));
            }}
            selectionMode="single"
            showIcon={true}
            showTime={true}
            dateFormat="dd/mm/yy"
            minDate={new Date()}
            maxDate={toDate}
          />
        </div>
        <div className="flex flex-column gap-2 mb-4">
          <span>
            Seleziona la data e l'ora quando vuoi terminare il noleggio:
          </span>
          <Calendar
            className="w-full md:w-20rem"
            value={toDate}
            onChange={(e) => {
              setToDate((toDate: any) => (toDate = e.value));
              setTotalCost((cost) => (cost = undefined));
            }}
            selectionMode="single"
            showIcon={true}
            showTime={true}
            dateFormat="dd/mm/yy"
            minDate={fromDate}
          />
        </div>
        <div className="flex justify-content-end">
          <Button label="Noleggia" onClick={sendRental}></Button>
        </div>
      </Dialog>
    </div>
  );
};

export default RentDialog;
