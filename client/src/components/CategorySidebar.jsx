import React, { useState } from "react";
import "../css/CategorySidebar.css";

const CategorySidebar = ({
  categories = [],
  selectedCategory = "",
  onSelectCategory,
  selectedPrice = "",
  setSelectedPrice,
  selectedRating = "",
  setSelectedRating,
}) => {
  const [showCategories, setShowCategories] =
    useState(true);

  const [showFilters, setShowFilters] =
    useState(false);

  const clearFilters = () => {
    setSelectedPrice("");
    setSelectedRating("");
  };

  return (
    <div className="category-sidebar">
      {/* Categories */}
      <div
        className="sidebar-header"
        onClick={() =>
          setShowCategories(
            !showCategories
          )
        }
      >
        <h3 className="sidebar-title">
          Categories
        </h3>

        <span>
          {showCategories ? "▲" : "▼"}
        </span>
      </div>

      {showCategories && (
        <ul className="category-list">
          <li
            className={`category-item ${
              !selectedCategory
                ? "active"
                : ""
            }`}
            onClick={() =>
              onSelectCategory("")
            }
          >
            All Products
          </li>

          {categories.map(
            (cat, index) => (
              <li
                key={index}
                className={`category-item ${
                  selectedCategory ===
                  cat.slug
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onSelectCategory(
                    cat.slug
                  )
                }
              >
                {cat.name}
              </li>
            )
          )}
        </ul>
      )}

      {/* Filters */}
      <div
        className="sidebar-header filters-header"
        onClick={() =>
          setShowFilters(
            !showFilters
          )
        }
      >
        <h3 className="sidebar-title">
          Filters
        </h3>

        <span>
          {showFilters ? "▲" : "▼"}
        </span>
      </div>

      {showFilters && (
        <div className="filter-section">
          <h4>Price</h4>

          <label>
            <input
              type="radio"
              name="price"
              value="under50"
              checked={
                (selectedPrice ??
                  "") === "under50"
              }
              onChange={(e) =>
                setSelectedPrice(
                  e.target.value
                )
              }
            />
            Under $50
          </label>

          <label>
            <input
              type="radio"
              name="price"
              value="50to100"
              checked={
                (selectedPrice ??
                  "") === "50to100"
              }
              onChange={(e) =>
                setSelectedPrice(
                  e.target.value
                )
              }
            />
            $50 - $100
          </label>

          <label>
            <input
              type="radio"
              name="price"
              value="above100"
              checked={
                (selectedPrice ??
                  "") === "above100"
              }
              onChange={(e) =>
                setSelectedPrice(
                  e.target.value
                )
              }
            />
            Above $100
          </label>

          <h4>Rating</h4>

          <label>
            <input
              type="radio"
              name="rating"
              value="4"
              checked={
                (selectedRating ??
                  "") === "4"
              }
              onChange={(e) =>
                setSelectedRating(
                  e.target.value
                )
              }
            />
            4★ & above
          </label>

          <label>
            <input
              type="radio"
              name="rating"
              value="3"
              checked={
                (selectedRating ??
                  "") === "3"
              }
              onChange={(e) =>
                setSelectedRating(
                  e.target.value
                )
              }
            />
            3★ & above
          </label>

          <button
            type="button"
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;