import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="card text-center" style={{ padding: "40px" }}>
        <h2>No Orders Found</h2>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          You haven't placed any orders yet.
        </p>
        <Link to="/products" className="btn btn-primary mt-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2 className="mb-2">My Orders</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          className="card mb-2"
          style={{ borderLeft: "4px solid var(--primary)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #e0e0e0",
              paddingBottom: "10px",
              marginBottom: "15px",
            }}
          >
            <div>
              <strong>Order ID:</strong> {order._id}
              <br />
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    order.status === "Delivered"
                      ? "var(--success)"
                      : "var(--secondary)",
                }}
              >
                {order.status}
              </span>
              <br />
              <strong>Total:</strong> $
              {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
            </div>
          </div>
          <div>
            <p>
              <strong>Shipping To:</strong>{" "}
              {order.shippingAddress?.fullName || "N/A"},{" "}
              {order.shippingAddress?.address || "N/A"},{" "}
              {order.shippingAddress?.city || "N/A"}
            </p>
            <p className="mt-1">
              <strong>Items:</strong> {order.products?.length || 0}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
