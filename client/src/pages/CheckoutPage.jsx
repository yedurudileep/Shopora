import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../css/CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;

  // If Buy Now is clicked → only that item
  // Otherwise → use cart items
  const checkoutItems = buyNowItem
    ? [buyNowItem]
    : cartItems;

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate("/cart");
      return;
    }

    const calculateTotal = async () => {
      let total = 0;

      for (const item of checkoutItems) {
        try {
          const res = await axios.get(
            `https://dummyjson.com/products/${item.id}`
          );

          const product = res.data;

          const discountPrice =
            product.price -
            (product.price * product.discountPercentage) / 100;

          total += discountPrice * item.quantity;
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }

      setTotalAmount(total);
    };

    calculateTotal();
  }, [checkoutItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!totalAmount || totalAmount <= 0) {
      alert("Invalid order amount");
      return;
    }

    if (formData.fullName.trim().length < 3) {
      alert("Please enter a valid full name");
      return;
    }

    if (formData.address.trim().length < 5) {
      alert("Please enter a valid address");
      return;
    }

    if (formData.city.trim().length < 2) {
      alert("Please enter a valid city");
      return;
    }

    if (formData.postalCode.trim().length < 4) {
      alert("Please enter a valid postal code");
      return;
    }

    if (formData.country.trim().length < 2) {
      alert("Please enter a valid country");
      return;
    }

    try {
      const orderData = {
        products: checkoutItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: formData,
        totalAmount,
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      navigate("/order-success", {
        state: {
          orderId: response.data.order._id,
        },
      });

      // Clear cart only for normal cart checkout
      if (!buyNowItem) {
        setTimeout(() => {
          clearCart();
        }, 100);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Failed to place order. " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="checkout-container">
      {/* Shipping Form */}
      <div className="card checkout-form-section">
        <h2>Shipping Address</h2>

        <form onSubmit={placeOrder}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              className="form-control"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block mt-2"
          >
            Place Order - $
            {Number(totalAmount || 0).toFixed(2)}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="card checkout-summary">
        <h2>Order Summary</h2>

        <p>
          You have{" "}
          <strong>{checkoutItems.length}</strong>{" "}
          item(s) in this order.
        </p>

        <div className="summary-total mt-2">
          <h3>
            Total to Pay: $
            {Number(totalAmount || 0).toFixed(2)}
          </h3>
        </div>

        <div className="payment-method mt-2">
          <h4>Payment Method</h4>
          <p style={{ color: "var(--text-muted)" }}>
            Cash on Delivery (Default)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;