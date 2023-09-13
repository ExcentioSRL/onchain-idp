import { ethers } from "ethers";
import { newIdpContract } from "../environment";

class Idp {

    private static idpInstance: Idp;
    private idpContract: ethers.Contract | undefined = undefined;

    private constructor() {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        const signer = prov.getSigner();

        const responseIdp = newIdpContract(prov);
        this.idpContract = responseIdp.connect(signer);
    }

    public static getInstance() {
        if (!Idp.idpInstance)
            Idp.idpInstance = new Idp();

        return Idp.idpInstance;
    }

    public getContract() {
        return this.idpContract;
    }

}

export let instance = Idp.getInstance();




