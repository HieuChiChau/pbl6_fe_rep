import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie"; // Đảm bảo bạn đã cài đặt js-cookie để lấy token

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { DollarSign } from "lucide-react";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import PaymentStatusChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";
import BookingAPI from "../api/booking"; // Giả sử bạn có API này để fetch dữ liệu booking

const SalesPage = () => {
  const [totalRevenue, setTotalRevenue] = useState("$0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch danh sách bookings và tính tổng doanh thu
  useEffect(() => {
    const fetchBookings = async () => {
      const token = Cookies.get("access"); // Lấy token từ cookie

      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await BookingAPI.ListBooking(token); // Gọi API để lấy danh sách booking


        if (Array.isArray(response)) {
          const total = response.reduce((sum, booking) => {
            return sum + parseFloat(booking.total); // Cộng dồn giá trị của 'total'
          }, 0);

          // Cập nhật tổng doanh thu
          setTotalRevenue(total.toFixed(2)); // Đảm bảo là số thập phân 2 chữ số
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

  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Sales Dashboard" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        {/* SALES STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={`$${totalRevenue}`}
            color="#6366F1"
          />
        </motion.div>

        {/* Biểu đồ và các thông tin khác */}
        <SalesOverviewChart />
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          <PaymentStatusChart />
          <DailySalesTrend />
        </div>
      </main>
    </div>
  );
};

export default SalesPage;
