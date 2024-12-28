import axios from 'axios'
import BASE_URL from './config';

const updateProfile = async (profileData, token) => {
    try {
        if (!token) {
            throw new Error('Token is not authenticated')
        }

        const response = await axios.put(
            `${BASE_URL}/receptionist/api/profile/update/`,
            profileData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        console.log('Profile updated successfully:', response.data);
        return response.data;
    } catch (e) {
        console.log('Error during profile update:', e);
        throw e;
    }
}

const getProfile = async (token) => {
    try {
        if (!token) {
            throw new Error('Token is not authenticated')
        }
        const response = await axios.get(
            `${BASE_URL}/receptionist/api/profile/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (e) {
        console.log('Error during profile fetching:', e);
        throw e;
    }
}

// Cả hai hàm đều cần được xuất ra.
export { updateProfile, getProfile };
