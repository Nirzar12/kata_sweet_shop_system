import { useState } from 'react';
import api from '../api';

export default function AddSweet() {
  const [form, setForm] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    quantity: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/', form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Sweet</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        {['id', 'name', 'category', 'price', 'quantity'].map(field => (
          <input
            key={field}
            type="text"
            placeholder={field}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="w-full border p-2 rounded"
          />
        ))}
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Sweet</button>
      </form>
    </div>
  );
}
