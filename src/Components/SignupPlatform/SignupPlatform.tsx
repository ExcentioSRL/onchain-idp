import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { newPlatform } from "../../Service/platform.service";

const SignupPlatform = () => {
  const [platformName, setPlatformName] = useState<string>("");
  const [redirectLink, setRedirectLink] = useState<string>("");
  const [pathImage, setPathImage] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const newPlatformApi = async () => {
    const data = {
      platformName: platformName,
      redirectLink: redirectLink,
      pathImage: pathImage,
      description: description,
    };

    try {
      const result = await newPlatform(data);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center ">
      <Card className="w-6 ">
        <form
          className="flex flex-column align-items-center"
          onSubmit={newPlatformApi}
        >
          <span className="text-2xl font-semibold text-black-alpha-90 mb-5">
            Iscrivi la tua piattaforma
          </span>
          <span className="p-float-label w-full mb-5">
            <InputText
              className="w-full"
              id="platformName"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
            />
            <label htmlFor="platformName">Nome piattaforma</label>
          </span>
          <span className="p-float-label w-full mb-5">
            <InputText
              className="w-full"
              id="redirectLink"
              value={redirectLink}
              onChange={(e) => setRedirectLink(e.target.value)}
            />
            <label htmlFor="redirectLink">Link di redirect</label>
          </span>
          <span className="p-float-label w-full mb-5">
            <InputText
              className="w-full"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="description">Descrizione</label>
          </span>

          <Button rounded label="Invia" type="submit"></Button>
        </form>
      </Card>
    </div>
  );
};

export default SignupPlatform;
