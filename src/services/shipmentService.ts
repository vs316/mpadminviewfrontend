import axios from "axios";
import { IShipment } from "../interfaces"; // You'll need to define this interface

// Define the API base URL for shipments
const API_BASE_URL = "http://localhost:3000/shipments";

export const shipmentService = {
    // Get all shipments with optional filters
    getShipments: async () => {
        // const queryParams = new URLSearchParams();
        // if (params?.skip) queryParams.append("skip", params.skip.toString());
        // if (params?.take) queryParams.append("take", params.take.toString());
        // if (params?.userId)
        //     queryParams.append("userId", params.userId.toString());
        // if (params?.status) queryParams.append("status", params.status);

        // const url = queryParams.toString()
        //     ? `${API_BASE_URL}?${queryParams}`
        //     : API_BASE_URL;
        const url = API_BASE_URL;
        const response = await axios.get(url);
        return response.data.result;
    },

    // Get shipment by ID
    getShipmentById: async (shipmentId: number) => {
        const response = await axios.get(`${API_BASE_URL}/${shipmentId}`);
        return response.data;
    },

    // Create a new shipment
    createShipment: async (shipmentData: IShipment) => {
        const response = await axios.post(`${API_BASE_URL}`, shipmentData);
        return response.data;
    },

    // Create a complete shipment
    createCompleteShipment: async (userId: number, shipmentData: IShipment) => {
        const response = await axios.post(`${API_BASE_URL}/complete`, {
            userId,
            shipmentData,
        });
        return response.data;
    },

    // Update an existing shipment
    updateShipment: async (
        shipmentId: number,
        updatedData: Partial<IShipment>
    ) => {
        const response = await axios.patch(
            `${API_BASE_URL}/${shipmentId}`,
            updatedData
        );
        return response.data;
    },

    // Delete a shipment
    deleteShipment: async (shipmentId: number) => {
        const response = await axios.delete(`${API_BASE_URL}/${shipmentId}`);
        return response.data;
    },

    // Create a draft shipment
    createDraftShipment: async (userId: number) => {
        const response = await axios.post(`${API_BASE_URL}/draft`, { userId });
        return response.data;
    },

    // Finalize a shipment
    finalizeShipment: async (shipmentId: number) => {
        const response = await axios.post(
            `${API_BASE_URL}/${shipmentId}/finalize`
        );
        return response.data;
    },
};
