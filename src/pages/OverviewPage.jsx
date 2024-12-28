import { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart"
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import BookingAPI from "../api/booking"
import CustomerAPI from "../api/customer"
import RoomTypeAPI from "../api/roomtype";
import Cookies from "js-cookie";

const OverviewPage = () => {

	const [totalSales, setTotalSales] = useState(0);
	const [totalBookings, setTotalBookings] = useState(0);
	const [totalCustomers, setTotalCustomers] = useState(0);
	const [totalRoomTypes, setTotalRoomTypes] = useState(0);
	const [loading, setLoading] = useState(true);
	const token = Cookies.get("access");
	useEffect(() => {
		const fetchData = async () => {

			try {
				// Fetching all bookings data
				const bookingsData = await BookingAPI.ListBooking(token);
				console.log(bookingsData)

				const sales = bookingsData
					.map(booking => parseFloat(booking.total) || 0)
					.reduce((acc, currentTotal) => acc + currentTotal, 0);
				const bookingsCount = bookingsData.length;

				setTotalSales(sales);
				setTotalBookings(bookingsCount);
			} catch (error) {
				console.error("Error fetching booking data", error);
			} finally {
				setLoading(false);
			}
		};
		const fetchCustomers = async () => {
			try {
				const customersResponse = await CustomerAPI.getCustomers(token);
				setTotalCustomers(customersResponse.length);  // Lưu số lượng khách hàng
			} catch (error) {
				console.error("Error fetching customers:", error);
			}
		};
		const fetchRoomTypes = async () => {
			try {
				const roomTypeAPI = new RoomTypeAPI();
				const roomTypesResponse = await roomTypeAPI.getRoomTypes(token);
				console.log("siuuuuu: "+ roomTypesResponse)
				setTotalRoomTypes(roomTypesResponse.length);  // Lưu số lượng loại phòng
			} catch (error) {
				console.error("Error fetching room types:", error);
			}
		};

		fetchData();
		fetchCustomers();
		fetchRoomTypes();
	}, [token]);

	if (loading) {
		return <div>Loading...</div>;
	}


	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title='Overview' />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Sales' icon={Zap} value={`$${totalSales.toFixed(2)}`} color='#6366F1' />
					<StatCard name='Total Bookings' icon={BarChart2} value={totalBookings} color='#10B981' />
					<StatCard name='Total Users' icon={Users} value={totalCustomers} color='#8B5CF6' />
					<StatCard name='Total RoomTypes' icon={ShoppingBag} value={totalRoomTypes} color='#EC4899' />

				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2'>
					<CategoryDistributionChart />
					<SalesByCategoryChart />
				</div>
				<SalesOverviewChart />
			</main>
		</div>
	);
};
export default OverviewPage;
