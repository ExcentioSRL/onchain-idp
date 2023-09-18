import { RentalInterface } from "./PlatformInterface";

export enum RentStatus {
    ACCOUNT,
    CHOOSEPLATFORM,
    CHOOSEDATE,
}

export interface PlatformRentInterface {
    id: string;
    cost: string;
    pathImage: string;
    name: string;
}

export interface UserRentInterface {
    name: string | undefined;
    publicAddress: string;
    platforms: PlatformRentInterface[];
    rentals: RentalInterface[];
}