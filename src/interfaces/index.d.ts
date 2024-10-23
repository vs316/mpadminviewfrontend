export interface IOrderChart {
    status:
        | "waiting"
        | "ready"
        | "on the way"
        | "delivered"
        | "could not be delivered";
    created_at: date;
}

export interface IOrderTotalCount {
    total: number;
    totalDelivered: number;
}

export interface ISalesChart {
    created_at: date;
    title: "Order Count" | "Order Amount";
    amount: number;
}

export interface IOrderStatus {
    id: number;
    text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
}

export interface IUser {
    user_id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    createdAt: string;
    isActive: boolean;
    addresses: IAddress[];
}

export interface IIdentity {
    id: number;
    name: string;
}

export interface IAddress {
    text: string;
    coordinate: [string | number, string | number];
}

export interface IFile {
    lastModified?: number;
    name: string;
    percent?: number;
    size: number;
    status?: "error" | "success" | "done" | "uploading" | "removed";
    type: string;
    uid?: string;
    url: string;
}

export interface IEvent {
    date: string;
    status: string;
}

export interface IStore {
    id: number;
    phoneNumber: string;
    email: string;
    title: string;
    isActive: boolean;
    createdAt: string;
    address: IAddress;
    products: IProduct[];
}

export interface IOrder {
    shipment_id: number;
    user: IUser;
    createdAt: string;
    status: IOrderStatus;
    address: IAddress; // Existing address for the order
    courier: ICourier;
    events: IEvent[];
    amount: number;
    shipFrom?: IShipFrom; // Adding shipFrom
    shipTo?: IShipTo; // Adding shipTo
}

export interface ICategory {
    id: number;
    title: string;
    isActive: boolean;
}

export interface IOrderFilterVariables {
    q?: string;
    store?: string;
    user?: string;
    status?: string[];
}

export interface IUserFilterVariables {
    q: string;
    status: boolean;
    isActive: boolean | string;
}
export interface IShipmentItem {
    shipment_item_id?: number;
    shipment_id?: number | null;
    item_description?: string | null;
    quantity?: number | null;
    weight?: Decimal | number | null;
    value?: Decimal | number | null;
    descriptionOfGoods?: string;
    servicetype?: string;
    // Assuming `shipment` refers to a related shipment entity, you can define its structure as needed.
    shipment?: IShipment | null;
}
export interface IShipFrom {
    shipfrom_id: number;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone_number?: string | null;
    pincode?: string | null;
    city?: string | null;
    locality?: string | null;
    address_line_1?: string | null;
    address_line_2?: string | null;

    // Relationship with shipment: multiple shipments related to ShipFrom
    shipment?: IShipment[]; // Array representing relation to multiple shipments
}

export interface IShipTo {
    shipto_id: number;
    company?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone_number?: string | null;
    pincode?: string | null;
    city?: string | null;
    locality?: string | null;
    address_line_1?: string | null;
    address_line_2?: string | null;

    // Relationship with shipment: multiple shipments related to ShipTo
    shipment?: IShipment[]; // Array representing relation to multiple shipments
}
export interface ICourierStatus {
    id: number;
    text: "Available" | "Offline" | "On delivery";
}
// export interface ICourierGender {
//     id: number;
//     text: "Male" | "Female" | "Other";
// }

export interface ICourier {
    courier_id: number;
    name: string | null;
    surname: string | null;
    email: string | null;
    phone_number: string | null;
    createdAt: string | null;
    vehicle_id: string | null;
    address: string | null;
    status: ICourierStatus;
    vehicle: IVehicle | null;
    rating: decimal | null;
}

export interface IReview {
    id: number;
    order: IOrder;
    user: IUser;
    star: number;
    createDate: string;
    status: "pending" | "approved" | "rejected";
    comment: string[];
}

export interface ITrendingProducts {
    id: number;
    product: IProduct;
    orderCount: number;
}

export type IVehicle = {
    model: string;
    vehicleType: string;
    engineSize: number;
    color: string;
    year: number;
    id: number;
};

export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
