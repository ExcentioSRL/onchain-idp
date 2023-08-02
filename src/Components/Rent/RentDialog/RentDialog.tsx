import { useCallback, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const RentDialog = ({ data, onClose }: { data: any; onClose: any }) => {
  const [platforms, setPlatforms] = useState<any | undefined>(undefined);
  const [selectedPlatform, setSelectedPlatform] = useState();
  const [fromDate, setFromDate] = useState<any>(new Date());
  const [toDate, setToDate] = useState<any>();
  const [totalCost, setTotalCost] = useState<number | undefined>(undefined);

  const switchPlatforms = (platformCode: string) => {
    switch (platformCode) {
      case "NETFLIX":
        return "netflix";
      case "PRIMEVIDEO":
        return "prime video";
      default:
        return;
    }
  };

  const getAllPlatformsName = useCallback(() => {
    setPlatforms(
      data.platforms.map((platform: any) => ({
        name: switchPlatforms(platform.code),
        uuid: platform.uuid,
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
    let timeConverted = convertInHour(
      new Date(toDate).getTime() - new Date(fromDate).getTime()
    );

    //il costo verrà salvato in ore, qui viene convertito a minuti
    let cost = parseInt(timeConverted) * (data.cost / 60);
    return parseInt(cost.toFixed(2));
  };

  const sendRental = () => {
    const rent = {
      cost: calculateCost(),
      platformId: selectedPlatform,
      hirer: data.publicAddress,
      renter: "0x",
    };
    console.log(rent);
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
              optionLabel="name"
              optionValue="uuid"
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
