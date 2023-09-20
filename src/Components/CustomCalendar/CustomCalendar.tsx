import { Calendar, Navigate, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Button } from "primereact/button";
import "./CustomCalendar.css";
import { useCallback, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { formatDate } from "../../Utility/date.utility";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus, rentSelector } from "../../Slice/rent.slice";
import { ethers } from "ethers";
import { instance as tokenInstance } from "../../Service/token.service";
import { instance as idpInstance } from "../../Service/idp.service";
import { tokenHolder } from "../../environment";
import { RentStatus } from "../../Interfaces/RentInterfaces";

const monthNames = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

function CustomCalendar() {
  const dispatch = useDispatch();
  const formValue = useSelector(rentSelector);
  const tokenContract = tokenInstance.getContract();
  const idpContract = idpInstance.getContract();

  const [events, setEvents] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [startHour, setStartHour] = useState<Date | undefined>(undefined);
  const [endHour, setEndHour] = useState<Date | undefined>(undefined);

  const localizer = momentLocalizer(moment);

  const myToolbar = ({ onNavigate }: any) => {
    return (
      <div className="flex w-full justify-content-center mb-3 align-items-center">
        <Button
          icon="pi pi-angle-left"
          aria-label="PREVIOUS"
          rounded
          text
          raised
          className="mr-2"
          onClick={() => onNavigate(Navigate.PREVIOUS)}
        />
        <Button
          icon="pi pi-angle-right"
          aria-label="NEXT"
          rounded
          text
          raised
          onClick={() => onNavigate(Navigate.NEXT)}
        />
        <span className="ml-3 text-2xl font-semibold">
          {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
        </span>
      </div>
    );
  };

  const myHeader = ({ label }: any) => {
    const [nDay] = label.split(" ");
    const day = new Date().getDate();
    return (
      <div className="h-full" aria-sort="none">
        <div
          className={`text-2xl font-semibold ${
            day === Number(nDay) ? "active" : ""
          }`}
        >
          {nDay}
        </div>
      </div>
    );
  };

  const isSlotDisabled = (isd: Date, ied: Date, sd: Date, ed: Date) => {
    if (isd.getTime() > sd.getTime() && isd.getTime() < ed.getTime())
      return false;
    if (ied.getTime() > sd.getTime() && ied.getTime() < ed.getTime())
      return false;
    if (isd.getTime() < sd.getTime() && ed.getTime() < ied.getTime())
      return false;

    return true;
  };

  const handleSelectSlot = useCallback(
    ({ start, end }: any) => {
      for (let e of events) {
        let res = isSlotDisabled(start, end, e.start, e.end);
        if (res === false) return;
      }
      setStartHour((sh) => (sh = start));
      setEndHour((eh) => (eh = end));
      setShowDialog(true);
    },
    [events]
  );

  const myEventWrapper = (event: any) => {
    return (
      <div className="rbc-events-container">
        <div
          title={event.children.props.title}
          className="rbc-event"
          style={event.children.props.style}
        ></div>
      </div>
    );
  };

  const getData = useCallback(async () => {
    if (!formValue.user || !idpContract) return;

    const resp = await idpContract.getPrivateUserDataById(
      formValue.user.publicAddress
    );

    return resp[0].rentals;
  }, [formValue.user, idpContract]);

  useEffect(() => {
    if (!formValue.user) return;

    const value = getData();
    value.then((res) => {
      const allEvents = res.map((pr: any) => {
        return {
          start: new Date(Number(pr.start.toString())),
          end: new Date(Number(pr.end.toString())),
        };
      });

      setEvents(allEvents);
    });
  }, []);

  function convertInHour(milliseconds: number) {
    //divido i millisecondi per mille e poi per 60 così da avere i minuti
    return (milliseconds / (1000 * 60)).toFixed(0);
  }

  const calculateCost = () => {
    if (!formValue.platform || !formValue.user || !startHour || !endHour)
      return;

    let p = formValue.user.platforms.find(
      (platform) => platform.id === formValue.platform
    );

    if (!p) return;

    let timeConverted = convertInHour(
      new Date(endHour).getTime() - new Date(startHour).getTime()
    );

    let tc = parseFloat(p.cost) * parseFloat(timeConverted);

    let cost = parseFloat(tc.toString()).toFixed(18);

    return cost;
  };

  const sendRental = async () => {
    if (!tokenContract || !idpContract || !startHour || !endHour) {
      return;
    }

    try {
      let cost = calculateCost();
      if (!cost) return;

      let amount = ethers.utils.parseUnits(cost, 18);
      let response = await tokenContract.increaseAllowance(tokenHolder, amount);

      const rent = {
        transactionId: response.hash,
        amount: amount,
        platformId: formValue.platform,
        renter: formValue.user!.publicAddress,
        hirer: window.ethereum.selectedAddress,
        start: new Date(startHour).getTime(),
        end: new Date(endHour).getTime(),
        timestamp: new Date(startHour).setHours(0, 0, 0, 0),
      };

      await idpContract.addRent(
        rent.transactionId,
        rent.renter,
        rent.hirer,
        rent.start,
        rent.end,
        rent.amount,
        rent.platformId,
        rent.timestamp
      );

      dispatch(changeStatus(RentStatus.ACCOUNT));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-3">
        <Calendar
          events={events}
          localizer={localizer}
          defaultView={Views.WEEK}
          drilldownView={null}
          formats={{
            timeGutterFormat: "HH:mm",
          }}
          components={{
            toolbar: myToolbar,
            header: myHeader,
            eventWrapper: myEventWrapper,
          }}
          onSelectSlot={handleSelectSlot}
          timeslots={1}
          selectable
        />
      </div>
      {showDialog && startHour && endHour ? (
        <Dialog
          onHide={() => setShowDialog(false)}
          header="Sei sicuro di voler noleggiare l'account?"
          visible={true}
          style={{ width: "50vw" }}
        >
          <div className="py-5">
            Noleggerai l'account dalle ore {formatDate(startHour)} alle ore{" "}
            {formatDate(endHour)}
          </div>
          <Button
            label="Noleggia"
            severity="success"
            rounded
            disabled={formValue.disabled}
            onClick={sendRental}
          />
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
}

export default CustomCalendar;
