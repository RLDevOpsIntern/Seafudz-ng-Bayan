import { Link } from 'react-router-dom';
import logo from '../assets/logoseafudsngbayan.png';

const Dashboard = () => {
  return (
    <div className="font-sans text-gray-800 bg-[#fcfcfc] min-h-screen m-0 p-0">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-[1.2rem] px-[4%] bg-white/95 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50 backdrop-blur-[10px] border-b border-black/5 md:flex-row flex-col gap-4 md:gap-0">
        <div className="topnav-left">
          <div className="text-[1.6rem] font-extrabold bg-gradient-to-r from-[#e74c3c] to-[#d35400] bg-clip-text text-transparent tracking-[-0.5px]">Seafudz Ng Bayan</div>
        </div>

        <div className="flex gap-6 md:gap-[2.5rem]">
          <Link to="/dashboard" className="no-underline text-[#e74c3c] font-semibold text-[1rem] transition-all duration-[0.25s] ease relative py-[0.2rem] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#e74c3c] after:to-[#d35400] after:rounded-[2px]">Dashboard</Link>
          <Link to="/about" className="no-underline text-slate-600 font-semibold text-[1rem] transition-all duration-[0.25s] ease relative py-[0.2rem] hover:text-[#e74c3c]">About Us</Link>
          <Link to="/pos" className="no-underline text-slate-600 font-semibold text-[1rem] transition-all duration-[0.25s] ease relative py-[0.2rem] hover:text-[#e74c3c]">Menu & POS</Link>
        </div>

        <Link to="/login" className="no-underline bg-gradient-to-r from-[#e74c3c] to-[#d35400] text-white py-[0.7rem] px-[1.6rem] rounded-[50px] font-semibold text-[0.95rem] shadow-[0_4px_15px_rgba(231,76,60,0.25)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(231,76,60,0.35)]">Login / Register</Link>
      </nav>

      {/* Hero Section with logo background */}
      <div 
        className="min-h-[80vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-center text-white p-[2rem] relative" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url(${logo})` 
        }}
      >
        <div className="max-w-[800px] animate-fade-in-up">
          <h1 className="text-[2.6rem] md:text-[3.8rem] font-extrabold mb-[1.2rem] tracking-[-1.5px] leading-[1.15] [text-shadow:0_4px_12px_rgba(0,0,0,0.25)]">Welcome to Seafudz Ng Bayan</h1>
          <p className="text-[1.1rem] md:text-[1.35rem] font-light tracking-[1px] mb-[2rem] md:mb-[2.5rem] text-white/90 [text-shadow:0_2px_5px_rgba(0,0,0,0.2)]">Fresh Seafood • Dine-in • Take-out • Delivery • 24/7</p>
          <div className="flex gap-[1.5rem] justify-center flex-wrap">
            <Link to="/customer" className="no-underline py-[1rem] px-[2.2rem] rounded-[50px] font-bold text-[1.05rem] transition-all duration-300 bg-gradient-to-r from-[#e74c3c] to-[#d35400] text-white shadow-[0_6px_25px_rgba(231,76,60,0.4)] hover:translate-y-[-3px] hover:shadow-[0_10px_30px_rgba(231,76,60,0.55)]">Order Online</Link>
            <Link to="/pos" className="no-underline py-[1rem] px-[2.2rem] rounded-[50px] font-bold text-[1.05rem] transition-all duration-300 bg-white/15 text-white backdrop-blur-[10px] border border-white/30 hover:bg-white/25 hover:translate-y-[-3px]">Open POS System</Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-[4rem] px-[1.5rem] md:py-[6rem] md:px-[8%] md:pb-[7rem] text-center max-w-[1200px] mx-auto">
        <h2 className="text-[2.5rem] font-extrabold text-[#2d3748] mb-[1rem] tracking-[-0.5px]">Why Choose Us?</h2>
        <p className="text-[1.15rem] text-[#718096] max-w-[700px] mx-auto mb-[4rem] leading-[1.6]">
          We source the finest, freshest catch daily to bring you authentic and delicious seafood experiences across all our branches.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[2rem]">
          <div className="bg-white p-[3rem_2rem] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-black/[0.03] transition-all duration-300 flex flex-col items-center hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#e74c3c]/15 group">
            <div className="text-[2.8rem] mb-[1.5rem] bg-[#e74c3c]/[0.06] w-[80px] h-[80px] flex items-center justify-center rounded-full text-[#e74c3c] transition-all duration-300 group-hover:bg-[#e74c3c]/10 group-hover:scale-[1.1]">🐟</div>
            <h3 className="text-[1.3rem] font-bold text-[#2d3748] mb-[0.8rem]">Fresh Catch Daily</h3>
            <p className="text-[0.95rem] text-[#718096] leading-[1.5] m-0">Direct from local fishports to our kitchens, ensuring maximum freshness and flavor.</p>
          </div>
          <div className="bg-white p-[3rem_2rem] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-black/[0.03] transition-all duration-300 flex flex-col items-center hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#e74c3c]/15 group">
            <div className="text-[2.8rem] mb-[1.5rem] bg-[#e74c3c]/[0.06] w-[80px] h-[80px] flex items-center justify-center rounded-full text-[#e74c3c] transition-all duration-300 group-hover:bg-[#e74c3c]/10 group-hover:scale-[1.1]">📍</div>
            <h3 className="text-[1.3rem] font-bold text-[#2d3748] mb-[0.8rem]">6 Branches</h3>
            <p className="text-[0.95rem] text-[#718096] leading-[1.5] m-0">Conveniently located across the city to satisfy your seafood cravings anywhere.</p>
          </div>
          <div className="bg-white p-[3rem_2rem] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-black/[0.03] transition-all duration-300 flex flex-col items-center hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#e74c3c]/15 group">
            <div className="text-[2.8rem] mb-[1.5rem] bg-[#e74c3c]/[0.06] w-[80px] h-[80px] flex items-center justify-center rounded-full text-[#e74c3c] transition-all duration-300 group-hover:bg-[#e74c3c]/10 group-hover:scale-[1.1]">🚀</div>
            <h3 className="text-[1.3rem] font-bold text-[#2d3748] mb-[0.8rem]">Fast Delivery</h3>
            <p className="text-[0.95rem] text-[#718096] leading-[1.5] m-0">Quick hot-and-fresh delivery right to your doorstep, anytime you want.</p>
          </div>
          <div className="bg-white p-[3rem_2rem] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-black/[0.03] transition-all duration-300 flex flex-col items-center hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#e74c3c]/15 group">
            <div className="text-[2.8rem] mb-[1.5rem] bg-[#e74c3c]/[0.06] w-[80px] h-[80px] flex items-center justify-center rounded-full text-[#e74c3c] transition-all duration-300 group-hover:bg-[#e74c3c]/10 group-hover:scale-[1.1]">❤️</div>
            <h3 className="text-[1.3rem] font-bold text-[#2d3748] mb-[0.8rem]">Warm Service</h3>
            <p className="text-[0.95rem] text-[#718096] leading-[1.5] m-0">Our friendly staff is dedicated to giving you the best dining experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

