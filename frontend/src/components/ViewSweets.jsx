import { useEffect, useState } from 'react';
import api from '../api';

export default function ViewSweets() {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    api.get('/').then(res => setSweets(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Sweets</h1>
      <ul className="space-y-2">
        {sweets.map(s => (
          <li key={s.id} className="border p-3 rounded bg-gray-50">
            <strong>{s.name}</strong> ({s.category}) - ₹{s.price} (Qty: {s.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
}
