import { Card } from "primereact/card";

export const RentCard = () => {
  const headerRentals = (
    <div className="flex align-items-center">
      <img
        alt="Prime video"
        src="/images/primevideo.png"
        style={{ width: "30%" }}
      />
      <span className="font-semibold text-black-alpha-90">200 EXC</span>
    </div>
  );
  return (
    <div className="platforms px-5 flex flex-column gap-5">
      <span className="title">I tuoi noleggi</span>
      <div className="flex">
        <Card header={headerRentals} className="md:w-20rem shadow-2">
          <div className="flex gap-5">
            <div className="flex flex-column">
              <span className="text-black-alpha-90">Dal: 20/07/2023 16:00</span>
              <span className="text-black-alpha-90">al: 20/07/2023 18:00</span>
            </div>
            <div className="flex justify-content-center align-items-center bg-green-500 px-1 w-4rem border-round-lg h-2rem text-white-alpha-90">
              Attivo
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
