import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import '../css/HomePage.css';


const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('https://dummyjson.com/products?limit=8');
        setFeaturedProducts(res.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Shopora</h1>
          <p>Discover the best products at unbeatable prices.</p>
          <Link to="/products" className="btn btn-primary mt-2">Shop Now</Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>Trending Products</h2>
          <Link to="/products" className="btn btn-outline">View All</Link>
        </div>
        
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="categories-preview">
        <div className="section-header">
          <h2>Popular Categories</h2>
        </div>
        <div className="category-cards grid grid-cols-4">
          {['smartphones', 'laptops', 'fragrances', 'home-decoration'].map((cat, idx) => (
            <Link to={`/products?category=${cat}`} key={idx} className="category-card">
              <div className="category-name">{cat}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
