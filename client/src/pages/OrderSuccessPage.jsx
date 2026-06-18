import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrderSuccessPage = () => {
  const location = useLocation();

  const orderId = location.state?.orderId;

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f1f3f6",
        padding: "20px",
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: "800px",
          width: "100%",
          background: "#fff",
          padding: "50px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            fontSize: "90px",
            marginBottom: "10px",
          }}
        >
          🎉
        </div>
        <h1
          style={{
            color: "#28a745",
            fontSize: "32px",
            lineHeight: "1.2",
            marginBottom: "15px",
          }}
        >
          Order Placed
          <br />
          Successfully!
        </h1>

        <p
          style={{
            color: "#555",
            fontSize: "20px",
            marginBottom: "10px",
          }}
        >
          Thank you for shopping with us.
        </p>

        <p
          style={{
            color: "#777",
            fontSize: "16px",
          }}
        >
          Your order has been received and is being processed.
        </p>

        <div
          style={{
            marginTop: "25px",
            background: "#f8f9fa",
            border: "1px solid #e5e5e5",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              color: "#333",
              marginBottom: "10px",
            }}
          >
            Order ID
          </h3>

          <p
            style={{
              color: "#2874f0",
              fontWeight: "bold",
              fontSize: "20px",
              letterSpacing: "1px",
            }}
          >
            {orderId ? `#${orderId.slice(-8).toUpperCase()}` : "Not Available"}
          </p>
        </div>

        <div
          style={{
            marginTop: "20px",
            color: "#28a745",
            fontWeight: "600",
            fontSize: "17px",
          }}
        >
          ✅ Your cart has been cleared successfully.
        </div>

        <div
          style={{
            marginTop: "15px",
            color: "#ff6b00",
            fontWeight: "600",
          }}
        >
          🚚 Estimated Delivery: 3 - 5 Business Days
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "35px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/products"
            style={{
              background: "#ff6b00",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            Continue Shopping
          </Link>

          <Link
            to="/orders"
            style={{
              background: "#2874f0",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
