import { ethers } from "ethers";
import { newTokenContract, newIdpContract } from "../environment";

export function setData() {
    const prov = new ethers.providers.Web3Provider(window.ethereum);
    const signer = prov.getSigner();

    const responseToken = newTokenContract(prov);
    const tokenContract = responseToken.connect(signer);

    const responseIdp = newIdpContract(prov);
    const idpContract = responseIdp.connect(signer);

    return { token: tokenContract, idp: idpContract };
}