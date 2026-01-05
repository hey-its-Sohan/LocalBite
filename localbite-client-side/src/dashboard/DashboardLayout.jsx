import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Users,
  BarChart3,
  Settings,
  User,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  HelpCircle,
  PlusSquare,
  Store,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import Loading from "../components/Loading";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { user, signOutUser, loading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useUserRole();

  console.log("this is role", role);

  const [userData, setUserData] = useState({});

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-primary/10 text-primary border-l-4 border-primary"
        : "hover:bg-muted text-foreground/80"
    }`;

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/login");
  };

  // Protect route - only allow authenticated users
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  // Protect route - only allow cook or foodie roles to access dashboard
  useEffect(() => {
    if (!roleLoading && role && !["cook", "foodie", "admin"].includes(role)) {
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  // Fetch user profile
  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`http://localhost:3000/users/${user.uid}`)
      .then((res) => setUserData(res.data.user))
      .catch(() => console.error("Failed to load user data"));
  }, [user]);

  if (loading || roleLoading || !user) return <Loading />;

  // Don't render dashboard if user is not a cook or foodie
  if (!["cook", "foodie", "admin"].includes(role)) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background ">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border ">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu />
            </button>

            <NavLink
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                LB
              </div>
              <div>
                <h1 className="text-xl font-bold">LocalBite</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </NavLink>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <User />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userData?.fullName}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {role}
                  </p>
                </div>
                <ChevronDown
                  className={`transition ${userDropdownOpen && "rotate-180"}`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow z-50">
                  <NavLink
                    to="/dashboard/profile"
                    className="flex gap-3 px-4 py-3 hover:bg-muted"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={18} /> Profile
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="flex gap-3 px-4 py-3 text-error hover:bg-muted w-full"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative z-20 w-64 bg-card border-r border-border p-6 transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="space-y-2">
            <NavLink to="/dashboard" end className={linkClasses}>
              <LayoutDashboard /> Dashboard
            </NavLink>

            {(role === "foodie" || role === "admin") && (
              <>
                <NavLink to="/dashboard/my-orders" className={linkClasses}>
                  <ShoppingBag /> My Orders
                </NavLink>
              </>
            )}

            {(role === "cook" || role == "admin") && (
              <>
                <NavLink to="/dashboard/my-dishes" className={linkClasses}>
                  <Utensils /> My Dishes
                </NavLink>
                <NavLink to="/dashboard/add-dish" className={linkClasses}>
                  <PlusSquare /> Add Dish
                </NavLink>
                <NavLink to="/dashboard/orders" className={linkClasses}>
                  <ShoppingBag /> Orders
                </NavLink>
                <NavLink to="/dashboard/insights" className={linkClasses}>
                  <Users /> Insights
                </NavLink>
              </>
            )}

            {role === "admin" && (
              <>
                <NavLink to="/dashboard/users" className={linkClasses}>
                  <Users /> All Users
                </NavLink>

                <NavLink to="/dashboard/verify-request" className={linkClasses}>
                  <Settings /> Verify Request
                </NavLink>
              </>
            )}
            {role !== "admin" && (
              <NavLink to="/dashboard/verify" className={linkClasses}>
                <Settings /> Verify
              </NavLink>
            )}

            <NavLink to="/dashboard/profile" className={linkClasses}>
              <User /> My Profile
            </NavLink>
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3  text-error transition-colors w-full px-3 py-2 rounded-lg hover:bg-muted"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main */}
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 overflow-x-hidden">
          <div className="max-w-full">
            {/* Page Content */}
            <div className="bg-card border border-border rounded-xl p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
