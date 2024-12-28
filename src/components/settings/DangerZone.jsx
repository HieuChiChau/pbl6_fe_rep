import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const DangerZone = ({ handleLogout }) => {
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const logout = () => {
        // Thực hiện logout và chuyển hướng về login
        handleLogout();
        setSuccessMessage("Logout successful!");
    };

    return (
        <motion.div
            className="p-6 mb-8 bg-red-900 bg-opacity-50 border border-red-700 shadow-lg backdrop-filter backdrop-blur-lg rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex items-center mb-4">
                <Trash2 className="mr-3 text-red-400" size={24} />
                <h2 className="text-xl font-semibold text-gray-100">Danger Zone</h2>
            </div>
            <p className="mb-4 text-gray-300">
                Permanently delete your account and all of your content.
            </p>
            <button
                onClick={logout}
                className="px-4 py-2 font-bold text-white transition duration-200 bg-red-600 rounded hover:bg-red-700"
            >
                Log Out
            </button>
            {successMessage && <p className="mt-4 text-green-300">{successMessage}</p>}
        </motion.div>
    );
};

export default DangerZone;
