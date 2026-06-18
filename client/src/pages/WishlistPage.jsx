import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistItems } = useContext(WishlistContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const requests = wishlistItems.map(id => axios.get(`https://dummyjson.com/products/${id}`));
        const responses = await Promise.all(requests);
        setProducts(responses.map(res => res.data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistItems]);

  if (loading) return <Loader />;

  if (wishlistItems.length === 0) {
    return (
      <div className="card text-center" style={{ padding: '60px 20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Add items that you like to your wishlist.</p>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        My Wishlist ({wishlistItems.length})
      </h2>
      <div className="grid grid-cols-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
