import { Link } from 'react-router-dom';
import logo from '../assets/logoseafudsngbayan.png';

const Dashboard = () => {
  return (
    <div className="font-sans text-neutral-800 bg-[#faf9f6] min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 px-[4%] bg-white sticky top-0 z-50 border-b border-neutral-200/80 md:flex-row flex-col gap-4 md:gap-0 shadow-2xs">
        <div>
          <span className="text-xl font-bold text-neutral-900 tracking-tight">Seafudz Ng Bayan</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-orange-600 font-semibold text-sm">Dashboard</Link>
          <Link to="/about" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors">About Us</Link>
          <Link to="/pos" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors">Menu & POS</Link>
        </div>

        <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-5 rounded-xl font-semibold text-sm transition-all shadow-2xs">Login / Register</Link>
      </nav>

      {/* Hero Section */}
      <div 
        className="min-h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-center text-white p-8 relative" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.75), rgba(15, 15, 15, 0.85)), url(${logo})` 
        }}
      >
        <div className="max-w-[750px] animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">Welcome to Seafudz Ng Bayan</h1>
          <p className="text-base md:text-lg font-normal tracking-wide mb-8 text-neutral-200">Fresh Seafood • Dine-in • Take-out • Delivery</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/customer" className="py-3 px-6 rounded-xl font-semibold text-sm transition-all bg-orange-600 hover:bg-orange-700 text-white shadow-2xs">Order Online</Link>
            <Link to="/pos" className="py-3 px-6 rounded-xl font-semibold text-sm transition-all bg-white/15 text-white border border-white/20 hover:bg-white/25">Open POS System</Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 px-6 md:py-20 md:px-[8%] max-w-[1200px] mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 tracking-tight">Why Choose Us?</h2>
        <p className="text-sm md:text-base text-neutral-500 max-w-[600px] mx-auto mb-12 leading-relaxed">
          We source the finest, freshest catch daily to bring you authentic and delicious seafood experiences.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all hover:border-neutral-300 text-left">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Fresh Catch Daily</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Direct from local fishports to our kitchens, ensuring maximum freshness and flavor.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all hover:border-neutral-300 text-left">
            <h3 className="text-base font-bold text-neutral-900 mb-2">6 Branches</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Conveniently located across the city to satisfy your seafood cravings anywhere.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all hover:border-neutral-300 text-left">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Fast Delivery</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Quick hot-and-fresh delivery right to your doorstep, anytime you want.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all hover:border-neutral-300 text-left">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Warm Service</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Our friendly staff is dedicated to giving you the best dining experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

