import "./Home.css";

const Home = () => {
  return (
    <div className="w-full" style={{ height: "100dvh" }}>
      <div
        className="w-full flex relative flex-row align-items-center"
        style={{ height: "80%" }}
      >
        <p className="absolute home-title">
          La piattaforma di noleggio che amerai
        </p>
        <img src="/images/rent.png" alt="rent" className="home-image"></img>
      </div>
    </div>
  );
};

export default Home;
