import React from 'react'

export const OceanCreatures: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes swimRight {
          0% { transform: translateX(-15vw) translateY(0) rotate(0deg); }
          25% { transform: translateX(20vw) translateY(-20px) rotate(3deg); }
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
        @keyframes fishWiggle {
          0%, 100% { transform: rotate(0deg) scaleY(1); }
          25% { transform: rotate(2.5deg) scaleY(0.96); }
          50% { transform: rotate(0deg) scaleY(1.03); }
          75% { transform: rotate(-2.5deg) scaleY(0.96); }
        }
        @keyframes crabSwimRight {
          0% { transform: translateX(-15vw) translateY(0px) rotate(-4deg); }
          25% { transform: translateX(20vw) translateY(-15px) rotate(4deg); }
          50% { transform: translateX(55vw) translateY(10px) rotate(-4deg); }
          75% { transform: translateX(85vw) translateY(-10px) rotate(3deg); }
          100% { transform: translateX(115vw) translateY(0px) rotate(-4deg); }
        }
        @keyframes crabPaddle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(4deg); }
        }
        @keyframes squidSwim {
          0% { transform: translateX(115vw) translateY(10px) rotate(3deg); }
          33% { transform: translateX(70vw) translateY(-20px) rotate(-3deg); }
          66% { transform: translateX(30vw) translateY(15px) rotate(2deg); }
          100% { transform: translateX(-15vw) translateY(0px) rotate(0deg); }
        }
        @keyframes squidPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08) scaleX(0.94); }
        }
      `}</style>

      {/* Swimming Fish 1 */}
      <div className="absolute top-12 left-0 animate-[swimRight_24s_ease-in-out_infinite] opacity-25">
        <svg className="w-24 h-12 text-white/40 animate-[fishWiggle_1.8s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
          <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
        </svg>
      </div>

      {/* Swimming Crab */}
      <div className="absolute top-1/3 left-0 animate-[crabSwimRight_22s_linear_infinite] opacity-30" style={{ animationDelay: '2s' }}>
        <svg className="w-20 h-16 text-orange-400/40 animate-[crabPaddle_1.5s_ease-in-out_infinite]" viewBox="0 0 100 80" fill="currentColor">
          <path d="M 25 45 C 25 28 75 28 75 45 C 75 58 25 58 25 45 Z" />
          <path d="M 30 35 C 18 20 8 28 20 38 C 24 40 28 42 32 44 Z" />
          <path d="M 70 35 C 82 20 92 28 80 38 C 76 40 72 42 68 44 Z" />
          <path d="M 28 48 C 18 52 12 60 14 66 M 32 52 C 22 58 18 68 20 74 M 36 55 C 28 62 25 72 27 78" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 72 48 C 82 52 88 60 86 66 M 68 52 C 78 58 82 68 80 74 M 64 55 C 72 62 75 72 73 78" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="42" cy="28" r="3.5" />
          <circle cx="58" cy="28" r="3.5" />
        </svg>
      </div>

      {/* Swimming Squid 1 (Main Leader) */}
      <div className="absolute top-[45%] right-0 animate-[squidSwim_20s_linear_infinite] opacity-35">
        <svg className="w-22 h-14 text-[#94d2bd] animate-[squidPulse_2s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
          <path d="M 70 30 C 55 16 20 16 10 30 C 20 44 55 44 70 30 Z" />
          <path d="M 12 30 L 2 18 L 18 25 Z M 12 30 L 2 42 L 18 35 Z" />
          <path d="M 70 24 C 82 20 92 22 98 25 M 70 28 C 84 27 94 28 100 30 M 70 32 C 84 33 94 32 100 30 M 70 36 C 82 40 92 38 98 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Swimming Squid 2 (Upper Companion) */}
      <div className="absolute top-[22%] right-0 animate-[squidSwim_24s_linear_infinite] opacity-25" style={{ animationDelay: '4s' }}>
        <svg className="w-16 h-10 text-[#caf0f8] animate-[squidPulse_1.8s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
          <path d="M 70 30 C 55 16 20 16 10 30 C 20 44 55 44 70 30 Z" />
          <path d="M 12 30 L 2 18 L 18 25 Z M 12 30 L 2 42 L 18 35 Z" />
          <path d="M 70 24 C 82 20 92 22 98 25 M 70 28 C 84 27 94 28 100 30 M 70 32 C 84 33 94 32 100 30 M 70 36 C 82 40 92 38 98 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Swimming Squid 3 (Lower Deep Water Cruiser) */}
      <div className="absolute bottom-[25%] left-0 animate-[swimRight_26s_linear_infinite] opacity-30" style={{ animationDelay: '8s' }}>
        <svg className="w-20 h-12 text-[#94d2bd] animate-[squidPulse_2.2s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
          <path d="M 30 30 C 45 16 80 16 90 30 C 80 44 45 44 30 30 Z" />
          <path d="M 88 30 L 98 18 L 82 25 Z M 88 30 L 98 42 L 82 35 Z" />
          <path d="M 30 24 C 18 20 8 22 2 25 M 30 28 C 16 27 6 28 0 30 M 30 32 C 16 33 6 32 0 30 M 30 36 C 18 40 8 38 2 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Swimming Fish 2 */}
      <div className="absolute top-1/4 left-0 animate-[swimLeft_28s_ease-in-out_infinite] opacity-20" style={{ animationDelay: '3s' }}>
        <svg className="w-20 h-10 text-[#94d2bd]/35 animate-[fishWiggle_1.5s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
          <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
        </svg>
      </div>

      {/* Swimming Fish 3 */}
      <div className="absolute top-1/3 left-0 animate-[swimRight_14s_ease-in-out_infinite] opacity-30" style={{ animationDelay: '1s' }}>
        <svg className="w-14 h-7 text-white/40 animate-[fishWiggle_1.2s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
          <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
        </svg>
      </div>

      {/* Swimming Fish 4 */}
      <div className="absolute bottom-16 left-0 animate-[swimRight_19s_ease-in-out_infinite] opacity-25" style={{ animationDelay: '7s' }}>
        <svg className="w-16 h-8 text-[#94d2bd]/35 animate-[fishWiggle_1.6s_ease-in-out_infinite]" viewBox="0 0 100 60" fill="currentColor">
          <path d="M10,30 Q35,5 65,30 Q35,55 10,30 Z M65,30 L92,12 L82,30 L92,48 Z M40,14 Q52,6 58,14" />
        </svg>
      </div>
    </div>
  )
}

export default OceanCreatures
