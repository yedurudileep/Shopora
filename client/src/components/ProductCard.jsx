import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import '../css/ProductCard.css';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const discountPrice = product.price - (product.price * (product.discountPercentage / 100));

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img src={product.thumbnail} alt={product.title} className="product-image" loading="lazy" />
        </Link>
        <button 
          className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle Wishlist"
        >
          {isInWishlist(product.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-info">
        <Link to={`/product/${product.id}`}>
          <h3 className="product-title" title={product.title}>{product.title}</h3>
        </Link>
        <div className="product-rating">
          <span className="star">★</span> {product.rating.toFixed(1)}
        </div>
        <div className="product-price-section">
          <span className="price">${discountPrice.toFixed(2)}</span>
          <span className="original-price">${product.price.toFixed(2)}</span>
          <span className="discount">{product.discountPercentage.toFixed(0)}% off</span>
        </div>
        <button className="btn btn-primary btn-block mt-1" onClick={() => addToCart(product.id)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
