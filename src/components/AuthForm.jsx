import { useState, useMemo } from "react";
import { loginUser, registerUser } from "../api/tasks";
import toast from "react-hot-toast";

export default function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Validasi real-time
  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }), [password]);

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const errors = {};
    if (!isEmailValid) errors.email = "Format email tidak valid";
    
    if (!isLogin && !isPasswordValid) {
      errors.password = "Password belum memenuhi semua syarat";
    }
    
    if (isLogin && password.length === 0) {
      errors.password = "Password wajib diisi";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setFieldErrors({});
      
      if (isLogin) {
        const data = await loginUser(email, password);
        localStorage.setItem("token", data.access_token);
        toast.success("Berhasil masuk!");
        onAuthSuccess();
      } else {
        await registerUser(email, password);
        toast.success("Registrasi berhasil! Silakan login.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      let msg = "Terjadi kesalahan. Coba lagi.";
      
      // Handle Pydantic validation error (422)
      if (Array.isArray(detail)) {
        msg = detail.map((e) => e.msg).join(", ");
      } else if (typeof detail === "string") {
        msg = detail;
      }
      
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Indikator kekuatan password
  const PasswordCheck = ({ ok, label }) => (
    <div className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-600" : "text-slate-400"}`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        {ok ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        )}
      </svg>
      {label}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto mt-20 animate-fade-in-up">
      <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-glass border border-white/60 p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-brand-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            {isLogin ? "Selamat Datang" : "Buat Akun"}
          </h1>
          <p className="text-brand-600/80 mt-2 text-sm">
            {isLogin ? "Masuk untuk mengelola tugas Anda" : "Daftar untuk mulai mencatat tugas"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anda@email.com"
              required
              className={`w-full bg-white border rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.email
                  ? "border-red-300 focus:ring-red-400"
                  : "border-slate-200 focus:ring-brand-500"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full bg-white border rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.password
                  ? "border-red-300 focus:ring-red-400"
                  : "border-slate-200 focus:ring-brand-500"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
            
            {/* Indikator kekuatan password (hanya di mode Register) */}
            {!isLogin && password.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <PasswordCheck ok={passwordChecks.length} label="8+ karakter" />
                <PasswordCheck ok={passwordChecks.uppercase} label="Huruf besar" />
                <PasswordCheck ok={passwordChecks.lowercase} label="Huruf kecil" />
                <PasswordCheck ok={passwordChecks.number} label="Angka" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition-all shadow-brand-md"
          >
            {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setPassword("");
              setFieldErrors({});
            }}
            className="text-sm text-brand-600 hover:text-brand-800 font-medium hover:underline transition-all"
          >
            {isLogin ? "Belum punya akun? Daftar di sini" : "Sudah punya akun? Masuk di sini"}
          </button>
        </div>

      </div>
    </div>
  );
}