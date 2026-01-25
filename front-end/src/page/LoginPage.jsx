// src/page/LoginPage.jsx
import { useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        try {
            const res = await api.post("/auth/login", { username, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            if (res.data.role === "ADMIN") navigate("/admin");
            else navigate("/kitchen");
        } catch {
            alert("เข้าสู่ระบบไม่สำเร็จ");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-orange-500">
                    🍜 Admin / Kitchen Login
                </h1>

                <input
                    className="w-full border p-3 rounded mb-3"
                    placeholder="Username"
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full border p-3 rounded mb-4"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    onClick={login}
                    className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition"
                >
                    เข้าสู่ระบบ
                </button>
            </div>
        </div>
    );
}
