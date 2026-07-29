import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logoseafudsngbayan.png';

type UserRole = 'customer' | 'cashier' | 'kitchen' | 'rider' | 'assistant';

const Login = () => {
  const navigate = useNavigate();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [role, setRole] = useState<UserRole>('customer');
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Error/Success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Business role prevention code (Mock/Standard restaurant admin key)
  const REQUIRED_STAFF_KEY = 'SFB-STAFF-99';

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullname || !username || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept the Terms and Conditions.');
      return;
    }

    // Modern prevention: Validate employee key for business system roles
    if (role !== 'customer') {
      if (!verificationCode) {
        setErrorMessage('Verification is required for business accounts. Please enter your Employee Access Token.');
        return;
      }
      if (verificationCode.trim().toUpperCase() !== REQUIRED_STAFF_KEY) {
        setErrorMessage('Access Denied: Invalid Employee Access Token. Please contact your administrator.');
        return;
      }
    }

    // Success registration logic
    setSuccessMessage(`Account created successfully as ${role.toUpperCase()}! Redirecting...`);
    setTimeout(() => {
      // Direct user to their respective interface based on their role
      if (role === 'cashier') navigate('/sales-report');
      else if (role === 'kitchen') navigate('/kitchen');
      else if (role === 'rider') navigate('/rider');
      else if (role === 'assistant') navigate('/assistant');
      else navigate('/customer');
    }, 2000);
  };

  return (
    <div className="font-sans min-h-screen bg-[#fcfcfc] flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-[1.2rem] px-[4%] bg-white/95 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50 backdrop-blur-[10px] border-b border-black/5 md:flex-row flex-col gap-4 md:gap-0">
        <div className="topnav-left">
          <div className="text-[1.6rem] font-extrabold bg-gradient-to-r from-[#e74c3c] to-[#d35400] bg-clip-text text-transparent tracking-[-0.5px]">Seafudz Ng Bayan</div>
        </div>

        <div className="flex gap-6 md:gap-[2.5rem]">
          <Link to="/dashboard" className="no-underline text-slate-600 font-semibold text-[1rem] transition-all duration-[0.25s] ease relative py-[0.2rem] hover:text-[#e74c3c]">Dashboard</Link>
          <Link to="/about" className="no-underline text-slate-600 font-semibold text-[1rem] transition-all duration-[0.25s] ease relative py-[0.2rem] hover:text-[#e74c3c]">About Us</Link>
          <Link to="/pos" className="no-underline text-slate-600 font-semibold text-[1rem] transition-all duration-[0.25s] ease relative py-[0.2rem] hover:text-[#e74c3c]">Menu & POS</Link>
        </div>

        <Link to="/login" className="no-underline bg-gradient-to-r from-[#d35400] to-[#c0392b] text-white py-[0.7rem] px-[1.6rem] rounded-[50px] font-semibold text-[0.95rem] shadow-[0_4px_15px_rgba(231,76,60,0.25)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(231,76,60,0.35)]">Login / Register</Link>
      </nav>

      {/* Main Login Area */}
      <div className="flex-1 flex justify-center items-center py-[3rem] px-[1.5rem] bg-[radial-gradient(circle_at_top_right,rgba(231,76,60,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(211,84,0,0.05),transparent_40%)]">
        <div className="bg-white w-full max-w-[520px] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-black/[0.04] p-[2.5rem_1.8rem] md:p-[3.5rem_3rem] transition-all duration-300 animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-[2rem]">
            <img src={logo} alt="Logo" className="w-[85px] h-[85px] object-cover rounded-full shadow-[0_8px_20px_rgba(231,76,60,0.15)] mb-[1.2rem] border-[3px] border-white mx-auto" />
            <h1 className="text-[1.8rem] font-extrabold text-[#2d3748] m-0 tracking-[-0.5px]">SEAFUDZ NG BAYAN</h1>
            <p className="text-[0.85rem] text-[#a0aec0] mt-[0.3rem] mb-0 font-medium">By: Joemarie Gobangco & Gelyn Basilio-Alday</p>
          </div>

          {errorMessage && <div className="py-[1rem] px-[1.2rem] rounded-[12px] text-[0.9rem] font-semibold mb-[1.5rem] leading-[1.4] animate-[fadeIn_0.3s_ease] bg-[#fff5f5] text-[#c53030] border border-[#fed7d7]">{errorMessage}</div>}
          {successMessage && <div className="py-[1rem] px-[1.2rem] rounded-[12px] text-[0.9rem] font-semibold mb-[1.5rem] leading-[1.4] animate-[fadeIn_0.3s_ease] bg-[#f0fff4] text-[#22543d] border border-[#c6f6d5]">{successMessage}</div>}

          {!showCreateAccount ? (
            /* Login Form */
            <div>
              <h2 className="text-[1.6rem] font-bold text-[#2d3748] mt-0 mb-[0.4rem]">Welcome Back</h2>
              <p className="text-[0.95rem] text-[#718096] mt-0 mb-[1.5rem]">Please enter your details to sign in</p>
              
              <div className="mb-[1.2rem]">
                <input type="text" placeholder="Username or Email" className="w-full py-[1rem] px-[1.2rem] rounded-[12px] border border-[#e2e8f0] font-sans text-[0.95rem] font-medium text-[#2d3748] transition-all duration-[0.25s] box-border bg-[#f7fafc] focus:outline-none focus:border-[#e74c3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(231,76,60,0.1)]" />
              </div>
              <div className="mb-[1.2rem]">
                <input type="password" placeholder="Password" className="w-full py-[1rem] px-[1.2rem] rounded-[12px] border border-[#e2e8f0] font-sans text-[0.95rem] font-medium text-[#2d3748] transition-all duration-[0.25s] box-border bg-[#f7fafc] focus:outline-none focus:border-[#e74c3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(231,76,60,0.1)]" />
              </div>
              
              <div className="flex justify-between items-center mb-[2rem] text-[0.9rem]">
                <label className="flex items-center gap-[0.5rem] text-[#4a5568] cursor-pointer font-medium">
                  <input type="checkbox" className="accent-[#e74c3c]" /> Remember me
                </label>
                <button type="button" className="bg-none border-none text-[#e74c3c] font-semibold font-sans text-[0.9rem] cursor-pointer p-0 transition-all hover:text-[#c0392b] hover:underline">Forgot Password?</button>
              </div>

              <button className="w-full p-[1rem] bg-gradient-to-r from-[#e74c3c] to-[#d35400] text-white border-none rounded-[12px] font-bold text-[1rem] font-sans cursor-pointer shadow-[0_6px_20px_rgba(231,76,60,0.2)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_25px_rgba(231,76,60,0.35)] mb-[1rem] tracking-[0.5px]" onClick={() => navigate('/customer')}>Login</button>
              <button className="w-full p-[0.9rem] bg-white text-[#4a5568] border border-[#e2e8f0] rounded-[12px] font-semibold text-[0.95rem] font-sans cursor-pointer transition-all duration-[0.25s] flex items-center justify-center gap-[0.8rem] mb-[2rem] hover:bg-[#f7fafc] hover:border-[#cbd5e0]">
                <span className="font-extrabold bg-gradient-to-r from-[#4285f4] via-[#ea4335] via-[#fbbc05] to-[#34a853] bg-clip-text text-transparent">G</span> Sign in with Google
              </button>

              <p className="text-center text-[0.9rem] text-[#718096] m-0">
                Don't have an account? <span className="text-[#e74c3c] font-bold cursor-pointer transition-all hover:text-[#c0392b] hover:underline" onClick={() => setShowCreateAccount(true)}>Create Account</span>
              </p>
            </div>
          ) : (
            /* Create Account Form */
            <form onSubmit={handleRegister}>
              <h2 className="text-[1.6rem] font-bold text-[#2d3748] mt-0 mb-[0.4rem]">Create Account</h2>
              <p className="text-[0.95rem] text-[#718096] mt-0 mb-[1.5rem]">Join us to start ordering fresh seafood</p>
              
              {/* Account Type / Role Selection */}
              <div className="mb-[1.8rem] text-left">
                <label className="text-[0.9rem] font-bold text-[#4a5568] block mb-[0.7rem]">Register As:</label>
                <div className="flex flex-wrap gap-[0.6rem]">
                  {(['customer', 'cashier', 'kitchen', 'rider', 'assistant'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`bg-[#f7fafc] border border-[#e2e8f0] text-[#4a5568] py-[0.6rem] px-[1.1rem] rounded-[50px] text-[0.85rem] font-semibold font-sans cursor-pointer transition-all duration-[0.25s] cubic-bezier(0.165,0.84,0.44,1) hover:bg-[#edf2f7] hover:border-[#cbd5e0] hover:translate-y-[-1px] ${role === r ? 'bg-gradient-to-r from-[#e74c3c] to-[#d35400] text-white border-transparent shadow-[0_4px_12px_rgba(231,76,60,0.2)]' : ''}`}
                      onClick={() => {
                        setRole(r);
                        setErrorMessage('');
                      }}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modern Prevention Field - Slides in when a business role is selected */}
              {role !== 'customer' && (
                <div className="bg-[#fffaf0] border border-[#feebc8] p-[1.2rem] rounded-[14px] mb-[1.5rem] animate-slide-down">
                  <div className="text-[0.85rem] text-[#c05621] font-bold mb-[0.8rem] flex items-center gap-[0.4rem]">
                    ⚠️ Business Role: Employee Access Token Required to Register.
                  </div>
                  <div className="mb-[1.2rem]">
                    <input
                      type="text"
                      placeholder="Enter Employee Access Token"
                      className="w-full py-[1rem] px-[1.2rem] rounded-[12px] border border-[#feebc8] font-sans text-[0.95rem] font-medium text-[#2d3748] transition-all duration-[0.25s] box-border bg-white focus:outline-none focus:border-[#dd6b20] focus:shadow-[0_0_0_4px_rgba(221,107,32,0.1)]"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                  <small className="block mt-[0.4rem] text-[0.78rem] text-[#718096]">
                    For testing purposes, use standard key: <code className="bg-[#edf2f7] py-[0.1rem] px-[0.4rem] rounded font-mono font-bold text-[#2d3748]">SFB-STAFF-99</code>
                  </small>
                </div>
              )}
              
              <div className="mb-[1.2rem]">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full py-[1rem] px-[1.2rem] rounded-[12px] border border-[#e2e8f0] font-sans text-[0.95rem] font-medium text-[#2d3748] transition-all duration-[0.25s] box-border bg-[#f7fafc] focus:outline-none focus:border-[#e74c3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(231,76,60,0.1)]"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="mb-[1.2rem]">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full py-[1rem] px-[1.2rem] rounded-[12px] border border-[#e2e8f0] font-sans text-[0.95rem] font-medium text-[#2d3748] transition-all duration-[0.25s] box-border bg-[#f7fafc] focus:outline-none focus:border-[#e74c3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(231,76,60,0.1)]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-[1.2rem]">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full py-[1rem] px-[1.2rem] rounded-[12px] border border-[#e2e8f0] font-sans text-[0.95rem] font-medium text-[#2d3748] transition-all duration-[0.25s] box-border bg-[#f7fafc] focus:outline-none focus:border-[#e74c3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(231,76,60,0.1)]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-[1.2rem]">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full py-[1rem] px-[1.2rem] rounded-[12px] border border-[#e2e8f0] font-sans text-[0.95rem] font-medium text-[#2d3748] transition-all duration-[0.25s] box-border bg-[#f7fafc] focus:outline-none focus:border-[#e74c3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(231,76,60,0.1)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-[1.2rem]">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full py-[1rem] px-[1.2rem] rounded-[12px] border border-[#e2e8f0] font-sans text-[0.95rem] font-medium text-[#2d3748] transition-all duration-[0.25s] box-border bg-[#f7fafc] focus:outline-none focus:border-[#e74c3c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(231,76,60,0.1)]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-[0.5rem] mb-[2rem] text-[0.9rem] text-[#4a5568] cursor-pointer font-medium">
                <input
                  type="checkbox"
                  className="accent-[#e74c3c]"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                I agree to the Terms and Conditions
              </label>

              <button type="submit" className="w-full p-[1rem] bg-gradient-to-r from-[#e74c3c] to-[#d35400] text-white border-none rounded-[12px] font-bold text-[1rem] font-sans cursor-pointer shadow-[0_6px_20px_rgba(231,76,60,0.2)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_25px_rgba(231,76,60,0.35)] mb-[1rem] tracking-[0.5px]">CREATE ACCOUNT</button>
              
              <p className="text-center text-[0.9rem] text-[#718096] m-0">
                Already have an Account? <span className="text-[#e74c3c] font-bold cursor-pointer transition-all hover:text-[#c0392b] hover:underline" onClick={() => setShowCreateAccount(false)}>Login</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
