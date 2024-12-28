import { useState, useEffect } from "react";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import OrdersTable from "../components/orders/OrdersTable";

import BookingAPI from "../api/booking";
import Cookies from "js-cookie";

const OrdersPage = () => {
	const [totalBookings, setTotalBookings] = useState(0);
	const [paidBookings, setPaidBookings] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBookings = async () => {
			const token = Cookies.get("access"); // Lấy token từ cookie

			if (!token) {
				setError("No token found");
				setLoading(false);
				return;
			}

			try {
				const response = await BookingAPI.ListBooking(token); 

				if (Array.isArray(response)) {
					const total = response.length;
					const paid = response.filter(booking => booking.payment_status === "paid").length;

					setTotalBookings(total);
					setPaidBookings(paid);
				} else {
					setError("Invalid booking data");
				}
			} catch (error) {
				setError("Failed to fetch bookings");
			} finally {
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title={"Orders"} />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name="Total Bookings"
						icon={ShoppingBag}
						value={totalBookings.toString()}
						color="#6366F1"
					/>
					<StatCard
						name="Paid Bookings"
						icon={CheckCircle}
						value={paidBookings.toString()}
						color="#10B981"
					/>
				</motion.div>
				{/* <div className='grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2'>
					<DailyOrders />
					<OrderDistribution />
				</div> */}
				<OrdersTable />

			</main>
		</div>
	);
};
export default OrdersPage;
