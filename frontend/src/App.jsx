import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddSweet from './components/AddSweet';
import ViewSweets from './components/ViewSweets';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ViewSweets />} />
        <Route path="/add" element={<AddSweet />} />
      </Routes>
    </BrowserRouter>
  );
}
