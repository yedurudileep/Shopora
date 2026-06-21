import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../css/CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } =
    useContext(CartContext);
  const { token } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem =
    location.state?.buyNowItem;

  // Buy Now → one item
  // Cart Checkout → all cart items
  const checkoutItems = buyNowItem
    ? [buyNowItem]
    : cartItems;

  const [formData, setFormData] =
    useState({
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    });

  const [totalAmount, setTotalAmount] =
    useState(0);

  const [
    paymentCompleted,
    setPaymentCompleted,
  ] = useState(false);

  useEffect(() => {
    if (
      checkoutItems.length === 0 &&
      !paymentCompleted
    ) {
      navigate("/cart");
      return;
    }

    const total =
      checkoutItems.reduce(
        (sum, item) =>
          sum +
          (item.price || 0) *
            item.quantity,
        0
      );

    setTotalAmount(total);
  }, [
    checkoutItems,
    navigate,
    paymentCompleted,
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (
      checkoutItems.length === 0
    ) {
      alert("Your cart is empty");
      return;
    }

    if (
      !totalAmount ||
      totalAmount <= 0
    ) {
      alert(
        "Invalid order amount"
      );
      return;
    }

    if (
      formData.fullName.trim()
        .length < 3
    ) {
      alert(
        "Please enter a valid full name"
      );
      return;
    }

    if (
      formData.address.trim()
        .length < 5
    ) {
      alert(
        "Please enter a valid address"
      );
      return;
    }

    if (
      formData.city.trim()
        .length < 2
    ) {
      alert(
        "Please enter a valid city"
      );
      return;
    }

    if (
      formData.postalCode.trim()
        .length < 4
    ) {
      alert(
        "Please enter a valid postal code"
      );
      return;
    }

    if (
      formData.country.trim()
        .length < 2
    ) {
      alert(
        "Please enter a valid country"
      );
      return;
    }

    try {
      const orderData = {
        products:
          checkoutItems.map(
            (item) => ({
              productId:
                item.id,
              title:
                item.title,
              quantity:
                item.quantity,
            })
          ),
        shippingAddress:
          formData,
        totalAmount: Number(
          totalAmount.toFixed(2)
        ),
      };

      // Create Razorpay Order
      const response =
        await axios.post(
          `${import.meta.env.VITE_API_URL}/payment/create-order`,
          {
            amount: Number(
              totalAmount.toFixed(2)
            ),
          }
        );

      const options = {
        key: import.meta.env
          .VITE_RAZORPAY_KEY_ID,

        amount:
          response.data.amount,

        currency:
          response.data.currency,

        order_id:
          response.data.orderId,

        name: "Shopora",

        description:
          "Order Payment",

        handler:
          async function (
            response
          ) {
            try {
              const verifyResponse =
                await axios.post(
                  `${import.meta.env.VITE_API_URL}/payment/verify`,
                  {
                    ...response,
                    orderData,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

              if (
                verifyResponse
                  .data.success
              ) {
                setPaymentCompleted(
                  true
                );

                if (
                  !buyNowItem
                ) {
                  clearCart();
                }

                navigate(
                  "/order-success",
                  {
                    state: {
                      orderId:
                        verifyResponse
                          .data
                          .order._id,
                    },
                  }
                );
              }
            } catch (error) {
              console.error(
                "Verification Error:",
                error
              );

              alert(
                error.response
                  ?.data
                  ?.message ||
                  "Payment verification failed"
              );
            }
          },

        modal: {
          ondismiss:
            function () {
              alert(
                "Payment cancelled."
              );
            },
        },

        prefill: {
          name:
            formData.fullName,
        },

        theme: {
          color:
            "#3399cc",
        },
      };

      if (
        !window.Razorpay
      ) {
        alert(
          "Razorpay SDK failed to load."
        );
        return;
      }

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to place order. " +
          (error.response
            ?.data
            ?.message ||
            error.message)
      );
    }
  };

  return (
    <div className="checkout-container">
      {/* Shipping Form */}
      <div className="card checkout-form-section">
        <h2>
          Shipping Address
        </h2>

        <form
          onSubmit={
            placeOrder
          }
        >
          <div className="form-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              Address
            </label>

            <input
              type="text"
              className="form-control"
              name="address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              City
            </label>

            <input
              type="text"
              className="form-control"
              name="city"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              Postal Code
            </label>

            <input
              type="text"
              className="form-control"
              name="postalCode"
              value={
                formData.postalCode
              }
              onChange={
                handleChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              Country
            </label>

            <input
              type="text"
              className="form-control"
              name="country"
              value={
                formData.country
              }
              onChange={
                handleChange
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block mt-2"
          >
            Place Order - $
            {Number(
              totalAmount || 0
            ).toFixed(2)}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="card checkout-summary">
        <h2>
          Order Summary
        </h2>

        <p>
          You have{" "}
          <strong>
            {
              checkoutItems.length
            }
          </strong>{" "}
          item(s) in this
          order.
        </p>

        <div className="summary-total mt-2">
          <h3>
            Total to Pay: $
            {Number(
              totalAmount || 0
            ).toFixed(2)}
          </h3>
        </div>

        <div className="payment-method mt-2">
          <h4>
            Payment Method
          </h4>

          <p
            style={{
              color:
                "var(--text-muted)",
            }}
          >
            Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;