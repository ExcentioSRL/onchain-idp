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
import { Provider } from "react-redux";
import { globalStore } from "./global.store";
import CustomCalendar from "./Components/CustomCalendar/CustomCalendar";

declare global {
  interface Window {
    ethereum: EthereumInterface;
  }
}

function App() {
  return (
    <Provider store={globalStore}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/platforms" element={<Platforms />} />
          <Route path="/calendar" element={<CustomCalendar />} />
          <Route path="/signup-platform" element={<SignupPlatform />} />
          <Route element={<ProtectedRoute />}>
            <Route path="rent" element={<Rent />} />
            <Route path="personal-area" element={<Stats />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
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
