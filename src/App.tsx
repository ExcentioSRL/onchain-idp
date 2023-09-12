import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import {
  Routes,
  Route,
  Outlet,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Home from "./Components/Home/Home";
import Rent from "./Components/Rent/Rent";
import Platforms from "./Components/Platforms/Platforms";
import { EthereumInterface } from "./Interfaces/EthInterfaces";
import Stats from "./Components/Stats/Stats";
import SignupPlatform from "./Components/SignupPlatform/SignupPlatform";

declare global {
  interface Window {
    ethereum: EthereumInterface;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/signup-platform" element={<SignupPlatform />} />
        <Route element={<ProtectedRoute />}>
          <Route path="rent" element={<Rent />} />
          <Route path="personal-area" element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const ProtectedRoute = ({ redirectPath = "/" }: any) => {
  const eth = window.ethereum;

  return eth.selectedAddress ? (
    <Outlet />
  ) : (
    <Navigate to={redirectPath} replace />
  );
};
export default App;
