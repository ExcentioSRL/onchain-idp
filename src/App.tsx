import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route, HashRouter } from "react-router-dom";
import Home from "./Components/Home/Home";
import Rent from "./Components/Rent/Rent";
import Platforms from "./Components/Platforms/Platforms";
import { EthereumInterface } from "./Interfaces/EthInterfaces";
import Stats from "./Components/Stats/Stats";

declare global {
  interface Window {
    ethereum: EthereumInterface;
  }
}

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/personal-area" element={<Stats />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
