import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  MessageSquare,
  LogOut,
  FilePlus2,
  CheckSquare,
  Users,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import PegawaiDashboard from "./PegawaiDashboard";
import AdminInventaris from "./AdminInventaris";
import AdminJadwal from "./AdminJadwal";
import AdminPBG from "./AdminPBG";
import AdminVerifikasi from "./AdminVerifikasi";
import AdminPegawai from "./AdminPegawai";
import PegawaiJadwal from "./PegawaiJadwal";
import PegawaiTiket from "./PegawaiTiket";
import PegawaiProfil from "./PegawaiProfil";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  const navItemClass = (path) => {
    const isActive =
      location.pathname === path ||
      (path !== "/dashboard" && location.pathname.startsWith(path));
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-blue-100 hover:bg-blue-800 hover:text-white"
    }`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#f4f7fe] overflow-hidden font-sans">
      {/* Top Global Header - Matching the Mockup */}
      <header className="h-[72px] bg-[#0c2859] text-white flex items-center justify-between relative overflow-hidden shrink-0 shadow-md z-30">
        <div className="flex items-center px-6">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M9 8h1" />
              <path d="M9 12h1" />
              <path d="M9 16h1" />
              <path d="M14 8h1" />
              <path d="M14 12h1" />
              <path d="M14 16h1" />
              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {isAdmin ? "Admin (Sekretariat)" : "Pegawai (PTSP & PM)"}
            </h1>
            <p className="text-[11px] text-blue-200">
              {isAdmin
                ? "Akses penuh - Manajemen Sistem & Seluruh Data"
                : "Akses Terbatas - Lihat Jadwal, Upload Bukti, Buat Tiket"}
            </p>
          </div>
        </div>

        {/* Right side diagonal styling */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 bottom-0 w-[500px] bg-[#092047] transform -skew-x-[30deg]"></div>
          <div className="absolute right-64 top-0 bottom-0 w-8 bg-yellow-400 transform -skew-x-[30deg]"></div>
        </div>

        <div className="relative z-10 px-8 text-right hidden md:block">
          <h2 className="text-xl font-bold tracking-wide">SIMOP</h2>
          <p className="text-[9px] uppercase tracking-wider text-blue-200 leading-tight">
            Sistem Informasi Operasional dan Pelayanan
            <br />
            DPMPTSP Kab. Karawang
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b2149] text-white flex flex-col z-20">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 font-bold overflow-hidden border-2 border-blue-500/30">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt="avatar"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-blue-300">
                  {isAdmin ? "Super Admin" : "PTSP & PM"}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2">
            <Link to="/dashboard" className={navItemClass("/dashboard")}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/dashboard/inventaris"
                  className={navItemClass("/dashboard/inventaris")}
                >
                  <Package size={18} /> Manajemen Inventaris
                </Link>
                <Link
                  to="/dashboard/jadwal"
                  className={navItemClass("/dashboard/jadwal")}
                >
                  <CalendarDays size={18} /> Penjadwalan
                </Link>
                <Link
                  to="/dashboard/verifikasi"
                  className={navItemClass("/dashboard/verifikasi")}
                >
                  <CheckSquare size={18} /> Verifikasi Laporan
                </Link>
                <Link
                  to="/dashboard/pbg"
                  className={navItemClass("/dashboard/pbg")}
                >
                  <MessageSquare size={18} /> PBG & Bot WA
                </Link>
                <Link
                  to="/dashboard/pegawai"
                  className={navItemClass("/dashboard/pegawai")}
                >
                  <Users size={18} /> Manajemen Pegawai
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard/jadwal-pegawai"
                  className={navItemClass("/dashboard/jadwal-pegawai")}
                >
                  <CalendarDays size={18} /> Jadwal Tugas
                </Link>
                <Link
                  to="/dashboard/lapor"
                  className={navItemClass("/dashboard/lapor")}
                >
                  <FilePlus2 size={18} /> Pengajuan Barang
                </Link>
                <Link
                  to="/dashboard/profil"
                  className={navItemClass("/dashboard/profil")}
                >
                  <Users size={18} /> Notifikasi & Profil
                </Link>
              </>
            )}
          </nav>

          <div className="p-4 mt-auto border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-blue-200 hover:text-white transition-colors font-medium text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative p-6">
          <div className="max-w-[1600px] mx-auto min-h-full">
            <Routes>
              <Route
                path="/"
                element={
                  isAdmin ? (
                    <AdminDashboard user={user} />
                  ) : (
                    <PegawaiDashboard user={user} />
                  )
                }
              />

              {isAdmin && (
                <>
                  <Route path="/inventaris" element={<AdminInventaris />} />
                  <Route path="/jadwal" element={<AdminJadwal />} />
                  <Route path="/verifikasi" element={<AdminVerifikasi />} />
                  <Route path="/pbg" element={<AdminPBG />} />
                  <Route path="/pegawai" element={<AdminPegawai />} />
                </>
              )}

              <Route path="/jadwal-pegawai" element={<PegawaiJadwal />} />
              <Route path="/lapor" element={<PegawaiTiket />} />
              <Route path="/profil" element={<PegawaiProfil />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
