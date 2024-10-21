import axios from "axios";
import { IShipTo } from "../interfaces";

// Define the API base URL for the Ship To service
const API_BASE_URL = "http://localhost:3000/shipto";

export const shipToService = {
    // Get all Ship To data
    getAllShipToData: async () => {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data.result; // Assuming the result is returned under the "result" key
    },

    // Get Ship To data by ID
    getShipToById: async (shipToId: number) => {
        const response = await axios.get(`${API_BASE_URL}/${shipToId}`);
        return response.data;
    },

    // Create new Ship To details
    createShipToDetails: async (shipToData: {
        company: string;
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
        const response = await axios.post(`${API_BASE_URL}`, shipToData);
        return response.data;
    },
};
