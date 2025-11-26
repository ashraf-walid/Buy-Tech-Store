"use client";

import { useState, useEffect } from "react";
import useProductsStore from "@/store/productsStore";
import EditProductModal from "./EditProductModal";

export default function EditProductList() {
  const { products, deleteProduct, ensureProductsLoaded } = useProductsStore();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    ensureProductsLoaded();
  }, [ensureProductsLoaded]);

  useEffect(() => {
    let result = products;

    // Filter
    if (search.trim()) {
      const term = search.toLowerCase();
      result = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.price.toString().includes(term)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(result);
  }, [search, products, sortBy, sortOrder]);

  const handleDelete = async (_id) => {
    setDeletingId(_id);
    await deleteProduct(_id);
    setDeletingId(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">⇅</span>;
    return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-blue-600">🛍️</span>
          Product Management
        </h1>
        <p className="text-gray-600">Manage your inventory with ease</p>
      </div>

      {/* Search and Stats Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white flex justify-center items-center gap-3 px-6 py-3 rounded-xl shadow-md">
              <div className="text-sm opacity-90">Total Products</div>
              <div className="text-2xl font-bold">{products.length}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white flex justify-center items-center gap-3 px-6 py-3 rounded-xl shadow-md">
              <div className="text-sm opacity-90">In Stock</div>
              <div className="text-2xl font-bold">{filtered.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Image
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <span className="flex items-center">
                    Name <SortIcon field="name" />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort("brand")}
                >
                  <span className="flex items-center">
                    Brand <SortIcon field="brand" />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort("price")}
                >
                  <span className="flex items-center">
                    Price <SortIcon field="price" />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort("stock")}
                >
                  <span className="flex items-center">
                    Stock <SortIcon field="stock" />
                  </span>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((p, i) => (
                  <tr
                    key={p._id || i}
                    className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                    onClick={() => handleEdit(p)}
                  >
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4">
                      {p?.image?.url ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                          <img
                            src={p.image.url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (<span>🖼️ Add New Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">
                        {p.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {p.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-800">
                        {p.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">EGP</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${p.stock > 50
                            ? "bg-green-100 text-green-700"
                            : p.stock > 20
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {p.stock ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this product?"
                              )
                            ) {
                              handleDelete(p._id);
                            }
                          }}
                          disabled={deletingId === p._id}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === p._id ? "⏳" : "🗑️"} Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-6xl opacity-20">📦</div>
                      <p className="text-gray-500 text-lg">No products found</p>
                      <p className="text-gray-400 text-sm">
                        Try adjusting your search
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EditProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(updated) => {
            console.log("Product updated:", updated);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
