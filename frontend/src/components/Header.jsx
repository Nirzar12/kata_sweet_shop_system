import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-[#222831] py-5 shadow-md border-b border-[#393E46] text-center rounded-b-xl">
      <Link
        to="/"
        className="block group focus:outline-none  rounded transition-all duration-200"
        aria-label="Go to Home"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[#EEEEEE] tracking-tight group-hover:text-[#00ADB5]">
          Sweet Shop Management
        </h1>
        <p className="mt-1 text-sm md:text-base text-[#00ADB5] font-medium group-hover:text-[#EEEEEE]">
          Simple. Elegant. Efficient.
        </p>
      </Link>
    </header>
  );
};

export default Header;
