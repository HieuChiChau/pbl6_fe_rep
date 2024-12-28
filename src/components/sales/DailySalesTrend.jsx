import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Cookies from "js-cookie"; // Đảm bảo bạn đã cài đặt js-cookie để lấy token

import BookingAPI from "../../api/booking"; // API để fetch dữ liệu booking

const DailySalesTrend = () => {
  const [dailySalesData, setDailySalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch danh sách bookings và tính doanh thu theo ngày check_in_date
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
          const salesByDay = {};

          response.forEach((booking) => {
            const checkInDate = new Date(booking.check_in_date);
            const dayOfWeek = checkInDate.toLocaleString("en-US", { weekday: "short" });
            const total = parseFloat(booking.total);

            if (salesByDay[dayOfWeek]) {
              salesByDay[dayOfWeek] += total; 
            } else {
              salesByDay[dayOfWeek] = total;
            }
          });

          // Chuyển đổi salesByDay thành định dạng cho biểu đồ
          const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
            name: day,
            sales: salesByDay[day] || 0, // Nếu không có doanh thu cho ngày đó thì gán bằng 0
          }));

          setDailySalesData(chartData);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <motion.div
      className="p-6 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-100">Daily Sales Trend</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Bar dataKey="sales" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailySalesTrend;
