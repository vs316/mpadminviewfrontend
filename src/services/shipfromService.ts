import axios from "axios";
import { IShipFrom } from "../interfaces";

// Define the API base URL for the Ship From service
const API_BASE_URL = "http://localhost:3000/shipfrom";

export const shipFromService = {
    // Get all Ship From data
    getAllShipFromData: async () => {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data.result; // Assuming the result is returned under the "result" key
    },

    // Get Ship From data by ID
    getShipFromById: async (shipFromId: number) => {
        const response = await axios.get(`${API_BASE_URL}/${shipFromId}`);
        return response.data;
    },

    // Create new Ship From details
    createShipFromDetails: async (shipFromData: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        address_line_1: string;
        address_line_2: string;
        locality: string;
        city: string;
        pincode: string;
    }) => {
        const response = await axios.post(`${API_BASE_URL}`, shipFromData);
        return response.data;
    },
};
