import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import changePassword from "../../api/password"
import Cookies from 'js-cookie'
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
const Security = () => {
	const [twoFactor, setTwoFactor] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const toggleForm = () => {
		setShowForm(!showForm);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp."); 
		} else {
			const token = Cookies.get("access");

			try {
				const response = await changePassword(token, currentPassword, newPassword, confirmPassword);
				toast.success(response.message || "Change Password Successfully!"); 
			} catch (error) {
				toast.error(error.response?.data?.error || "Server Error.");
			}
		}
	};

	return (
		<SettingSection icon={Lock} title={"Security"}>
			<ToggleSwitch
				label={"Two-Factor Authentication"}
				isOn={twoFactor}
				onToggle={() => setTwoFactor(!twoFactor)}
			/>

			<div className='mt-4'>
				<button
					onClick={toggleForm}
					className='px-4 py-2 font-semibold text-white transition duration-200 bg-indigo-600 rounded hover:bg-indigo-700'
				>
					Change Password
				</button>
			</div>

			{/* Hiển thị form đổi mật khẩu nếu showForm là true */}
			{showForm && (
				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div className="mb-4">
						<label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Current Password</label>
						<input
							type="password"
							id="current-password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className="block w-full px-4 py-2 text-sm text-white border-gray-300 rounded-lg shadow-sm sm:w-96 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-500"
							placeholder="Current Password"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">New Password</label>
						<input
							type="password"
							id="new-password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="block w-full px-4 py-2 text-sm text-white border-gray-300 rounded-lg shadow-sm sm:w-96 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-500"
							placeholder="New Password"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Confirm Password</label>
						<input
							type="password"
							id="confirm-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="block w-full px-4 py-2 text-sm text-white border-gray-300 rounded-lg shadow-sm sm:w-96 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-500"
							placeholder="Confirm Password"
							required
						/>
					</div>
					<div className="flex justify-end">
						<button
							type="submit"
							className="px-6 py-2 text-white bg-indigo-600 rounded shadow-md hover:bg-indigo-700"
						>
							Save
						</button>
					</div>
				</form>
			)}
		</SettingSection>
	);
};

export default Security;