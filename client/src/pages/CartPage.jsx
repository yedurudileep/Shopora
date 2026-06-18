import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import Loader from "../components/Loader";
import "../css/CartPage.css";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (cartItems.length === 0) {
        setCartProducts([]);
        setLoading(false);
        return;
      }

      try {
        const requests = cartItems.map((item) =>
          axios.get(`https://dummyjson.com/products/${item.id}`),
        );

        const responses = await Promise.all(requests);

        const products = responses.map((res, index) => ({
          ...res.data,
          quantity: cartItems[index].quantity,
        }));

        setCartProducts(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart products:", error);
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, []);
  useEffect(() => {
    setCartProducts((prevProducts) =>
      prevProducts
        .map((product) => {
          const cartItem = cartItems.find((item) => item.id === product.id);

          if (!cartItem) {
            return null;
          }

          return {
            ...product,
            quantity: cartItem.quantity,
          };
        })
        .filter(Boolean),
    );
  }, [cartItems]);
  const calculateTotal = () => {
    return cartProducts.reduce((total, item) => {
      const discountPrice =
        item.price - item.price * (item.discountPercentage / 100);
      return total + discountPrice * item.quantity;
    }, 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  if (loading) return <Loader />;

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty card">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty!</h2>
        <p>Explore our wide selection and find something you like</p>
        <Link to="/products" className="btn btn-primary mt-2">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-items-section">
        <div className="card">
          <div className="cart-header">
            <h2>Shopping Cart ({cartItems.length} Items)</h2>
          </div>
          <div className="cart-list">
            {cartProducts.map((item) => {
              const discountPrice =
                item.price - item.price * (item.discountPercentage / 100);

              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.thumbnail} alt={item.title} />
                    </Link>
                  </div>

                  <div className="cart-content">
                    <div className="cart-item-details">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="cart-item-title">{item.title}</h3>
                      </Link>

                      <p className="cart-item-brand">{item.brand}</p>

                      <div className="cart-item-price">
                        <span className="price">
                          ${discountPrice.toFixed(2)}
                        </span>

                        <span className="original-price">
                          ${item.price.toFixed(2)}
                        </span>

                        <span className="discount">
                          {item.discountPercentage.toFixed(0)}% off
                        </span>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>

                        <input type="text" value={item.quantity} readOnly />

                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="cart-summary-section">
        <div className="card cart-summary">
          <h3>Price Details</h3>
          <div className="summary-row">
            <span>Price ({cartItems.length} items)</span>
            <span>
              $
              {cartProducts
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="summary-row discount-row">
            <span>Discount</span>
            <span>
              -$
              {(
                cartProducts.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                ) - calculateTotal()
              ).toFixed(2)}
            </span>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span className="free">FREE</span>
          </div>
          <div className="summary-row total-row">
            <span>Total Amount</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <p className="savings-msg">
            You will save $
            {(
              cartProducts.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              ) - calculateTotal()
            ).toFixed(2)}{" "}
            on this order
          </p>
          <button
            className="btn btn-primary btn-block place-order-btn"
            onClick={() => navigate("/checkout")}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
