import axios from "axios";

// Define the API base URL (you can use an environment variable for this)
const API_BASE_URL = "http://localhost:3000/user";

export const userService = {
    getUsers: async () => {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data.result; // Assuming the result is returned under the "result" key
    },

    getUserById: async (userId: number) => {
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        return response.data;
    },

    createUser: async (userData: any) => {
        const response = await axios.post(`${API_BASE_URL}`, userData);
        return response.data;
    },

    updateUser: async (userId: number, updatedData: any) => {
        const response = await axios.put(
            `${API_BASE_URL}/${userId}`,
            updatedData
        );
        return response.data;
    },

    deleteUser: async (userId: number) => {
        const response = await axios.delete(`${API_BASE_URL}/${userId}`);
        return response.data;
    },
};
