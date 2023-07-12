import "./GeneralCard.css";

const GeneralCard = ({ data }: { data: any }) => {
  return (
    <>
      <div className="wrapper flex flex-column justify-content-center flex-wrap md:flex-row">
        {data.map((platform: any) => {
          return (
            <div className="card" key={platform.id}>
              <img src={platform.image} alt={platform.name} />
              <div className="info">
                <h1>{platform.name}</h1>
                <p>{platform.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GeneralCard;
