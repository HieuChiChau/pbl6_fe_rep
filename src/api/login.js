import axios from 'axios';
import BASE_URL from './config';
import Cookies from 'js-cookie';

const login = async (email, password) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/user/api/userauths/login/`,
            {
                email: email,
                password: password,
            },
        );

        const { access, refresh } = response.data;

        // Lưu trữ access và refresh token trong cookies
        Cookies.set('access', access, { expires: 7, path: '' });  // Thời gian sống cookie là 7 ngày
        Cookies.set('refresh', refresh, { expires: 7, path: '' });

        // Kiểm tra quyền hạn người dùng (nếu cần thiết)
        const userRole = response.data.role;
        if (userRole === 'Receptionist') {
            return response.data;
        } else {
            alert('You do not have permission to access this site!');
            return null;
        }
    } catch (e) {
        console.log('Error during login:', e);
        throw e;
    }
}


export default login;
