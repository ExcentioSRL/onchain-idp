import { ethers } from "ethers";
import { tokenAbi, tokenContract } from "../environment";

class Token {

    private static tokenInstance: Token;
    private tokenContract: ethers.Contract | undefined = undefined;

    private constructor() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const responseIdp = this.newTokenContract(provider);
        this.tokenContract = responseIdp.connect(signer);
    }

    private newTokenContract(provider: any) {
        return new ethers.Contract(
            tokenContract,
            tokenAbi,
            provider
        );
    };

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




