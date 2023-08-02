import GeneralCard from "../GeneralCard/GeneralCard";
import netflix from "../../Assets/netflix.png";
import primevideo from "../../Assets/primevideo.png";
import raiplay from "../../Assets/raiplay.jpeg";

const Platforms = () => {
  const allPlatforms = [
    {
      id: "1",
      name: "Netflix",
      image: netflix,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: "2",
      name: "Prime Video",
      image: primevideo,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: "3",
      name: "Rai play",
      image: raiplay,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ];

  return (
    <div className="p-3">
      <GeneralCard data={allPlatforms} />
    </div>
  );
};

export default Platforms;
