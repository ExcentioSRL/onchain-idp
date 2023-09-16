import { Card } from "primereact/card";
import {
  PrivateUserData,
  RentalInterface,
} from "../../Interfaces/PlatformInterface";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getAllPlatforms } from "../../Service/platform.service";
import { DBPlatformInterface } from "../Platforms/Platforms";

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
      <div className="flex align-items-center">
        <img
          alt={platform?.name}
          src={platform?.pathImage}
          style={{ width: "30%" }}
        />
        <span className="font-semibold text-black-alpha-90">
          {ethers.utils.formatEther(r.amount)} EXC
        </span>
      </div>
    );
  };

  return (
    <div className="platforms px-5 flex flex-column gap-5">
      <span className="title">I tuoi noleggi</span>
      <div className="flex">
        {userData?.rentals.map((r) => (
          <Card header={headerRentals(r)} className="md:w-20rem shadow-2">
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
        ))}
      </div>
    </div>
  );
};
