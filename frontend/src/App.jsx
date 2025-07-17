import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AddSweet from './components/AddSweet';
import ViewSweets from './components/ViewSweets';
import Header from './components/Header';
import BackButton from './components/BackButton';

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE]">
      <Header />
      <main className="p-6 max-w-7xl mx-auto">
        {/* ✅ Only show BackButton if not on home */}
        {location.pathname !== '/' && <BackButton />}
        <Routes>
          <Route path="/" element={<ViewSweets />} />
          <Route path="/add" element={<AddSweet />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
