import axios from "axios";
import { ICourierStatus } from "../interfaces";

// Define the API base URL for couriers
const API_BASE_URL = "http://localhost:3000/couriers";

export const courierService = {
    // Get all couriers
    getCouriers: async () => {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data.result; // Assuming the result is returned under the "result" key
    },

    // Get courier by ID
    getCourierById: async (courierId: number) => {
        const response = await axios.get(`${API_BASE_URL}/${courierId}`);
        return response.data;
    },

    // Create a new courier
    createCourier: async (courierData: {
        name: string | null;
        email: string | null;
        phone_number: string | null;
        vehicle_id: string | null;
        address: string | null;
        status: ICourierStatus | null;
        rating: number | null;
    }) => {
        const response = await axios.post(`${API_BASE_URL}`, courierData);
        return response.data;
    },
    // Update an existing courier
    updateCourier: async (courierId: number, updatedData: any) => {
        const response = await axios.put(
            `${API_BASE_URL}/${Number(courierId)}`,
            updatedData
        );
        return response.data;
    },

    // Delete a courier
    deleteCourier: async (courierId: number) => {
        const response = await axios.delete(`${API_BASE_URL}/${courierId}`);
        return response.data;
    },
};
