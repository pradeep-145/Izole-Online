import { ChevronDown, Filter, SortAsc, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/customer/Footer";
import Navbar from "../../Components/customer/Navbar";
import ProductCard from "../../Components/customer/ProductCard";
import { useProduct } from "../../zustand/useProducts.jsx";

const ProductList = () => {
  const navigate = useNavigate();
  const { products } = useProduct();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categories: [], // Multi-select categories
    price: { min: "", max: "" }, // Price range
    colors: [], // Multi-select colors
    sizes: [], // Multi-select sizes
    discount: false, // Show only discounted items
    inStock: false, // Show only in-stock items
  });
  const [sortOption, setSortOption] = useState("featured"); // Default sort

  // Extract unique filter options from products
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 10000 },
  });

  useEffect(() => {
    // Extract all unique filter options from the products
    if (products && products.length > 0) {
      const categories = [
        ...new Set(products.map((product) => product.category)),
      ];

      // Extract all colors from all product variants
      let allColors = [];
      let allSizes = [];
      let minPrice = Infinity;
      let maxPrice = 0;

      products.forEach((product) => {
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach((variant) => {
            // Collect unique colors
            if (variant.color && !allColors.includes(variant.color)) {
              allColors.push(variant.color);
            }

            // Collect unique sizes and track price range
            if (variant.sizeOptions && variant.sizeOptions.length > 0) {
              variant.sizeOptions.forEach((option) => {
                // Track sizes
                if (!allSizes.includes(option.size)) {
                  allSizes.push(option.size);
                }

                // Track price range
                if (option.price < minPrice) minPrice = option.price;
                if (option.price > maxPrice) maxPrice = option.price;
              });
            }
          });
        }
      });

      // Sort sizes in a logical order (S, M, L, XL, etc.)
      const sizeOrder = {
        XS: 0,
        S: 1,
        M: 2,
        L: 3,
        XL: 4,
        XXL: 5,
        "3XL": 6,
        "4XL": 7,
      };

      allSizes.sort((a, b) => {
        return (
          (sizeOrder[a] !== undefined ? sizeOrder[a] : 99) -
          (sizeOrder[b] !== undefined ? sizeOrder[b] : 99)
        );
      });

      setFilterOptions({
        categories,
        colors: allColors.sort(),
        sizes: allSizes,
        priceRange: {
          min: Math.floor(minPrice),
          max: Math.ceil(maxPrice),
        },
      });
    }
  }, [products]);

  // Apply filters and sorting to products
  const filteredAndSortedProducts = React.useMemo(() => {
    if (!products) return [];

    // Start with all products
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      result = result.filter((product) => {
        // Check if any variant matches the selected colors
        return product.variants.some((variant) =>
          filters.colors.includes(variant.color)
        );
      });
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      result = result.filter((product) => {
        // Check if any variant has any of the selected sizes
        return product.variants.some((variant) =>
          variant.sizeOptions.some((option) =>
            filters.sizes.includes(option.size)
          )
        );
      });
    }

    // Apply price range filter
    if (filters.price.min !== "" || filters.price.max !== "") {
      const minPrice = filters.price.min === "" ? 0 : Number(filters.price.min);
      const maxPrice =
        filters.price.max === "" ? Infinity : Number(filters.price.max);

      result = result.filter((product) => {
        // Check if any variant's size option falls within the price range
        return product.variants.some((variant) =>
          variant.sizeOptions.some(
            (option) => option.price >= minPrice && option.price <= maxPrice
          )
        );
      });
    }

    // Apply discount filter
    if (filters.discount) {
      result = result.filter((product) => {
        // Check if any variant has a discounted price
        return product.variants.some((variant) =>
          variant.sizeOptions.some(
            (option) => option.originalPrice > option.price
          )
        );
      });
    }

    // Apply in-stock filter
    if (filters.inStock) {
      result = result.filter((product) => {
        // Check if any variant has stock available
        return product.variants.some((variant) =>
          variant.sizeOptions.some((option) => option.quantity > 0)
        );
      });
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => {
          const aMinPrice = Math.min(
            ...a.variants.flatMap((v) => v.sizeOptions.map((o) => o.price))
          );
          const bMinPrice = Math.min(
            ...b.variants.flatMap((v) => v.sizeOptions.map((o) => o.price))
          );
          return aMinPrice - bMinPrice;
        });
        break;

      case "price-high-low":
        result.sort((a, b) => {
          const aMaxPrice = Math.max(
            ...a.variants.flatMap((v) => v.sizeOptions.map((o) => o.price))
          );
          const bMaxPrice = Math.max(
            ...b.variants.flatMap((v) => v.sizeOptions.map((o) => o.price))
          );
          return bMaxPrice - aMaxPrice;
        });
        break;

      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;

      case "discount":
        result.sort((a, b) => {
          const aMaxDiscount = Math.max(
            ...a.variants.flatMap((v) =>
              v.sizeOptions.map(
                (o) =>
                  ((o.originalPrice - o.price) / o.originalPrice) * 100 || 0
              )
            )
          );
          const bMaxDiscount = Math.max(
            ...b.variants.flatMap((v) =>
              v.sizeOptions.map(
                (o) =>
                  ((o.originalPrice - o.price) / o.originalPrice) * 100 || 0
              )
            )
          );
          return bMaxDiscount - aMaxDiscount;
        });
        break;

      case "popular":
        // Sort by order count if available, else use featured (default)
        result.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
        break;

      default: // "featured" - default sorting
        // No specific sorting, keep original order or implement custom logic
        break;
    }

    return result;
  }, [products, searchQuery, filters, sortOption]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      // Handle different types of filters
      switch (filterType) {
        case "category":
          // Toggle category selection
          const updatedCategories = prev.categories.includes(value)
            ? prev.categories.filter((cat) => cat !== value)
            : [...prev.categories, value];
          return { ...prev, categories: updatedCategories };

        case "color":
          // Toggle color selection
          const updatedColors = prev.colors.includes(value)
            ? prev.colors.filter((color) => color !== value)
            : [...prev.colors, value];
          return { ...prev, colors: updatedColors };

        case "size":
          // Toggle size selection
          const updatedSizes = prev.sizes.includes(value)
            ? prev.sizes.filter((size) => size !== value)
            : [...prev.sizes, value];
          return { ...prev, sizes: updatedSizes };

        case "price":
          // Update price range
          return { ...prev, price: { ...prev.price, ...value } };

        case "discount":
          // Toggle discount filter
          return { ...prev, discount: !prev.discount };

        case "inStock":
          // Toggle in-stock filter
          return { ...prev, inStock: !prev.inStock };

        default:
          return prev;
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      price: { min: "", max: "" },
      colors: [],
      sizes: [],
      discount: false,
      inStock: false,
    });
    setSortOption("featured");
    setSearchQuery("");
  };

  const totalActiveFilters =
    filters.categories.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.price.min !== "" ? 1 : 0) +
    (filters.price.max !== "" ? 1 : 0) +
    (filters.discount ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-wineRed text-white py-10 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-mustard">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4 mt-4">
            IZOLE Collection
          </h1>
          <p className="text-lg md:text-xl mb-2">
            Discover the latest trends in fashion with our new arrivals
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container text-wineRed mx-auto px-4 py-6 md:py-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            className="bg-wineRed text-mustard px-4 py-2 rounded-md flex items-center"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter size={18} className="mr-2" />
            Filters {totalActiveFilters > 0 && `(${totalActiveFilters})`}
          </button>

          <div className="relative">
            <button
              className="bg-mustard text-wineRed px-4 py-2 rounded-md flex items-center"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SortAsc size={18} className="mr-2" />
              Sort By
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                <SortOptions
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  setIsOpen={setIsFilterOpen}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="h-full w-4/5 max-w-sm bg-white p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h3 className="text-xl font-bold">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <FilterSidebar
                filters={filters}
                filterOptions={filterOptions}
                handleFilterChange={handleFilterChange}
                resetFilters={resetFilters}
                totalActiveFilters={totalActiveFilters}
              />

              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  onClick={resetFilters}
                  className="py-2 border border-gray-300 rounded text-center"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="py-2 bg-wineRed text-mustard rounded text-center"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 mr-6">
            <FilterSidebar
              filters={filters}
              filterOptions={filterOptions}
              handleFilterChange={handleFilterChange}
              resetFilters={resetFilters}
              totalActiveFilters={totalActiveFilters}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search & Sort Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
              <div className="form-control w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input input-bordered w-full bg-white border-2 border-wineRed text-wineRed focus:outline-none focus:ring-2 focus:ring-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Desktop Sort Options */}
              <div className="hidden md:flex items-center">
                <span className="text-gray-700 mr-2">Sort By:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-wineRed border text-mustard border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-wineRed "
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {totalActiveFilters > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-gray-200">
                {filters.categories.map((category) => (
                  <FilterTag
                    key={`cat-${category}`}
                    label={category}
                    onRemove={() => handleFilterChange("category", category)}
                  />
                ))}

                {filters.colors.map((color) => (
                  <FilterTag
                    key={`color-${color}`}
                    label={color}
                    onRemove={() => handleFilterChange("color", color)}
                  />
                ))}

                {filters.sizes.map((size) => (
                  <FilterTag
                    key={`size-${size}`}
                    label={`Size: ${size}`}
                    onRemove={() => handleFilterChange("size", size)}
                  />
                ))}

                {filters.price.min !== "" && (
                  <FilterTag
                    key="price-min"
                    label={`Min ₹${filters.price.min}`}
                    onRemove={() => handleFilterChange("price", { min: "" })}
                  />
                )}

                {filters.price.max !== "" && (
                  <FilterTag
                    key="price-max"
                    label={`Max ₹${filters.price.max}`}
                    onRemove={() => handleFilterChange("price", { max: "" })}
                  />
                )}

                {filters.discount && (
                  <FilterTag
                    key="discount"
                    label="Discounted"
                    onRemove={() => handleFilterChange("discount")}
                  />
                )}

                {filters.inStock && (
                  <FilterTag
                    key="inStock"
                    label="In Stock"
                    onRemove={() => handleFilterChange("inStock")}
                  />
                )}

                <button
                  onClick={resetFilters}
                  className="text-sm text-wineRed hover:text-red-700 flex items-center"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredAndSortedProducts.length} products
              {totalActiveFilters > 0 ? " with applied filters" : ""}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-500">
                  No products found
                </h3>
                <p className="mt-2">
                  Try changing your search or filter options
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-wineRed text-white rounded-md hover:bg-opacity-90"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({
  filters,
  filterOptions,
  handleFilterChange,
  resetFilters,
  totalActiveFilters,
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    colors: true,
    sizes: true,
    other: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-wineRed items-center">
        <h3 className="text-lg font-bold ">Filters</h3>
        {totalActiveFilters > 0 && (
          <button
            onClick={resetFilters}
            className="text-sm text-wineRed hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <FilterSection
        title="Categories" className="text-wineRed"
        isOpen={openSections.categories}
        toggleOpen={() => toggleSection("categories")}
      >
        <div className="space-y-2">
          {filterOptions.categories.map((category) => (
            <FilterCheckbox className="text-wineRed"
              key={category}
              label={category}
              isChecked={filters.categories.includes(category)}
              onChange={() => handleFilterChange("category", category)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection
        title="Price Range"
        isOpen={openSections.price}
        toggleOpen={() => toggleSection("price")}
      >
        <div className="space-y-2 text-wineRed">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full bg-white p-2 border text-wineRed border-gray-300 rounded"
              value={filters.price.min}
              onChange={(e) =>
                handleFilterChange("price", { min: e.target.value })
              }
              min={0}
            />
            <span className="text-wineRed">to</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 bg-white border border-gray-300 text-wineRed rounded"
              value={filters.price.max}
              onChange={(e) =>
                handleFilterChange("price", { max: e.target.value })
              }
              min={0}
            />
          </div>

          {/* Price Range Buttons */}
          <div className="flex flex-wrap gap-2 mt-2">
            <PriceRangeButton
              range={{ min: 0, max: 500 }}
              handleFilterChange={handleFilterChange}
            />
            <PriceRangeButton
              range={{ min: 500, max: 1000 }}
              handleFilterChange={handleFilterChange}
            />
            <PriceRangeButton
              range={{ min: 1000, max: "" }}
              label="₹1000+"
              handleFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </FilterSection>

      {/* Colors Filter */}
      <FilterSection
        title="Colors"
        isOpen={openSections.colors}
        toggleOpen={() => toggleSection("colors")}
      >
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.colors.map((color) => (
            <FilterCheckbox
              key={color}
              className="text-wineRed "
              label={color}
              isChecked={filters.colors.includes(color)}
              onChange={() => handleFilterChange("color", color)}
              colorSquare={color.toLowerCase()}
            />
          ))}
        </div>
      </FilterSection>

      {/* Sizes Filter */}
      <FilterSection
        title="Sizes"
        isOpen={openSections.sizes}
        className="text-wineRed"
        toggleOpen={() => toggleSection("sizes")}
      >
        <div className="flex flex-wrap gap-2 text-wineRed">
          {filterOptions.sizes.map((size) => (
            <SizeButton
              key={size}
              size={size}
              isSelected={filters.sizes.includes(size)}
              onClick={() => handleFilterChange("size", size)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Other Filters */}
      <FilterSection
        title="Other Filters"
        isOpen={openSections.other}
        toggleOpen={() => toggleSection("other")}
      >
        <div className="space-y-2">
          <FilterCheckbox
            label="Discounted Items"
            isChecked={filters.discount}
            onChange={() => handleFilterChange("discount")}
          />
          <FilterCheckbox
            label="In Stock"
            isChecked={filters.inStock}
            onChange={() => handleFilterChange("inStock")}
          />
        </div>
      </FilterSection>
    </div>
  );
};

// Filter Section Component (collapsible)
const FilterSection = ({ title, isOpen, toggleOpen, children }) => {
  return (
    <div className="border-b pb-3">
      <button
        className="flex justify-between items-center w-full py-2 text-left font-medium"
        onClick={toggleOpen}
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

// Filter Checkbox Component
const FilterCheckbox = ({ label, isChecked, onChange, colorSquare }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="form-checkbox h-4 w-4 text-wineRed rounded focus:ring-wineRed border-gray-300"
      />
      <span className="ml-2 flex items-center">
        {colorSquare && (
          <span
            className="inline-block w-3 h-3 mr-1 border border-gray-300 rounded-sm"
            style={{ backgroundColor: colorSquare }}
          ></span>
        )}
        {label}
      </span>
    </label>
  );
};

// Size Button Component
const SizeButton = ({ size, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 border rounded-md text-sm font-medium 
        ${
          isSelected
            ? "bg-wineRed text-white border-wineRed"
            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
        }`}
    >
      {size}
    </button>
  );
};

// Price Range Button Component
const PriceRangeButton = ({ range, label, handleFilterChange }) => {
  return (
    <button
      onClick={() => handleFilterChange("price", range)}
      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
    >
      {label || `₹${range.min} - ₹${range.max}`}
    </button>
  );
};

// Sort Options Component
const SortOptions = ({ sortOption, setSortOption, setIsOpen }) => {
  const options = [
    { value: "featured", label: "Featured" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "discount", label: "Biggest Discount" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <div className="py-1">
      {options.map((option) => (
        <button
          key={option.value}
          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-wineRed
            ${sortOption === option.value ? "bg-gray-100 font-medium" : ""}`}
          onClick={() => {
            setSortOption(option.value);
            setIsOpen(false);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Filter Tag Component (for active filters)
const FilterTag = ({ label, onRemove }) => {
  return (
    <div className="inline-flex items-center bg-gray-100 text-gray-800 text-sm rounded-full px-3 py-1">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 text-gray-500 hover:text-gray-700"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ProductList;
