import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import Loader from "../components/Loader";
import "../css/ProductListingPage.css";

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] =
    useState(0);

  const location = useLocation();
  const searchParams = new URLSearchParams(
    location.search
  );

  const searchQ =
    searchParams.get("search");

  const catQ =
    searchParams.get("category");

  const [selectedCategory, setSelectedCategory] =
    useState(catQ || "");

  const [selectedPrice, setSelectedPrice] =
    useState("");

  const [selectedRating, setSelectedRating] =
    useState("");

  // Fetch categories
  useEffect(() => {
    axios
      .get(
        "https://dummyjson.com/products/categories"
      )
      .then((res) =>
        setCategories(res.data)
      )
      .catch((err) =>
        console.error(err)
      );
  }, []);

  // Fetch total products count
  useEffect(() => {
    axios
      .get(
        "https://dummyjson.com/products?limit=0"
      )
      .then((res) =>
        setTotalProducts(
          res.data.total
        )
      )
      .catch((err) =>
        console.error(err)
      );
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);

    let url =
      "https://dummyjson.com/products?limit=30";

    if (searchQ) {
      url = `https://dummyjson.com/products/search?q=${searchQ}`;
    } else if (
      selectedCategory
    ) {
      url = `https://dummyjson.com/products/category/${selectedCategory}`;
    }

    axios
      .get(url)
      .then((res) => {
        setProducts(
          res.data.products
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [
    searchQ,
    selectedCategory,
  ]);

  // Apply Filters
  let filteredProducts = [
    ...products,
  ];

  // Price
  if (
    selectedPrice ===
    "under50"
  ) {
    filteredProducts =
      filteredProducts.filter(
        (p) => p.price < 50
      );
  }

  if (
    selectedPrice ===
    "50to100"
  ) {
    filteredProducts =
      filteredProducts.filter(
        (p) =>
          p.price >= 50 &&
          p.price <= 100
      );
  }

  if (
    selectedPrice ===
    "above100"
  ) {
    filteredProducts =
      filteredProducts.filter(
        (p) => p.price > 100
      );
  }

  // Rating
  if (
    selectedRating === "4"
  ) {
    filteredProducts =
      filteredProducts.filter(
        (p) =>
          p.rating >= 4
      );
  }

  if (
    selectedRating === "3"
  ) {
    filteredProducts =
      filteredProducts.filter(
        (p) =>
          p.rating >= 3
      );
  }

  return (
    <div className="listing-page-container">
      <div className="listing-sidebar">
        <CategorySidebar
          categories={
            categories
          }
          selectedCategory={
            selectedCategory
          }
          onSelectCategory={
            setSelectedCategory
          }
          selectedPrice={
            selectedPrice
          }
          setSelectedPrice={
            setSelectedPrice
          }
          selectedRating={
            selectedRating
          }
          setSelectedRating={
            setSelectedRating
          }
        />
      </div>

      <div className="listing-main">
        <div className="listing-header">
          <h2>
            {searchQ
              ? `Search Results for "${searchQ}"`
              : selectedCategory
              ? `Category: ${selectedCategory.replace(
                  "-",
                  " "
                )}`
              : "All Products"}
          </h2>

          <span className="product-count">
            (
            {searchQ ||
            selectedCategory ||
            selectedPrice ||
            selectedRating
              ? filteredProducts.length
              : totalProducts}{" "}
            products)
          </span>
        </div>

        {loading ? (
          <Loader />
        ) : filteredProducts.length ===
          0 ? (
          <div className="empty-state">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;