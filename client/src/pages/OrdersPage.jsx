import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useContext(AuthContext);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return {
          color: "#28a745",
          icon: "🟢",
        };

      case "Processing":
        return {
          color: "#fd7e14",
          icon: "🟠",
        };

      case "Shipped":
        return {
          color: "#0d6efd",
          icon: "🔵",
        };

      case "Delivered":
        return {
          color: "#198754",
          icon: "✅",
        };

      default:
        return {
          color: "#6c757d",
          icon: "⚪",
        };
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data);
      } catch (error) {
        console.error("Fetch Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div
        className="card text-center"
        style={{ padding: "40px" }}
      >
        <h2>No Orders Found</h2>

        <p
          className="mt-1"
          style={{
            color: "var(--text-muted)",
          }}
        >
          You haven't placed any orders yet.
        </p>

        <Link
          to="/products"
          className="btn btn-primary mt-2"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2 className="mb-2">My Orders</h2>

      {orders.map((order) => {
        const statusStyle = getStatusStyle(
          order.status
        );

        return (
          <div
            key={order._id}
            className="card mb-2"
            style={{
              borderLeft:
                "4px solid var(--primary)",
            }}
          >
            {/* Top Section */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                borderBottom:
                  "1px solid #e0e0e0",
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              <div>
                <strong>
                  Order ID: #
                  {order._id
                    .slice(-8)
                    .toUpperCase()}
                </strong>

                <br />

                <span
                  style={{
                    fontSize: "13px",
                    color:
                      "var(--text-muted)",
                  }}
                >
                  Placed on{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    color:
                      statusStyle.color,
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  {statusStyle.icon}{" "}
                  {order.status}
                </div>

                <strong>Total:</strong>{" "}
                ₹
                {order.totalAmount
                  ? order.totalAmount.toFixed(
                      2
                    )
                  : "0.00"}
              </div>
            </div>

            {/* Shipping */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <strong>
                Shipping To:
              </strong>

              <div
                style={{
                  marginTop: "8px",
                  lineHeight: "1.7",
                }}
              >
                {order
                  .shippingAddress
                  ?.fullName ||
                  "N/A"}
                <br />

                {order
                  .shippingAddress
                  ?.city || "N/A"}
                <br />

                {order
                  .shippingAddress
                  ?.country ||
                  "N/A"}
              </div>
            </div>

            {/* Products */}
            <div>
              <strong>Items:</strong>

              <div
                style={{
                  marginTop: "8px",
                  lineHeight: "1.8",
                }}
              >
                {order.products?.map(
                  (item) => (
                    <div
                      key={
                        item.productId
                      }
                    >
                      •{" "}
                      {item.title ||
                        `Product #${item.productId}`}{" "}
                      ×{" "}
                      {item.quantity}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersPage;