import { Calendar, Navigate, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Button } from "primereact/button";
import "./CustomCalendar.css";
import { useCallback, useState } from "react";
import { Dialog } from "primereact/dialog";
import { formatDate } from "../../Utility/date.utility";

function CustomCalendar() {
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

  const [events, setEvents] = useState<any[]>([
    {
      title: "disabilitato",
      start: new Date("2023-09-19T04:00:00.000Z"),
      end: new Date("2023-09-19T05:00:00.000Z"),
    },
  ]);

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
          <Button label="Noleggia" severity="success" rounded />
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
}

export default CustomCalendar;
