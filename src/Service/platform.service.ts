import axios from "axios"
import { BACKEND_LINK } from "../environment"

const platformLink = "/platform"

export const getAllPlatforms = async () => {
    try {
        return await axios.get(`${BACKEND_LINK}${platformLink}`)
    } catch (error) {
        throw new Error("error")
    }
}

export const newPlatform = async (input: any) => {
    try {
        return await axios.post(`${BACKEND_LINK}${platformLink}`, input)
    } catch (error) {
        throw new Error("error")
    }
}