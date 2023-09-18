import "./ChoosePlatform.css";
import { useDispatch, useSelector } from "react-redux";
import {
  changeState,
  changeStatus,
  rentSelector,
} from "../../Slice/rent.slice";
import { Button } from "primereact/button";
import { RentStatus } from "../../Interfaces/RentInterfaces";

const ChoosePlatform = () => {
  const dispatch = useDispatch();
  const formValue = useSelector(rentSelector);

  const setChoosedPlatform = (platform: string) => {
    dispatch(changeState({ label: "platform", value: platform }));
  };

  return (
    <div className="flex flex-row " style={{ height: "calc(100vh - 56px)" }}>
      <div className="flex flex-column align-items-center h-full justify-content-center background-left">
        <div className="title">Scegli una piattaforma</div>
      </div>
      <div
        className="flex flex-column align-items-center"
        style={{ width: "50%" }}
      >
        <div className="h-full overflow-y-auto flex flex-column align-items-center w-full">
          <div className="card-position">
            {formValue.user?.platforms.map((p) => (
              <div
                key={p.id}
                className={`type-card ${
                  formValue.platform === p.id ? "choosed" : ""
                }`}
                onClick={() => setChoosedPlatform(p.id)}
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full justify-content-around pb-2">
          <Button
            onClick={() => {
              dispatch(changeState({ label: "platform", value: undefined }));
              dispatch(changeStatus(RentStatus.ACCOUNT));
            }}
          >
            Indietro
          </Button>
          <Button
            disabled={formValue.platform === undefined}
            onClick={() => dispatch(changeStatus(RentStatus.CHOOSEDATE))}
          >
            Avanti
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlatform;
