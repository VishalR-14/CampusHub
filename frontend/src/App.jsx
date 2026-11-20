
import { useState } from "react";
import StudentDirectory from "./StudentDirectory";
import StudentRegistration from "./StudentRegistration";
import AdminDashboard from "./AdminDashboard";
import Events from "./Events";
import Clubs from "./Clubs";
import Login from "./Login";
import Announcements from "./Announcements";
import Profile from "./Profile";
import EventRegistration from "./EventRegistration";

import {
  LayoutDashboard, CalendarDays, Users, Megaphone,
  UserRound, Settings, Search, Bell, GraduationCap,
  Menu, X, ChevronRight, BookOpen, LogOut, UserPlus,
  ArrowUpRight, Ticket
} from "lucide-react";

import "./App.css";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Admin Dashboard", icon: GraduationCap },
  { name: "Events", icon: CalendarDays },
  { name: "Event Registration", icon: Ticket },
  { name: "Clubs", icon: Users },
  { name: "Announcements", icon: Megaphone },
  { name: "My Profile", icon: UserRound },
  { name: "Register Student", icon: UserPlus },
  { name: "Student Directory", icon: GraduationCap },
];

function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setUser(null);
    setActive("Dashboard");
  };

  if (!user) return <Login onLogin={setUser} />;

  const initials = (user.fullName || "Student")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>
          <div>
            <h2>CampusHub</h2>
            <span>STUDENT PORTAL</span>
          </div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}>
            <X />
          </button>
        </div>

        <div className="nav-label">MAIN MENU</div>

        <nav>
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${active === item.name ? "active" : ""}`}
                onClick={() => {
                  setActive(item.name);
                  setMobileMenu(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {active === item.name && <ChevronRight size={16} />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <BookOpen size={19} />
            </div>
            <strong>Need help?</strong>
            <p>Contact your campus support team.</p>
            <button onClick={() => setActive("Support")}>
              Get support <ArrowUpRight size={14} />
            </button>
          </div>

          <button
            className="nav-item settings-item"
            onClick={() => setActive("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="user-mini">
            <div className="avatar">{initials}</div>
            <div className="user-mini-info">
              <strong>{user.fullName}</strong>
              <span>Student Account</span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setMobileMenu(true)}
            >
              <Menu />
            </button>

            <div>
              <div className="breadcrumb">
                Pages / <strong>{active}</strong>
              </div>
              <h2>{active}</h2>
            </div>
          </div>

          <div className="topbar-right">
            <label className="search-box">
              <Search size={18} />
              <input placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </label>

            <button className="notification-btn">
              <Bell size={19} />
              <i />
            </button>

            <div className="top-avatar">{initials}</div>
          </div>
        </header>

        {active === "Dashboard" ? (
          <div className="page-content">
            <div className="placeholder-page">
              <div className="placeholder-icon">
                <GraduationCap size={34} />
              </div>

              <h1>Welcome, {user.fullName} 👋</h1>

              <p>
                Welcome to CampusHub. Access your campus services and activities.
              </p>

              <button
                className="primary-btn"
                onClick={() => setActive("Admin Dashboard")}
              >
                Open Admin Dashboard <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        ) : active === "My Profile" ? (
          <div className="page-content">
            <Profile user={user} />
          </div>
        ) : active === "Admin Dashboard" ? (
          <div className="page-content">
            <AdminDashboard />
          </div>
        ) : active === "Events" ? (
          <div className="page-content">
            <Events />
          </div>
        ) : active === "Clubs" ? (
          <div className="page-content">
            <Clubs />
          </div>
        ) : active === "Announcements" ? (
          <div className="page-content">
            <Announcements />
          </div>
        ) : active === "Register Student" ? (
          <div className="page-content">
            <StudentRegistration />
          </div>
        ) : active === "Student Directory" ? (
          <div className="page-content">
            <StudentDirectory />
          </div>
          ) : active === "Event Registration" ? (
  <div className="page-content">
    <EventRegistration />
  </div>
        ) : (
          <div className="placeholder-page">
            <div className="placeholder-icon">
              <GraduationCap size={34} />
            </div>
            <h1>{active}</h1>
            <p>
              This module is coming soon. It will be connected to the CampusHub backend.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
