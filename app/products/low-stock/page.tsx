'use client';
import { useLowStockCountQuery } from '@/redux/feature/notificationSlice';
import React, { useState } from 'react';

interface Product {
  product_id: number;
  product_name: string;
  generic_name: string;
  product_description: string;
  product_image: string;
  sku: string;
  quantity_per_box: number;
  company_id: number;
  company_name: string;
  category_id: number[];
  category_name: string[];
  stock_quantity: number;
  cost_price: number;
  mrp: number;
  selling_price: number;
  discount_percent: number;
  out_of_stock: boolean;
  is_active: boolean;
  created_on: string;
  updated_on: string;
}

interface LowStockResponse {
  status: string;
  low_stock_product_count: number;
  data: Product[];
}

export default function LowStock() {
  const { data: response, isLoading, error, refetch } = useLowStockCountQuery(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const data: LowStockResponse | undefined = response;
  const products: Product[] = data?.data || [];
  const totalLowStockCount = data?.low_stock_product_count || 0;
  const IMAGE_BASE_URL = "https://api.bdmpharmacy.store";

  // Get unique categories and companies for filters
  const categories = ['all', ...new Set(products.flatMap(p => p.category_name))];
  const companies = ['all', ...new Set(products.map(p => p.company_name))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category_name.includes(filterCategory);
    const matchesCompany = filterCompany === 'all' || product.company_name === filterCompany;
    return matchesSearch && matchesCategory && matchesCompany;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const getStockStatusColor = (quantity: number, outOfStock: boolean) => {
    if (outOfStock || quantity <= 0) return 'text-red-600 bg-red-100';
    if (quantity < 5) return 'text-orange-600 bg-orange-100';
    if (quantity < 10) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStockStatusText = (quantity: number, outOfStock: boolean) => {
    if (outOfStock || quantity <= 0) return 'Out of Stock';
    if (quantity < 5) return 'Critical';
    if (quantity < 10) return 'Low';
    return 'In Stock';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#2c2e34]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#2c2e34]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-md">
          <h3 className="font-semibold mb-2">Error Loading Low Stock Products</h3>
          <p>Failed to load low stock data. Please try again later.</p>
          <button 
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="  px-4  py-8 ">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Low Stock Products</h1>
              <p className="text-gray-300">Monitor products with critical stock levels</p>
            </div>
            <div className="bg-red-500/20 px-6 py-3 rounded-lg border border-red-500/50">
              <p className="text-sm text-gray-300">Total Low Stock Items</p>
              <p className="text-3xl font-bold text-red-400">{totalLowStockCount}</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, generic name or SKU..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 pl-10 bg-[#3a3c44] border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-[#3a3c44] border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          {/* Company Filter */}
          <select
            value={filterCompany}
            onChange={(e) => {
              setFilterCompany(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-[#3a3c44] border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {companies.map(company => (
              <option key={company} value={company}>
                {company === 'all' ? 'All Companies' : company}
              </option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#2c2e34]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Stock Quantity
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Selling Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentProducts.map((product) => (
                  <tr key={product.product_id} className="hover:bg-[#2c2e34] transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={`${IMAGE_BASE_URL}${product.product_image}`}
                            alt={product.product_name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {product.product_name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {product.generic_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {product.category_name.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{product.company_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-semibold ${product.stock_quantity <= 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {product.stock_quantity}
                      </div>
                      <div className="text-xs text-gray-500">
                        Box: {product.quantity_per_box}/box
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-white">${product.selling_price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 line-through">
                        ${product.mrp.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusColor(product.stock_quantity, product.out_of_stock)}`}>
                        {getStockStatusText(product.stock_quantity, product.out_of_stock)}
                      </span>
                      {product.discount_percent > 0 && (
                        <div className="text-xs text-green-400 mt-1">
                          {product.discount_percent.toFixed(2)}% off
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found matching your filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-[#2c2e34] border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-[#3a3c44] text-white rounded hover:bg-[#4a4c54] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-[#3a3c44] text-white rounded hover:bg-[#4a4c54] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#3a3c44] p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Products</p>
            <p className="text-2xl font-bold text-white">{products.length}</p>
          </div>
          <div className="bg-[#3a3c44] p-4 rounded-lg">
            <p className="text-sm text-gray-400">Critical Stock (&lt;5)</p>
            <p className="text-2xl font-bold text-red-400">
              {products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 5).length}
            </p>
          </div>
          <div className="bg-[#3a3c44] p-4 rounded-lg">
            <p className="text-sm text-gray-400">Low Stock (5-10)</p>
            <p className="text-2xl font-bold text-yellow-400">
              {products.filter(p => p.stock_quantity >= 5 && p.stock_quantity < 10).length}
            </p>
          </div>
          <div className="bg-[#3a3c44] p-4 rounded-lg">
            <p className="text-sm text-gray-400">Out of Stock</p>
            <p className="text-2xl font-bold text-orange-400">
              {products.filter(p => p.stock_quantity <= 0 || p.out_of_stock).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}