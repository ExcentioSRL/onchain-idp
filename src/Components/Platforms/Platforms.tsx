import GeneralCard from "../GeneralCard/GeneralCard";
import { useEffect, useState } from "react";
import { getAllPlatforms } from "../../Service/platform.service";

export interface DBPlatformInterface {
  _id: string;
  name: string;
  pathImage: string;
  description: string;
}

const Platforms = () => {
  const [allPlatforms, setAllPlatforms] = useState<DBPlatformInterface[]>([]);

  useEffect(() => {
    try {
      getAllPlatforms().then((res) => {
        setAllPlatforms(res.data);
      });
    } catch (error) {}
  }, []);

  return (
    <div className="p-3">
      <GeneralCard data={allPlatforms} />
    </div>
  );
};

export default Platforms;
