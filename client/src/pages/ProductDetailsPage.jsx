import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import Loader from '../components/Loader';
import { useNavigate } from "react-router-dom";
import '../css/ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    axios.get(`https://dummyjson.com/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setMainImage(res.data.thumbnail);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div className="empty-state">Product not found.</div>;

  const discountPrice = product.price - (product.price * (product.discountPercentage / 100));

  return (
    <div className="product-details-container card">
      <div className="details-left">
        <div className="image-gallery">
          <div className="thumbnail-list">
            {product.images?.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt="thumbnail" 
                className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                onMouseEnter={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="main-image-container">
            <img src={mainImage} alt={product.title} className="main-image" />
          </div>
        </div>
        <div className="action-buttons">
          <button className="btn btn-outline" onClick={() => addToCart(product.id)}>
            Add to Cart
          </button>
         <button
  className="btn btn-primary"
  onClick={() =>
    navigate("/checkout", {
      state: {
        buyNowItem: {
          id: product.id,
          quantity: 1,
        },
      },
    })
  }
>
  Buy Now
</button>
        </div>
      </div>
      
      <div className="details-right">
        <div className="product-brand">{product.brand}</div>
        <h1 className="product-title-large">{product.title}</h1>
        
        <div className="rating-badge">
          {product.rating.toFixed(1)} ★ 
        </div>

        <div className="price-section-large">
          <span className="price-large">${discountPrice.toFixed(2)}</span>
          <span className="original-price-large">${product.price.toFixed(2)}</span>
          <span className="discount-large">{product.discountPercentage.toFixed(0)}% off</span>
        </div>

        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>

        <div className="product-meta">
          <p><strong>Category:</strong> <span style={{textTransform:'capitalize'}}>{product.category}</span></p>
          <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
          <p><strong>Shipping:</strong> {product.shippingInformation}</p>
          <p><strong>Warranty:</strong> {product.warrantyInformation}</p>
          <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
        </div>

        <button 
          className={`btn ${isInWishlist(product.id) ? 'btn-primary' : 'btn-outline'} mt-2`}
          onClick={() => toggleWishlist(product.id)}
        >
          {isInWishlist(product.id) ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
