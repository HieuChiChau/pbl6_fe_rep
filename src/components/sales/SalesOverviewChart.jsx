import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Cookies from "js-cookie";
import BookingAPI from "../../api/booking"; // API của bạn

const SalesOverviewChart = () => {
	const [bookingData, setBookingData] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchBookingData = async () => {
			const token = Cookies.get("access"); // Lấy token từ cookie

			if (!token) {
				console.error("No token found");
				setLoading(false);
				return;
			}

			try {
				const response = await BookingAPI.ListBooking(token); // Gọi API để lấy danh sách booking
				if (Array.isArray(response)) {
					setBookingData(response); // Lưu dữ liệu vào state
				} else {
					console.error("Invalid booking data");
				}
			} catch (error) {
				console.error("Failed to fetch booking data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBookingData();
	}, []);

	// Bước 2: Xử lý dữ liệu bookings để nhóm theo ngày (hoặc tuần)
	const processBookingData = () => {
		const salesByMonth = {};
		bookingData.forEach((booking) => {
			const checkInDate = new Date(booking.check_in_date);
			const monthKey = `${checkInDate.getFullYear()}-${checkInDate.getMonth() + 1}`; // Lấy năm và tháng

			if (salesByMonth[monthKey]) {
				salesByMonth[monthKey] += parseFloat(booking.total); // Cộng thêm doanh thu cho tháng đó
			} else {
				salesByMonth[monthKey] = parseFloat(booking.total); // Khởi tạo doanh thu cho tháng mới
			}
		});

		// Chuyển dữ liệu thành mảng cho biểu đồ
		return Object.keys(salesByMonth).map((monthKey) => ({
			date: monthKey,
			sales: salesByMonth[monthKey],
		}));
	};


	const chartData = processBookingData();

	return (
		<motion.div
			className="p-6 mb-8 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Sales Overview</h2>

				<button className="px-3 py-1 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
					Months
				</button>
			</div>

			{loading ? (
				<div className="text-center text-gray-100">Loading...</div>
			) : (
				<div className="w-full h-80">
					<ResponsiveContainer>
						<AreaChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
							<XAxis dataKey="date" stroke="#9CA3AF" />
							<YAxis stroke="#9CA3AF" />
							<Tooltip
								contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
								itemStyle={{ color: "#E5E7EB" }}
							/>
							<Area type="monotone" dataKey="sales" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
						</AreaChart>
					</ResponsiveContainer>
				</div>
			)}
		</motion.div>
	);
};

export default SalesOverviewChart;
