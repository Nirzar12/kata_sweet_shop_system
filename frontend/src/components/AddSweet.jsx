import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Milk-Based",
  "Nut-Based",
  "Sugar-Based",
  "Fruit-Based",
  "Flour-Based",
];

export default function AddSweet() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // ⬅️ Step 2

  const validate = () => {
    const errs = {};
    if (!form.id || isNaN(form.id) || form.id.length !== 4)
      errs.id = "ID must be a 4-digit number";
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.category || !CATEGORIES.includes(form.category))
      errs.category = "Select a valid category";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = "Enter a valid positive price";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0)
      errs.quantity = "Enter a valid quantity";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const res = await api.post("/", {
        id: Number(form.id),
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
      alert(res.data.message || "Sweet added!");
      setForm({ id: "", name: "", category: "", price: "", quantity: "" });
      setErrors({});
      navigate("/"); // ⬅️ Step 3: redirect to home
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
        ➕ Add Sweet
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* ID */}
        <div>
          <input
            type="number"
            placeholder="Sweet ID (e.g. 1001)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-full border p-2 rounded"
          />
          {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
        </div>

        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Sweet Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <input
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border p-2 rounded"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="w-full border p-2 rounded"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
        >
          Add Sweet
        </button>
      </form>
    </div>
  );
}
