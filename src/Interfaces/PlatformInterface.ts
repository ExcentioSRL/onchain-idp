export interface PlatformInterface {
    uuid: string;
    isValid: boolean;
}

export interface RentalInterface {
    transactionId: string;
    renter: string;
    hirer: string;
    startDate: number;
    endDate: number;
    amount: number;
    platformId: string;
}

export interface GlobalUserData {
    userAddr: string;
    platforms: PlatformInterface[];
}

export interface PrivateUserData {
    userAddr: string;
    platforms: PlatformInterface[];
    rentals: RentalInterface[];
}

