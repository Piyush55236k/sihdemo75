import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Filter,
  Star,
  Search,
  Grid,
  List,
} from "lucide-react";

const ShopPage = ({ onBack, currentLanguage = "en" }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Shop categories and products
  const categories = [
    "All",
    "Hand Tools",
    "Irrigation Equipment", 
    "Seeds & Planting",
    "Fertilizers & Pesticides",
    "Farm Inputs",
    "Maintenance & Protection"
  ];

  const shopProducts = [
    // Hand Tools
    {
      id: 1,
      name: "Spade",
      price: 450,
      category: "Hand Tools",
      image: "/shop-assests/spade.jpg",
      description: "Heavy-duty spade for digging and soil preparation",
      rating: 4.5,
      inStock: true
    },
    {
      id: 2,
      name: "Hoes",
      price: 350,
      category: "Hand Tools", 
      image: "/shop-assests/hoes.jpg",
      description: "Sharp hoes for weeding and cultivation",
      rating: 4.3,
      inStock: true
    },
    {
      id: 3,
      name: "Sickle", 
      price: 280,
      category: "Hand Tools",
      image: "/shop-assests/sickle.jpg", 
      description: "Traditional sickle for harvesting crops",
      rating: 4.6,
      inStock: true
    },
    {
      id: 4,
      name: "Trowels",
      price: 180,
      category: "Hand Tools",
      image: "/shop-assests/trowels.jpg",
      description: "Small hand trowels for precise gardening",
      rating: 4.2,
      inStock: true
    },

    // Irrigation Equipment
    {
      id: 5,
      name: "Sprinklers",
      price: 850,
      category: "Irrigation Equipment",
      image: "/shop-assests/sprinklers.jpg",
      description: "Efficient sprinkler system for irrigation",
      rating: 4.7,
      inStock: true
    },
    {
      id: 6,
      name: "Pressure Sprayer Pump",
      price: 1200,
      category: "Irrigation Equipment",
      image: "/shop-assests/pressure sprayer pump.jpg",
      description: "High-pressure pump for pesticide application",
      rating: 4.4,
      inStock: true
    },
    {
      id: 7,
      name: "Irrigation Kit",
      price: 2500,
      category: "Irrigation Equipment",
      image: "/shop-assests/irrigation kit.jpg",
      description: "Complete drip irrigation kit",
      rating: 4.8,
      inStock: true
    },

    // Seeds & Planting
    {
      id: 8,
      name: "Tomato Seeds",
      price: 199,
      category: "Seeds & Planting",
      image: "/shop-assests/tomato seeds.jpg",
      description: "High-yield hybrid tomato seeds",
      rating: 4.6,
      inStock: true
    },
    {
      id: 9,
      name: "Rice Seeds",
      price: 250,
      category: "Seeds & Planting",
      image: "/shop-assests/rice seeds.jpg",
      description: "Premium quality rice seeds",
      rating: 4.5,
      inStock: true
    },
    {
      id: 10,
      name: "Wheat Seeds",
      price: 299,
      category: "Seeds & Planting",
      image: "/shop-assests/wheat seeds.jpg",
      description: "High-protein wheat seeds",
      rating: 4.4,
      inStock: true
    },
    {
      id: 11,
      name: "Potato Seeds",
      price: 220,
      category: "Seeds & Planting",
      image: "/shop-assests/potato seeds.jpg",
      description: "Disease-resistant potato seeds",
      rating: 4.3,
      inStock: true
    },
    {
      id: 12,
      name: "Mango Seeds",
      price: 150,
      category: "Seeds & Planting",
      image: "/shop-assests/mango seeds.jpg",
      description: "Premium mango seeds for plantation",
      rating: 4.2,
      inStock: true
    },
    {
      id: 13,
      name: "Watermelon Seeds",
      price: 320,
      category: "Seeds & Planting",
      image: "/shop-assests/watermelon seeds.jpg",
      description: "Sweet watermelon seeds",
      rating: 4.7,
      inStock: true
    },
    {
      id: 14,
      name: "Cucumber Seeds",
      price: 180,
      category: "Seeds & Planting",
      image: "/shop-assests/cucumber seeds.jpg",
      description: "Fresh cucumber seeds",
      rating: 4.1,
      inStock: true
    },

    // Fertilizers & Pesticides
    {
      id: 15,
      name: "Organic Fertilizer",
      price: 450,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/organic fertilizer.jpg",
      description: "100% organic fertilizer for healthy crops",
      rating: 4.8,
      inStock: true
    },
    {
      id: 16,
      name: "Bio Fertilizer",
      price: 380,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/bio fertilizer.jpg",
      description: "Biological fertilizer with beneficial microorganisms",
      rating: 4.6,
      inStock: true
    },
    {
      id: 17,
      name: "Chemical Fertilizer",
      price: 320,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/chemical fertilizer.jpg",
      description: "NPK chemical fertilizer for quick results",
      rating: 4.3,
      inStock: true
    },
    {
      id: 18,
      name: "Vermicompost",
      price: 280,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/vermicompost.jpg",
      description: "Nutrient-rich vermicompost",
      rating: 4.7,
      inStock: true
    },
    {
      id: 19,
      name: "Biochar",
      price: 550,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/biochar.jpg",
      description: "Soil conditioner biochar",
      rating: 4.4,
      inStock: true
    },
    {
      id: 20,
      name: "Pesticide",
      price: 420,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/pesticide.jpg",
      description: "Effective pesticide for crop protection",
      rating: 4.2,
      inStock: true
    },
    {
      id: 21,
      name: "Herbicides",
      price: 380,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/herbicides.jpg",
      description: "Selective herbicides for weed control",
      rating: 4.1,
      inStock: true
    },
    {
      id: 22,
      name: "Fungicides",
      price: 460,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/fungicides.jpg",
      description: "Fungicides for disease prevention",
      rating: 4.5,
      inStock: true
    },

    // Farm Inputs
    {
      id: 23,
      name: "Grow Bags",
      price: 120,
      category: "Farm Inputs",
      image: "/shop-assests/Grow bags.jpg",
      description: "Durable grow bags for container farming",
      rating: 4.3,
      inStock: true
    },
    {
      id: 24,
      name: "Jute Bags",
      price: 85,
      category: "Farm Inputs",
      image: "/shop-assests/jute.jpg",
      description: "Eco-friendly jute storage bags",
      rating: 4.4,
      inStock: true
    },
    {
      id: 25,
      name: "Soil Testing Kit",
      price: 650,
      category: "Farm Inputs",
      image: "/shop-assests/soil testing kit.jpg",
      description: "Complete soil testing kit for pH and nutrients",
      rating: 4.6,
      inStock: true
    },

    // Maintenance & Protection
    {
      id: 26,
      name: "Gloves",
      price: 150,
      category: "Maintenance & Protection",
      image: "/shop-assests/Gloves.jpg",
      description: "Protective gloves for farming work",
      rating: 4.2,
      inStock: true
    },
    {
      id: 27,
      name: "Boots",
      price: 850,
      category: "Maintenance & Protection",
      image: "/shop-assests/boots.jpg",
      description: "Waterproof farming boots",
      rating: 4.5,
      inStock: true
    },
    {
      id: 28,
      name: "Grease & Lubricants",
      price: 220,
      category: "Maintenance & Protection",
      image: "/shop-assests/Grease, lubricants, oils.jpg",
      description: "Multi-purpose grease and oils",
      rating: 4.1,
      inStock: true
    }
  ];

  // Filter products based on category and search
  const filteredProducts = shopProducts.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const addToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Farmer Equipment Shop</h1>
            <div className="flex items-center space-x-4">
              <div className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors duration-300" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-green-600" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search equipment..."
                    className="w-full pl-10 pr-4 py-3 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-green-100 text-green-700 font-medium shadow-md border-l-4 border-green-500"
                          : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-300"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory === "All" ? "All Products" : selectedCategory}
                </h2>
                <p className="text-gray-600">
                  {sortedProducts.length} products found
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-green-100 text-green-700 shadow-md"
                      : "text-gray-400 hover:text-green-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-green-100 text-green-700 shadow-md"
                      : "text-gray-400 hover:text-green-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group border-0 cursor-pointer"
                  >
                    <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{product.price}
                        </span>
                        <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full group-hover:bg-yellow-100 transition-colors duration-300">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="font-medium">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-6 border-0 group cursor-pointer"
                  >
                    <div className="flex-shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{product.price}
                        </span>
                        <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full group-hover:bg-yellow-100 transition-colors duration-300">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="font-medium">Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;