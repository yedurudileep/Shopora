import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { FiMenu, FiX } from "react-icons/fi";
import "../css/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Mobile Menu Button */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => setMenuOpen(false)}
        >
          Shopora
        </Link>

        {/* Search */}
        <form
          className="navbar-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          <button type="submit">Search</button>
        </form>

        {/* Links */}
        <ul
          className={`navbar-links ${
            menuOpen ? "show-menu" : ""
          }`}
        >
          {user ? (
            <li className="dropdown">
              <span className="dropdown-title">
                {user.name}
              </span>

              <div className="dropdown-menu">
                <Link
                  to="/profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Orders
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Wishlist
                </Link>

                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="btn btn-outline"
                style={{
                  padding: "5px 20px",
                  backgroundColor: "#fff",
                  color: "var(--primary)",
                }}
              >
                Login
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/cart"
              className="cart-link"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <span className="cart-icon">
                🛒
              </span>

              <span>Cart</span>

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;