import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logoseafudsngbayan.png';
import seafoodBilaoImg from '../assets/seafood_bilao.png';
import seafoodCajunImg from '../assets/seafood_cajun.png';
import spicyShrimpImg from '../assets/spicy_shrimp.png';
import crabBucketImg from '../assets/crab_bucket.png';
import garlicButterShrimpImg from '../assets/garlic_butter_shrimp.png';

interface ArchivedItem {
  id: string;
  name: string;
  category: 'Seasonal' | 'Retired Classic' | 'Vault Recipe';
  yearArchived: string;
  description: string;
  originalPrice: number;
  image: string;
  flavorProfile: string;
  status: 'In Vault' | 'Returning Soon' | 'Special Event';
}

const ARCHIVED_ITEMS: ArchivedItem[] = [
  {
    id: 'arch-1',
    name: 'Smoked Garlic Butter Lobster Feast',
    category: 'Seasonal',
    yearArchived: 'Summer 2024',
    description: 'Fresh Atlantic lobster tail sauteed in aged garlic butter with smoked sea salt and sweet corn coblets.',
    originalPrice: 2890,
    image: seafoodBilaoImg,
    flavorProfile: 'Garlic Smoked & Rich',
    status: 'Returning Soon'
  },
  {
    id: 'arch-2',
    name: 'Imperial Cajun King Crab Bucket',
    category: 'Vault Recipe',
    yearArchived: 'Winter 2023',
    description: 'Wild jumbo king crab legs drenched in house-blend 12-spice Cajun rub served with toasted mantou buns.',
    originalPrice: 3450,
    image: crabBucketImg,
    flavorProfile: 'Bold Cajun & Spicy',
    status: 'In Vault'
  },
  {
    id: 'arch-3',
    name: 'Fire-Roasted Chili Tiger Prawns',
    category: 'Retired Classic',
    yearArchived: 'Autumn 2024',
    description: 'Char-grilled tiger prawns glazed with hot bird’s eye chili marmalade and fresh kaffir lime zest.',
    originalPrice: 1450,
    image: spicyShrimpImg,
    flavorProfile: 'Citrusy Zesty Heat',
    status: 'Special Event'
  },
  {
    id: 'arch-4',
    name: 'Bayfront Seafood Paella Supreme',
    category: 'Vault Recipe',
    yearArchived: 'Spring 2024',
    description: 'Spanish saffron rice infused with clam reduction, mussels, squid rings, and giant head-on prawns.',
    originalPrice: 2200,
    image: seafoodCajunImg,
    flavorProfile: 'Savory Saffron & Shellfish',
    status: 'In Vault'
  },
  {
    id: 'arch-5',
    name: 'Crispy Garlic Butter Soft-Shell Crabs',
    category: 'Seasonal',
    yearArchived: 'Monsoon 2024',
    description: 'Golden-fried soft shell crabs tossed in caramelized butter garlic chips and scallion oil.',
    originalPrice: 1680,
    image: garlicButterShrimpImg,
    flavorProfile: 'Crunchy Umami Garlic',
    status: 'Returning Soon'
  },
  {
    id: 'arch-6',
    name: 'Charred Saffron Butter Scallop Tower',
    category: 'Retired Classic',
    yearArchived: 'Winter 2024',
    description: 'Pan-seared jumbo sea scallops stacked over charred cauliflower puree and saffron brown butter.',
    originalPrice: 1950,
    image: spicyShrimpImg,
    flavorProfile: 'Velvety Saffron & Umami',
    status: 'Special Event'
  }
];

const Dashboard: React.FC = () => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<ArchivedItem | null>(null);
  const [isArchiveVisible, setIsArchiveVisible] = useState(false);
  const archiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsArchiveVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (archiveRef.current) {
      observer.observe(archiveRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredItems = activeCategoryFilter === 'All' 
    ? ARCHIVED_ITEMS 
    : ARCHIVED_ITEMS.filter(item => item.category === activeCategoryFilter);

  const scrollToArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('seafood-archive')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-neutral-800 bg-[#faf9f6] min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 px-[4%] bg-white sticky top-0 z-50 border-b border-neutral-200/80 md:flex-row flex-col gap-4 md:gap-0 shadow-2xs">
        <div>
          <span className="text-xl font-bold text-neutral-900 tracking-tight">
            Seafudz Ng Bayan
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-orange-600 font-semibold text-sm">Dashboard</Link>
          <Link to="/about" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors">About Us</Link>
          <Link to="/pos" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors">Menu</Link>
          <a href="#seafood-archive" onClick={scrollToArchive} className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors">Seafood Archive</a>
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
            <Link to="/customer" className="py-3.5 px-8 rounded-xl font-semibold text-sm transition-all bg-orange-600 hover:bg-orange-700 text-white shadow-2xs hover:scale-105 active:scale-95">
              Order Now
            </Link>
            <a href="#seafood-archive" onClick={scrollToArchive} className="py-3.5 px-8 rounded-xl font-semibold text-sm transition-all bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105 active:scale-95">
              Seafood Archive
            </a>
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
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all hover:border-neutral-300 text-left hover:-translate-y-1 duration-200">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Fresh Catch Daily</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Direct from local fishports to our kitchens, ensuring maximum freshness and flavor.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all hover:border-neutral-300 text-left hover:-translate-y-1 duration-200">
            <h3 className="text-base font-bold text-neutral-900 mb-2">6 Branches</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Conveniently located across the city to satisfy your seafood cravings anywhere.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all hover:border-neutral-300 text-left hover:-translate-y-1 duration-200">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Fast Delivery</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Quick hot-and-fresh delivery right to your doorstep, anytime you want.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-2xs transition-all hover:border-neutral-300 text-left hover:-translate-y-1 duration-200">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Warm Service</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Our friendly staff is dedicated to giving you the best dining experience.</p>
          </div>
        </div>
      </div>

      {/* Seafood Archive Section - Museum Exhibition Gallery with Scroll Transitions & Animated Swimming Fish */}
      <div 
        ref={archiveRef}
        id="seafood-archive" 
        className="py-24 px-6 md:px-[8%] bg-[#0c0c0d] text-white relative border-t border-neutral-800/80 overflow-hidden"
      >
        <style>{`
          @keyframes swimRight {
            0% { transform: translateX(-15vw) translateY(0) rotate(0deg); }
            25% { transform: translateX(20vw) translateY(-18px) rotate(-4deg); }
            50% { transform: translateX(50vw) translateY(-30px) rotate(2deg); }
            75% { transform: translateX(80vw) translateY(12px) rotate(5deg); }
            100% { transform: translateX(115vw) translateY(0) rotate(0deg); }
          }
          @keyframes swimLeft {
            0% { transform: translateX(115vw) translateY(0) scaleX(-1) rotate(0deg); }
            25% { transform: translateX(80vw) translateY(20px) scaleX(-1) rotate(4deg); }
            50% { transform: translateX(50vw) translateY(30px) scaleX(-1) rotate(-3deg); }
            75% { transform: translateX(20vw) translateY(-15px) scaleX(-1) rotate(-5deg); }
            100% { transform: translateX(-15vw) translateY(0) scaleX(-1) rotate(0deg); }
          }
          @keyframes swimDiagonal {
            0% { transform: translateX(-15vw) translateY(45px) rotate(-6deg); }
            33% { transform: translateX(25vw) translateY(-10px) rotate(2deg); }
            66% { transform: translateX(70vw) translateY(-35px) rotate(-4deg); }
            100% { transform: translateX(115vw) translateY(15px) rotate(3deg); }
          }
          @keyframes fishWiggle {
            0%, 100% { transform: rotate(0deg) scaleY(1); }
            25% { transform: rotate(2.5deg) scaleY(0.96); }
            50% { transform: rotate(0deg) scaleY(1.03); }
            75% { transform: rotate(-2.5deg) scaleY(0.96); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Subtle ambient spotlight background effect */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-orange-900/10 via-amber-700/5 to-transparent rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${isArchiveVisible ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Animated Background Swimming Fish Silhouettes (School of Fish with realistic body wiggle) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Fish 1 - Large Slow Swimming Right */}
          <div className="absolute top-12 left-0 animate-[swimRight_24s_ease-in-out_infinite] opacity-25">
            <svg className="w-24 h-12 text-orange-500/30 animate-[fishWiggle_1.8s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
            </svg>
          </div>

          {/* Fish 2 - Medium Swimming Left */}
          <div className="absolute top-1/4 left-0 animate-[swimLeft_28s_ease-in-out_infinite] opacity-20" style={{ animationDelay: '3s' }}>
            <svg className="w-20 h-10 text-amber-500/25 animate-[fishWiggle_1.5s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
            </svg>
          </div>

          {/* Fish 3 - Small Fast Swimming Right */}
          <div className="absolute top-1/3 left-0 animate-[swimRight_14s_ease-in-out_infinite] opacity-30" style={{ animationDelay: '1s' }}>
            <svg className="w-14 h-7 text-orange-400/30 animate-[fishWiggle_1.2s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
            </svg>
          </div>

          {/* Fish 4 - Small School Follower 1 */}
          <div className="absolute top-[36%] left-0 animate-[swimRight_14s_ease-in-out_infinite] opacity-25" style={{ animationDelay: '1.8s' }}>
            <svg className="w-10 h-5 text-amber-400/25 animate-[fishWiggle_1.1s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
            </svg>
          </div>

          {/* Fish 5 - Medium Swimming Left Fast */}
          <div className="absolute top-1/2 left-0 animate-[swimLeft_16s_ease-in-out_infinite] opacity-20" style={{ animationDelay: '5s' }}>
            <svg className="w-18 h-9 text-orange-600/25 animate-[fishWiggle_1.4s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
            </svg>
          </div>

          {/* Fish 6 - Diagonal Swimming Fish */}
          <div className="absolute top-[65%] left-0 animate-[swimDiagonal_22s_ease-in-out_infinite] opacity-20" style={{ animationDelay: '2s' }}>
            <svg className="w-22 h-11 text-amber-600/20 animate-[fishWiggle_1.7s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
            </svg>
          </div>

          {/* Fish 7 - Bottom Swimming Right Med */}
          <div className="absolute bottom-16 left-0 animate-[swimRight_19s_ease-in-out_infinite] opacity-25" style={{ animationDelay: '7s' }}>
            <svg className="w-16 h-8 text-orange-500/25 animate-[fishWiggle_1.6s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
            </svg>
          </div>

          {/* Fish 8 - Small Follower Bottom */}
          <div className="absolute bottom-12 left-0 animate-[swimRight_19s_ease-in-out_infinite] opacity-20" style={{ animationDelay: '8s' }}>
            <svg className="w-12 h-6 text-amber-400/20 animate-[fishWiggle_1.3s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
              <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
            </svg>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Header with scroll reveal */}
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-neutral-800/80 transition-all duration-700 ease-out ${isArchiveVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <span className="text-[11px] font-medium tracking-[0.25em] text-orange-500/90 uppercase block mb-2">
                Exhibition Gallery
              </span>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white font-serif">
                Seafood Archive
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Seasonal', 'Vault Recipe', 'Retired Classic'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 rounded-sm cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-white text-black font-semibold shadow-md scale-105'
                      : 'text-neutral-400 hover:text-white bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Museum Exhibition Cards Grid with Staggered Scroll Entrance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{ transitionDelay: `${isArchiveVisible ? idx * 120 : 0}ms` }}
                className={`group bg-neutral-900/40 rounded-sm border border-neutral-800/80 p-3.5 hover:border-neutral-600 transition-all duration-700 ease-out cursor-pointer flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)] ${
                  isArchiveVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                }`}
              >
                {/* Museum Picture Frame */}
                <div className="relative h-64 bg-neutral-950 overflow-hidden rounded-xs border border-neutral-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-108 transition-all duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23121212'/><text y='55' x='20' font-size='11' fill='%23525252'>EXHIBIT</text></svg>";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>

                  {/* Exhibit Tag Overlay */}
                  <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest text-neutral-400 bg-black/70 px-2 py-0.5 border border-neutral-800 backdrop-blur-xs">
                    N° {String(idx + 1).padStart(2, '0')} • {item.yearArchived}
                  </div>
                </div>

                {/* Museum Plaque Label */}
                <div className="pt-4 pb-1 px-1 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-serif tracking-wide text-neutral-100 group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] tracking-wider text-neutral-500 uppercase mt-0.5">
                      {item.category}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500 group-hover:text-white transition-colors">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Museum Exhibition Lightbox Preview */}
          {selectedItem && (
            <div 
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-900 border border-neutral-800 rounded-sm max-w-2xl w-full overflow-hidden shadow-2xl relative text-left animate-in zoom-in-95 duration-300"
              >
                <div className="relative h-80 md:h-96 bg-black">
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
                  
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 bg-black/70 text-neutral-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center border border-neutral-800 text-xs transition-colors cursor-pointer"
                  >
                    ✕
                  </button>

                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-[10px] font-mono tracking-widest text-orange-400 uppercase block mb-1">
                      Archive Exhibit • {selectedItem.yearArchived}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif text-white">{selectedItem.name}</h3>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  <p className="text-sm text-neutral-300 font-serif leading-relaxed italic border-l-2 border-orange-500/80 pl-4">
                    "{selectedItem.description}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-4 border-t border-neutral-800 font-mono">
                    <span>CATEGORY: {selectedItem.category.toUpperCase()}</span>
                    <span>STATUS: {selectedItem.status.toUpperCase()}</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-6 py-2.5 rounded-sm transition-colors cursor-pointer"
                    >
                      Close Exhibit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



