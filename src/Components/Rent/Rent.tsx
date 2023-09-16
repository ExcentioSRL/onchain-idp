import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { instance as idpInstance } from "../../Service/idp.service";
import RentDialog from "./RentDialog/RentDialog";
import {
  PlatformInterface,
  PrivateUserData,
  RentalInterface,
} from "../../Interfaces/PlatformInterface";
import { ethers } from "ethers";
import { getAllPlatforms } from "../../Service/platform.service";
import { DBPlatformInterface } from "../Platforms/Platforms";

export interface PlatformRentInterface {
  id: string;
  cost: string;
  pathImage: string;
  name: string;
}

export interface UserRentInterface {
  name: string | undefined;
  publicAddress: string;
  platforms: PlatformRentInterface[];
  rentals: RentalInterface[];
}

/*
[
    {
      name: undefined,
      publicAddress: "0x1234",
      platforms: [
        {
          isValid: true,
          uuid: "1",
          cost: "0.000001",
        },
        {
          isValid: true,
          uuid: "2",
          cost: "0.00001",
        },
      ],
    },
    {
      name: undefined,
      publicAddress: "0x5678",
      platforms: [
        {
          isValid: true,
          uuid: "1",
          cost: "0.00001",
        },
        {
          isValid: true,
          uuid: "2",
          cost: "0.00001",
        },
      ],
    },
  ]
 */

const Rent = () => {
  const [showRentDialog, setShowRentDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<
    UserRentInterface | undefined
  >(undefined);
  const eth = window.ethereum;
  const contractIdp = idpInstance.getContract();

  const [users, setUsers] = useState<UserRentInterface[]>([]);

  const getUserPlatforms = (
    dbPlatforms: DBPlatformInterface[],
    bcPlatform: PlatformInterface[]
  ) => {
    return bcPlatform.map((p) => {
      let platform = dbPlatforms.filter((ap) => p.uuid === ap._id)[0];

      return {
        id: platform._id,
        cost: ethers.utils.formatEther(p.cost),
        pathImage: platform.pathImage,
        name: platform.name,
      };
    });
  };

  const getUserData = useCallback(
    async (dbPlatforms: DBPlatformInterface[]) => {
      if (!contractIdp) {
        console.log("idp contract");
        return;
      }

      try {
        const privateData: PrivateUserData[] =
          await contractIdp.getPrivateUserData();

        const data: UserRentInterface[] = privateData.map(
          (r: PrivateUserData) => {
            return {
              name: undefined,
              publicAddress: r.userAddr,
              platforms: getUserPlatforms(dbPlatforms, r.platforms),
              rentals: r.rentals,
            };
          }
        );

        setUsers(data);
      } catch (error: any) {
        console.log(error);
      }
    },
    [contractIdp]
  );

  useEffect(() => {
    getAllPlatforms().then((res) => {
      getUserData(res.data);
    });
  }, [getUserData]);

  const selectUser = (userData: UserRentInterface) => {
    setSelectedUser((user) => (user = userData));
    setShowRentDialog(true);
  };

  const rentTemplate = (rowData: any) => {
    if (eth.selectedAddress) {
      const address = rowData.publicAddress.toLowerCase();
      if (address === eth.selectedAddress.toLowerCase()) return <></>;
    }

    return <Button onClick={() => selectUser(rowData)}>Noleggia</Button>;
  };

  const platformTemplate = (rowData: UserRentInterface) => {
    return (
      <>
        {rowData.platforms.map((p) => (
          <Image key={p.id} src={p.pathImage} alt={p.name} width="60px"></Image>
        ))}
      </>
    );
  };

  const nameTemplate = (rowData: UserRentInterface) => {
    return (
      <div style={{ width: "20%" }}>
        {rowData.name ? rowData.name : rowData.publicAddress}
      </div>
    );
  };

  const onclose = () => {
    setSelectedUser((user) => (user = undefined));
    setShowRentDialog(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <DataTable
        value={users}
        emptyMessage="Non ci sono account disponibili per il noleggio"
      >
        <Column field="name" header="Nome" body={nameTemplate}></Column>
        <Column
          field="platforms"
          header="Piattaforme"
          body={platformTemplate}
        ></Column>
        {/* <Column field="cost" header="Costo"></Column> */}
        <Column field="noleggio" header="Noleggio" body={rentTemplate} />
      </DataTable>
      {showRentDialog && selectedUser ? (
        <RentDialog data={selectedUser} onClose={() => onclose()} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Rent;
