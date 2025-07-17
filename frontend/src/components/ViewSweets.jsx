import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CATEGORY_OPTIONS = [
  'All',
  'Milk-Based',
  'Nut-Based',
  'Sugar-Based',
  'Fruit-Based',
  'Flour-Based',
];

export default function ViewSweets() {
  const [sweets, setSweets] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: 'All',
    priceMin: '',
    priceMax: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [restockId, setRestockId] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseId, setPurchaseId] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState('');

  const fetchSweets = async () => {
    const query = new URLSearchParams();

    if (filters.name) query.append('name', filters.name);
    if (filters.category !== 'All') query.append('category', filters.category);
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
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all sweets?")) return;
    try {
      await api.delete("/");
      setSweets([]);
    } catch (err) {
      alert("Failed to delete all: " + (err.response?.data?.error || err.message));
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
      await api.post('/restock', { id: restockId, quantity: Number(restockQuantity) });
      setShowModal(false);
      fetchSweets();
    } catch (err) {
      alert('Restock failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handlePurchaseClick = (id) => {
    setPurchaseId(id);
    setPurchaseQuantity('');
    setShowPurchaseModal(true);
  };

  const submitPurchase = async () => {
    try {
      await api.post('/purchase', { id: purchaseId, quantity: Number(purchaseQuantity) });
      setShowPurchaseModal(false);
      fetchSweets();
    } catch (err) {
      alert('Purchase failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6 bg-[#222831] text-[#EEEEEE] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🍬 Sweet Inventory</h1>
        <div className="flex gap-3">
          <Link to="/add" className="bg-[#00ADB5] text-white px-4 py-2 rounded hover:bg-[#00a1a8]">
            + Add Sweet
          </Link>
          <button onClick={handleDeleteAll} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            🗑️ Delete All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleInputChange}
          className="p-2 border border-[#00ADB5] rounded bg-[#393E46] placeholder-[#AAB0B8] text-[#EEEEEE]"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="p-2 border border-[#00ADB5] rounded bg-[#393E46] text-[#EEEEEE]"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={handleInputChange}
          className="p-2 border border-[#00ADB5] rounded bg-[#393E46] placeholder-[#AAB0B8] text-[#EEEEEE]"
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={handleInputChange}
          className="p-2 border border-[#00ADB5] rounded bg-[#393E46] placeholder-[#AAB0B8] text-[#EEEEEE]"
        />
        <button
          onClick={fetchSweets}
          className="bg-[#00ADB5] text-white py-2 rounded hover:bg-[#009ea4]"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweets.map((s) => (
          <div key={s.id} className="bg-[#393E46] rounded-xl border border-[#00ADB5] shadow p-5">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{s.name}</h2>
              <p className="text-sm italic text-[#AAB0B8]">{s.category}</p>
              <p className="text-xs text-[#AAB0B8] mt-1">ID: {s.id}</p>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Price:</span> ₹{s.price} / 100gm</p>
              <p><span className="font-medium">Quantity:</span> {s.quantity}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handlePurchaseClick(s.id)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Purchase
                </button>
                <button
                  onClick={() => handleRestockClick(s.id)}
                  className="bg-[#00C897] text-white px-3 py-1 rounded hover:bg-[#00b489] text-sm"
                >
                  Restock
                </button>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showModal || showPurchaseModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#393E46] rounded-lg p-6 w-80 shadow relative text-[#EEEEEE]">
            <button
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              onClick={() => {
                setShowModal(false);
                setShowPurchaseModal(false);
              }}
            >
              ❌
            </button>
            <h2 className="text-lg font-semibold mb-3">
              {showModal ? 'Restock Sweet' : 'Purchase Sweet'}
            </h2>
            <p className="text-sm mb-2">
              Sweet ID: {showModal ? restockId : purchaseId}
            </p>
            <input
              type="number"
              placeholder="Enter quantity"
              value={showModal ? restockQuantity : purchaseQuantity}
              onChange={(e) => showModal ? setRestockQuantity(e.target.value) : setPurchaseQuantity(e.target.value)}
              className="w-full p-2 border border-[#00ADB5] rounded mb-4 bg-[#222831] placeholder-[#AAB0B8] text-[#EEEEEE]"
            />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowPurchaseModal(false);
                }}
                className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={showModal ? submitRestock : submitPurchase}
                disabled={!(showModal ? restockQuantity : purchaseQuantity) || Number(showModal ? restockQuantity : purchaseQuantity) <= 0}
                className="bg-[#00ADB5] text-white px-4 py-2 rounded hover:bg-[#009ea4] disabled:opacity-50"
              >
                {showModal ? 'Restock' : 'Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
