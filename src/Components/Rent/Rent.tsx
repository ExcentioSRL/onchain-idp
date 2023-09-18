import ChoosePlatform from "./ChoosePlatform";
import CustomCalendar from "../CustomCalendar/CustomCalendar";
import { RentStatus } from "../../Interfaces/RentInterfaces";
import Account from "./Account";
import { useSelector } from "react-redux";
import { rentSelector } from "../../Slice/rent.slice";

const Rent = () => {
  const formValue = useSelector(rentSelector);

  const map = {
    [RentStatus.ACCOUNT]: <Account />,
    [RentStatus.CHOOSEPLATFORM]: <ChoosePlatform />,
    [RentStatus.CHOOSEDATE]: <CustomCalendar />,
  };

  return <>{map[formValue.status]}</>;
};

export default Rent;
