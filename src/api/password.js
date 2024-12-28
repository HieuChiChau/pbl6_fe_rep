import axios from "axios";
import BASE_URL from "./config";

const changePassword = async (token, currentPassword, newPassword, confirmPassword) => {
    try {
        const response = await axios.post(`${BASE_URL}/receptionist/api/user/change_password/`, {
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};

export default changePassword;