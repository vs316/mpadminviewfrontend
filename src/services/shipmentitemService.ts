import axios from "axios";
import { IShipmentItem } from "../interfaces";

// Define the API base URL for shipment items
const API_BASE_URL = "http://localhost:3000/shipment-items";

export const shipmentItemService = {
    // Get all shipment items
    getAllShipmentItems: async () => {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data.result; // Assuming the result is returned under the "result" key
    },

    // Get shipment item by ID
    getShipmentItemById: async (shipmentItemId: number) => {
        const response = await axios.get(`${API_BASE_URL}/${shipmentItemId}`);
        return response.data;
    },

    // Create a new shipment item
    createShipmentItem: async (shipmentItemData: {
        item_name: string | null;
        weight: number | null;
        dimensions: string | null;
        quantity: number | null;
        shipment_order_id: number | null;
    }) => {
        const response = await axios.post(`${API_BASE_URL}`, shipmentItemData);
        return response.data;
    },

    // Update an existing shipment item
    updateShipmentItem: async (
        shipmentItemId: number,
        updatedData: Partial<IShipmentItem>
    ) => {
        const response = await axios.put(
            `${API_BASE_URL}/${shipmentItemId}`,
            updatedData
        );
        return response.data;
    },

    // Delete a shipment item
    deleteShipmentItem: async (shipmentItemId: number) => {
        const response = await axios.delete(
            `${API_BASE_URL}/${shipmentItemId}`
        );
        return response.data;
    },
};
