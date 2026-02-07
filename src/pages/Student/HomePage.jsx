import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Star, MapPin } from 'lucide-react';
import VendorCard from '../../components/student/VendorCard';
import CartSidebar from '../../components/student/CartSidebar';
import { vendorService } from '../../services/vendorService';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'food', name: 'Food & Snacks' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'quick', name: 'Quick Bites' },
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [searchTerm, selectedCategory, sortBy, vendors]);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const data = await vendorService.getActiveVendors();
      setVendors(data);
      setFilteredVendors(data);
    } catch (error) {
      toast.error('Failed to load vendors');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVendors = () => {
    let filtered = [...vendors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(vendor =>
        vendor.categories?.includes(selectedCategory)
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'prepTime':
        filtered.sort((a, b) => a.avgPreparationTime - b.avgPreparationTime);
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.orderCount - a.orderCount);
    }

    setFilteredVendors(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Skip the Queue, Enjoy the Food
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Pre-order from campus vendors and pick up your food exactly when it's ready.
          No waiting, no queues.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for vendors, food items, or cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="prepTime">Fastest Prep</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Wait Time</p>
              <p className="text-xl font-semibold">8.5 min</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Vendors</p>
              <p className="text-xl font-semibold">{vendors.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup Locations</p>
              <p className="text-xl font-semibold">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Available Vendors {filteredVendors.length > 0 && `(${filteredVendors.length})`}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No vendors found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
};

export default HomePage;