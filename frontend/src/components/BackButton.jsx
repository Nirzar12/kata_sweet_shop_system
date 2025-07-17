import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-sm text-white hover:text-white hover:bg-[#98A1BC] border border-[#555879] px-3 py-1.5 rounded-lg transition-colors duration-200"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
