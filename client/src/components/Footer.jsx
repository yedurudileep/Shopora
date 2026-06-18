import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-col">
          <h2 className="footer-logo">Shopora</h2>
          <p className="footer-desc">
            Your one-stop destination for trendy and
            affordable products.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/products">Products</Link>
            </li>

            <li>
              <Link to="/cart">Cart</Link>
            </li>

            <li>
              <Link to="/orders">My Orders</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h3>Support</h3>
          <ul>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>

            <li>
              <Link to="/faq">FAQ</Link>
            </li>

            <li>
              <Link to="/shipping-policy">
                Shipping Policy
              </Link>
            </li>

            <li>
              <Link to="/return-policy">
                Return Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-col">
          <h3>Connect</h3>

          <div className="social-links">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
              <span>LinkedIn</span>
            </a>
{/* 
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
              <span>Instagram</span>
            </a> */}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Shopora. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;