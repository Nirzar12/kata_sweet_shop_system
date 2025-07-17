import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CATEGORY_OPTIONS = [
  'All',
  'Milk-Based',
  'Nut-Based',
  'Sugar-Based',
  'Fruit-Based',
  'Flour-Based'
];

export default function ViewSweets() {
  const [sweets, setSweets] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: 'All',
    priceMin: '',
    priceMax: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [restockId, setRestockId] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  const fetchSweets = async () => {
    const query = new URLSearchParams();

    if (filters.name) query.append('name', filters.name);
    if (filters.category && filters.category !== 'All')
      query.append('category', filters.category);
    if (filters.priceMin) query.append('priceMin', filters.priceMin);
    if (filters.priceMax) query.append('priceMax', filters.priceMax);

    const url = query.toString() ? `/search?${query.toString()}` : '/';
    const res = await api.get(url);
    setSweets(res.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      setSweets((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRestockClick = (id) => {
    setRestockId(id);
    setRestockQuantity('');
    setShowModal(true);
  };

  const submitRestock = async () => {
    try {
      await api.post('/restock', {
        id: restockId,
        quantity: Number(restockQuantity)
      });
      setShowModal(false);
      fetchSweets(); // refresh updated quantity
    } catch (err) {
      alert('Restock failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6">
      {/* Title + Add Sweet Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-pink-700">All Sweets 🍬</h1>
        <Link
          to="/add"
          className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition-colors"
        >
          ➕ Add Sweet
        </Link>
      </div>

      {/* 🔍 Search Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          className="p-2 border border-pink-300 rounded"
          value={filters.name}
          onChange={handleInputChange}
        />

        <select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="p-2 border border-pink-300 rounded"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          className="p-2 border border-pink-300 rounded"
          value={filters.priceMin}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          className="p-2 border border-pink-300 rounded"
          value={filters.priceMax}
          onChange={handleInputChange}
        />

        <button
          className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
          onClick={fetchSweets}
        >
          🔍 Search
        </button>
      </div>

      {/* 🧁 Sweet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweets.map((s) => (
          <div
            key={s.id}
            className="bg-white shadow-lg rounded-2xl p-5 border border-pink-100 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-pink-700">{s.name}</h2>
            <p className="text-sm text-gray-500 italic mb-2">{s.category}</p>

            <div className="text-gray-700 mb-4">
              <p>
                <span className="font-medium">Price:</span> ₹{s.price}
              </p>
              <p>
                <span className="font-medium">Quantity:</span> {s.quantity}
              </p>
            </div>

            {/* 🎯 Action Buttons */}
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Purchase
              </button>
              <button
                onClick={() => handleRestockClick(s.id)}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                Restock
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Restock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg relative">
            <h2 className="text-xl font-semibold text-pink-700 mb-4">Restock Sweet</h2>

            <p className="text-sm text-gray-700 mb-2">Sweet ID: {restockId}</p>

            <input
              type="number"
              placeholder="Enter quantity"
              className="w-full p-2 border border-pink-300 rounded mb-4"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitRestock}
                disabled={!restockQuantity || Number(restockQuantity) <= 0}
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
              >
                Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
