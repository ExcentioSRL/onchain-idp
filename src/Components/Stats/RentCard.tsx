import { Card } from "primereact/card";
import {
  PrivateUserData,
  RentalInterface,
} from "../../Interfaces/PlatformInterface";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getAllPlatforms } from "../../Service/platform.service";
import { DBPlatformInterface } from "../Platforms/Platforms";
import { formatDate } from "../../Utility/date.utility";

export const RentCard = ({
  userData,
}: {
  userData: PrivateUserData | undefined;
}) => {
  const [platforms, setPlatforms] = useState<DBPlatformInterface[]>([]);

  useEffect(() => {
    getAllPlatforms().then((res) => {
      setPlatforms((platforms) => (platforms = res.data));
    });
  }, [setPlatforms]);

  const headerRentals = (r: RentalInterface) => {
    const platform = platforms.find((p) => p._id === r.platformId);

    return (
      <div className="flex w-full align-items-center gap-3 justify-content-around p-3">
        <img
          alt={platform?.name}
          src={platform?.pathImage}
          style={{ width: "30%" }}
        />
        <span
          className="font-semibold text-black-alpha-90"
          style={{ fontSize: "12px" }}
        >
          {ethers.utils.formatEther(r.amount)} EXC
        </span>
      </div>
    );
  };

  const getStato = (r: RentalInterface) => {
    const date = new Date();

    switch (true) {
      case date.getTime() < Number(r.start.toString()):
        return (
          <div
            className="flex justify-content-center align-items-center bg-green-500 px-1 w-4rem border-round-lg h-2rem text-white"
            style={{ fontSize: "14px" }}
          >
            In programma
          </div>
        );
      case date.getTime() > Number(r.start.toString()) &&
        date.getTime() < Number(r.end.toString()):
        return (
          <div
            className="flex justify-content-center align-items-center bg-yellow-600	 px-1 w-4rem border-round-lg h-2rem text-white"
            style={{ fontSize: "14px" }}
          >
            In corso
          </div>
        );
      default:
        return (
          <div
            className="flex justify-content-center align-items-center bg-red-500 px-1 w-4rem border-round-lg h-2rem text-white"
            style={{ fontSize: "14px" }}
          >
            Finito
          </div>
        );
    }
  };

  return (
    <div className="platforms px-5 flex flex-column gap-5">
      <span className="title-stats">I tuoi noleggi</span>
      <div className="flex">
        {userData && userData.rentals.length > 0 ? (
          userData.rentals.map((r) => (
            <Card
              header={headerRentals(r)}
              className="md:w-20rem shadow-2 mr-4"
              key={r.transactionId}
            >
              <div className="flex gap-5">
                <div className="flex flex-column">
                  <span className="text-black-alpha-90">
                    Dal: {formatDate(r.start.toString())}
                  </span>
                  <span className="text-black-alpha-90">
                    al: {formatDate(r.end.toString())}
                  </span>
                </div>
                <>{getStato(r)}</>
              </div>
            </Card>
          ))
        ) : (
          <>Non sono presenti noleggi</>
        )}
      </div>
    </div>
  );
};
