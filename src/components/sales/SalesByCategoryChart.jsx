import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import BookingAPI from '../../api/booking';
import Cookies from 'js-cookie';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = () => {

	const [paymentData, setPaymentData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); // Thêm biến lỗi để hiển thị lỗi nếu có

	useEffect(() => {
		const fetchBookings = async () => {
			const token = Cookies.get('access');
			if (!token) {
				setError("No token found");
				setLoading(false);
				return;
			}

			try {
				const response = await BookingAPI.ListBooking(token);

				if (!Array.isArray(response)) {
					setError("Invalid booking data");
					setLoading(false);
					return;
				}

				// Lấy mảng các trạng thái payment_status
				const statuses = response.map((booking) => booking.payment_status.toLowerCase());

				// Đếm số lượng từng trạng thái bằng filter
				const statusCount = {
					Expired: statuses.filter(status => status === "expired").length,
					Paid: statuses.filter(status => status === "paid").length,
					Canceled: statuses.filter(status => status === "canceled").length,
					Initiated: statuses.filter(status => status === "initiated").length,
					Refunded: statuses.filter(status => status === "refunded").length,
				};

				// Chuyển đổi dữ liệu thành mảng cho biểu đồ
				const chartData = Object.entries(statusCount).map(([name, value]) => ({
					name,
					value,
				}));

				setPaymentData(chartData); // Cập nhật dữ liệu biểu đồ
			} catch (error) {
				console.error("Failed to fetch bookings:", error);
				setError("Failed to fetch bookings");
			} finally {
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);


	// useEffect chỉ chạy khi component mount lần đầu tiên

	if (loading) {
		return <div>Loading...</div>;  // Hiển thị loading khi chưa có dữ liệu
	}

	if (error) {
		return <div>{error}</div>;  // Hiển thị lỗi nếu có
	}

	return (
		<motion.div
			className='p-6 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='mb-4 text-xl font-semibold text-gray-100'>Sales by Category</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={paymentData}
							cx='50%'
							cy='50%'
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{paymentData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SalesByCategoryChart;
