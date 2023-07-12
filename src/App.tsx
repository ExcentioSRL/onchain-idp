import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import BottomBar from "./Components/BottomBar/BottomBar";
import { Routes, Route, HashRouter } from "react-router-dom";
import Home from "./Components/Home/Home";
import Rent from "./Components/Rent/Rent";
import Platforms from "./Components/Platforms/Platforms";

// interface RequestArguments {
//   method: string;
//   params?: unknown[] | object;
// }
// interface EthereumInterface {
//   isConnected: () => boolean;
//   isMetaMask: boolean;
//   chainId: string;
//   request: (args: RequestArguments) => Promise<unknown>;
//   selectedAddress: string;
// }

// declare global {
//   interface Window {
//     ethereum: EthereumInterface;
//   }
// }

// function getPublicAddress(ethereum: EthereumInterface) {
//   if (ethereum.isMetaMask) {
//     if (ethereum.selectedAddress != null) {
//       return ethereum.selectedAddress;
//     } else {
//       return ethereum
//         .request({
//           method: "eth_requestAccounts",
//         })
//         .then((response) => {
//           const eth_requestAccount = response as string[];
//           return eth_requestAccount[0];
//         })
//         .catch((error) => console.log(error));
//     }
//   }
// }

function App() {
  // const [pubicAddress, setPublicAddress] = useState<string | undefined>();
  // const ethereum = window.ethereum;

  // useEffect(() => {
  //   const response = getPublicAddress(ethereum);

  //   if (typeof response === "string") {
  //     setPublicAddress(response);
  //   } else if (response) {
  //     response.then((res) => {
  //       if (typeof res === "string") setPublicAddress(res);
  //       else {
  //         console.log("errore nella chiamata");
  //         setPublicAddress(undefined);
  //       }
  //     });
  //   } else {
  //     console.log("errore nella chiamata");
  //     setPublicAddress(undefined);
  //   }
  // }, [ethereum.isConnected]);

  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/platforms" element={<Platforms />} />
      </Routes>
      {/* <BottomBar /> */}
    </HashRouter>
  );
}

export default App;
