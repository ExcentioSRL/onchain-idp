import { DBPlatformInterface } from "../Platforms/Platforms";
import "./GeneralCard.css";

const GeneralCard = ({ data }: { data: DBPlatformInterface[] }) => {
  return (
    <div className="wrapper flex flex-column justify-content-center flex-wrap md:flex-row">
      {data.map((platform: DBPlatformInterface) => {
        return (
          <div className="general-card" key={platform._id}>
            <img src={platform.pathImage} alt={platform.name} />
            <div className="info">
              <h1>{platform.name}</h1>
              <p>{platform.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GeneralCard;
