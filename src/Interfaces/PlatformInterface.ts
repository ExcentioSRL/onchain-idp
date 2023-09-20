export interface PlatformInterface {
    uuid: string;
    isValid: boolean;
    cost: string;
}

export interface RentalInterface {
    transactionId: string;
    renter: string;
    hirer: string;
    start: number;
    end: number;
    amount: number;
    platformId: string;
    timestamp: number;
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

