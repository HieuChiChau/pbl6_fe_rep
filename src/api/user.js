import axios from "axios";
import BASE_URL from "./config";

const getUserInfo = async (token) =>{
    try{
        const response = await axios.get(`${BASE_URL}/receptionist/api/user/info/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }catch(e){
        console.error("Error fetching user info:", e);
        throw e;
    }
}

export default getUserInfo;