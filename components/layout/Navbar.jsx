// components/layout/Navbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/lib/auth";
import {
  HiOutlineHome,
  HiOutlineBookmark,
  HiOutlineUser,
  HiOutlinePlus,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineUserPlus,
  HiXMark,
  HiBars3,
} from "react-icons/hi2";
import "@/styles/navbar.css";

export default function Navbar() {
  const { user, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logOut();
    setMenuOpen(false);
    router.push("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar__container">
          <Link href="/" className="navbar__logo" onClick={closeMenu}>
            Dwe<span>lla</span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar__links">
            <Link href="/listings" className={pathname === "/listings" ? "active" : ""}>Browse</Link>
            {userRole === "landlord" && (
              <Link href="/add-listing" className={pathname === "/add-listing" ? "active" : ""}>Add Listing</Link>
            )}
            <Link href="/saved-listings" className={pathname === "/saved-listings" ? "active" : ""}>Saved</Link>
          </div>

          {/* Desktop Auth */}
          <div className="navbar__auth">
            {user ? (
              <div className="navbar__user">
                <span className="navbar__username">👋 {user.displayName?.split(" ")[0]}</span>
                <button onClick={handleLogout} className="navbar__logout">Log Out</button>
              </div>
            ) : (
              <>
                <Link href="/login" className="navbar__login">Log In</Link>
                <Link href="/signup" className="navbar__signup">Sign Up</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiXMark /> : <HiBars3 />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="navbar__overlay" onClick={closeMenu} />
      )}

      {/* Mobile Menu Drawer */}
      <div className={"navbar__drawer" + (menuOpen ? " open" : "")}>
        <div className="navbar__drawer-header">
          <p className="navbar__drawer-logo">Dwe<span>lla</span></p>
          {user && (
            <p className="navbar__drawer-user">👋 {user.displayName?.split(" ")[0]}</p>
          )}
        </div>

        <div className="navbar__drawer-links">
          <Link href="/" className="navbar__drawer-link" onClick={closeMenu}>
            <HiOutlineHome />
            <span>Home</span>
          </Link>
          <Link href="/listings" className="navbar__drawer-link" onClick={closeMenu}>
            <HiOutlineHome />
            <span>Browse Listings</span>
          </Link>
          {userRole === "landlord" && (
            <Link href="/add-listing" className="navbar__drawer-link" onClick={closeMenu}>
              <HiOutlinePlus />
              <span>Add Listing</span>
            </Link>
          )}
          <Link href="/saved-listings" className="navbar__drawer-link" onClick={closeMenu}>
            <HiOutlineBookmark />
            <span>Saved Listings</span>
          </Link>
        </div>

        <div className="navbar__drawer-auth">
          {user ? (
            <button className="navbar__drawer-logout" onClick={handleLogout}>
              <HiOutlineArrowRightOnRectangle />
              <span>Log Out</span>
            </button>
          ) : (
            <>
              <Link href="/login" className="navbar__drawer-login" onClick={closeMenu}>
                <HiOutlineArrowLeftOnRectangle />
                <span>Log In</span>
              </Link>
              <Link href="/signup" className="navbar__drawer-signup" onClick={closeMenu}>
                <HiOutlineUserPlus />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}