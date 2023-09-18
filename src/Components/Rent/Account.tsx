import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Image } from "primereact/image";
import { RentStatus, UserRentInterface } from "../../Interfaces/RentInterfaces";
import { changeState, changeStatus } from "../../Slice/rent.slice";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { instance as idpInstance } from "../../Service/idp.service";
import { DBPlatformInterface } from "../Platforms/Platforms";
import {
  PlatformInterface,
  PrivateUserData,
} from "../../Interfaces/PlatformInterface";
import { ethers } from "ethers";
import { getAllPlatforms } from "../../Service/platform.service";

const ListAccount = () => {
  const eth = window.ethereum;
  const dispatch = useDispatch();
  const contractIdp = idpInstance.getContract();
  const [users, setUsers] = useState<UserRentInterface[]>([
    {
      name: undefined,
      publicAddress: "0x1234",
      platforms: [
        {
          id: "1",
          cost: "0.0000001",
          pathImage: "/images/logo.png",
          name: "Excentio",
        },
      ],
      rentals: [],
    },
    {
      name: undefined,
      publicAddress: "0x5678",
      platforms: [
        {
          id: "1",
          cost: "0.0000001",
          pathImage: "/images/logo.png",
          name: "Excentio",
        },
        {
          id: "2",
          cost: "0.0000001",
          pathImage: "/images/fitnessfusion.png",
          name: "fitnessfusion",
        },
        {
          id: "3",
          cost: "0.0000001",
          pathImage: "/images/videovista.png",
          name: "videovista",
        },
      ],
      rentals: [
        {
          transactionId: "",
          renter: "0x5",
          hirer: "0x",
          start: 1695033721287,
          end: 1695037325843,
          amount: 0.0001,
          platformId: "1",
        },
        {
          transactionId: "",
          renter: "0x5",
          hirer: "0x",
          start: 1695058172840,
          end: 1695058173840,
          amount: 0.0001,
          platformId: "1",
        },
      ],
    },
  ]);

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
    dispatch(changeState({ label: "user", value: userData }));
    dispatch(changeStatus(RentStatus.CHOOSEPLATFORM));
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
  return (
    <div style={{ width: "100%", padding: "1rem 0" }}>
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
        <Column field="noleggio" header="Noleggio" body={rentTemplate} />
      </DataTable>
    </div>
  );
};

export default ListAccount;
