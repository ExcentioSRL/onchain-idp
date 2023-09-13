import { ethers } from "ethers";
import { newTokenContract } from "../environment";

class Token {

    private static tokenInstance: Token;
    private tokenContract: ethers.Contract | undefined = undefined;

    private constructor() {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        const signer = prov.getSigner();

        const responseIdp = newTokenContract(prov);
        this.tokenContract = responseIdp.connect(signer);
    }

    public static getInstance() {
        if (!Token.tokenInstance)
            Token.tokenInstance = new Token();

        return Token.tokenInstance;
    }

    public getContract() {
        return this.tokenContract;
    }

}

export let instance = Token.getInstance();




