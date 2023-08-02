import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import netflixLogo from "../../Assets/netflix.png";
import { ethers } from "ethers";
import { newIdpContract } from "../../environment";
import RentDialog from "./RentDialog/RentDialog";

interface UserRentInterface {
  name: string | undefined;
  publicAddress: string;
  platforms: {
    valid: boolean;
    uuid: string;
    code: string;
  }[];
  cost: number;
}

const Rent = () => {
  const [showRentDialog, setShowRentDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<
    UserRentInterface | undefined
  >(undefined);
  const eth = window.ethereum;
  const [users, setUsers] = useState<UserRentInterface[]>([
    {
      name: undefined,
      publicAddress: "0x1234",
      platforms: [
        {
          valid: true,
          uuid: "1",
          code: "NETFLIX",
        },
        {
          valid: true,
          uuid: "2",
          code: "PRIMEVIDEO",
        },
      ],
      cost: 20,
    },
    {
      name: undefined,
      publicAddress: "0x5678",
      platforms: [
        {
          valid: true,
          uuid: "1",
          code: "NETFLIX",
        },
        {
          valid: true,
          uuid: "2",
          code: "PRIMEVIDEO",
        },
      ],
      cost: 20,
    },
  ]);
  const selectedAddress =
    eth.selectedAddress != null ? eth.selectedAddress.toLowerCase() : undefined;

  const getUserData = useCallback(async () => {
    const prov = new ethers.providers.Web3Provider(eth);
    const signer = prov.getSigner();
    const response = newIdpContract(prov);
    const idpContract = response.connect(signer);

    // try {
    //   const resp = await idpContract.getUserData();
    //   if (resp.isEmpty()) return;
    //   setUsers([
    // {
    //   name: undefined,
    //   publicAddress: resp[0].userAddr,
    //   platforms: "uuid",
    //   cost: 20,
    // },
    //   ]);
    // } catch (error: any) {
    //   console.log(error);
    // }
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  const selectUser = (userData: UserRentInterface) => {
    setSelectedUser((user) => (user = userData));
    setShowRentDialog(true);
  };

  const rentTemplate = (rowData: any) => {
    if (selectedAddress) {
      const address = rowData.publicAddress.toLowerCase();
      if (address === selectedAddress) return <></>;
    }

    return <Button onClick={() => selectUser(rowData)}>Noleggia</Button>;
  };

  const platformTemplate = (rowData: UserRentInterface) => {
    // switch (platforms[0]) {
    //   case "Netflix":
    //     console.log("netflix");
    //     break;
    //   default:
    //     console.log("niente");
    // }
    return <Image src={netflixLogo} alt="netflixLogo" width="60px"></Image>;
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
        <Column field="cost" header="Costo"></Column>
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
