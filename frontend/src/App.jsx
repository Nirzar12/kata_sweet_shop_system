import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddSweet from './components/AddSweet';
import ViewSweets from './components/ViewSweets';
import Header from './components/Header'; // ⬅️ Import Header

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-yellow-50">
        
        <Header /> {/* ⬅️ Add Header here */}
        <Routes>
          <Route path="/" element={<ViewSweets />} />
          <Route path="/add" element={<AddSweet />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
