import axios from 'axios';
import BASE_URL from './config';

class BookingAPI {
    constructor() {
        this.baseURL = `${BASE_URL}/receptionist/api/bookings/`;
    }

    async ListAvailableRoom(checkInDate, checkOutDate, token) {
        try {
            const response = await axios.get(`${this.baseURL}available_rooms/`, {
                params: {
                    check_in_date: checkInDate,
                    check_out_date: checkOutDate
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async CreateBooking(data, token) {
        try {
            const response = await axios.post(`${this.baseURL}add/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async ListBooking(token) {
        try {
            const response = await axios.get(`${this.baseURL}list/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }
    async DeleteBooking(token, bookingId){
        try {
            const response = await axios.delete(`${this.baseURL}delete/${bookingId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async ListCoupons(token) {
        try {
            const response = await axios.get(`${this.baseURL}list_coupons/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(error) {
        console.error('API error:', error);
        if (error.response) {
            return error.response.data;
        } else {
            return { error: "Can't connect to the server" };
        }
    }
}

export default new BookingAPI();
