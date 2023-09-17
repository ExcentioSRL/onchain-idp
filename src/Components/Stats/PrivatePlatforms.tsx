import { Card } from "primereact/card";
import { PrivateUserData } from "../../Interfaces/PlatformInterface";
import { useEffect, useState } from "react";
import { DBPlatformInterface } from "../Platforms/Platforms";
import { getAllPlatforms } from "../../Service/platform.service";

export const PrivatePlatforms = ({
  userData,
}: {
  userData: PrivateUserData | undefined;
}) => {
  const [allPlatforms, setAllPlatforms] = useState<DBPlatformInterface[]>([]);

  const headerPlatforms = ({ alt, src }: { alt: string; src: string }) => (
    <div
      style={{ height: "80px", width: "70%" }}
      className="flex align-items-center"
    >
      <img alt={alt} src={src} style={{ width: "100%" }} />
    </div>
  );

  useEffect(() => {
    if (!userData) return;

    try {
      getAllPlatforms().then((res) => {
        const platforms: DBPlatformInterface[] = res.data;

        const ap = platforms.filter(
          (ap) => userData.platforms.filter((p) => p.uuid === ap._id)[0]
        );

        setAllPlatforms((platforms) => (platforms = ap));
      });
    } catch (error) {}
  }, [userData]);

  return (
    <div className="platforms px-5 flex flex-column gap-5 mb-5">
      <span className="title">Le tue piattaforme</span>

      {!userData ||
      userData.platforms.length === 0 ||
      allPlatforms.length === 0 ? (
        <>Non sono presenti piattaforme associate al tuo account</>
      ) : (
        <div className="flex gap-3">
          {allPlatforms.map((ap) => (
            <Card
              key={ap._id}
              header={headerPlatforms({ alt: ap.name, src: ap.pathImage })}
              className="md:w-12rem shadow-2"
            >
              <div className="flex justify-content-center">{ap.name}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
