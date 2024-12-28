import { useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Login from "./pages/Login";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/Rooms";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import Cookies from "js-cookie";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = Cookies.get("access"); // Kiểm tra token trong cookies
        return !!token;
    });

    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa token và trạng thái đăng nhập
        Cookies.remove("access");
        Cookies.remove("refresh");

        // Cập nhật trạng thái đăng nhập
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="flex h-screen overflow-hidden text-gray-100 bg-gray-900">
            {isLoggedIn && <Sidebar />}
            <div className={`flex-1 ${isLoggedIn ? "relative overflow-y-auto" : "absolute inset-0"}`}>
                <Routes basename="/login">
                    <Route
                        path="/login"
                        element={!isLoggedIn ? <Login onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/" />}
                    />
                    {isLoggedIn && (
                        <>
                            <Route path="/" element={<OverviewPage />} />
                            <Route path="/rooms" element={<ProductsPage />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/bookings" element={<OrdersPage />} />
                            <Route path="/sales" element={<SalesPage />} />
                            <Route path="/settings" element={<SettingsPage handleLogout={handleLogout} />} />
                        </>
                    )}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
