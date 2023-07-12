import "./Home.css";
import rent from "../../Assets/rent.png";
import Web3 from "web3";

const Home = () => {
  // var web3 = new Web3("http://localhost:7545");

  // const funzione = async () => {
  //   const accounts = await web3.eth.getAccounts();
  //   let account = accounts[0];
  //   console.log(account);
  // };

  return (
    <div className="w-full" style={{ height: "100dvh" }}>
      <div
        className="w-full flex relative flex-row align-items-center"
        style={{ height: "80%" }}
      >
        <p className="absolute home-title">
          La piattaforma di noleggio che amerai
        </p>
        <img src={rent} alt="rent" className="home-image"></img>
      </div>
      {/* <div className="w-full bg-primary">Le piattaforme associate</div> */}
      {/* <button onClick={funzione}>funzione</button> */}
    </div>
  );
};

export default Home;
