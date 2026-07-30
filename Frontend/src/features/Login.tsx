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
    <div className="font-sans min-h-screen bg-[#faf9f6] flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 px-[4%] bg-white sticky top-0 z-50 border-b border-neutral-200/80 md:flex-row flex-col gap-4 md:gap-0 shadow-2xs">
        <div>
          <span className="text-xl font-bold text-neutral-900 tracking-tight">Seafudz Ng Bayan</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors">Dashboard</Link>
          <Link to="/about" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors">About Us</Link>
          <Link to="/pos" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors">Menu & POS</Link>
        </div>

        <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-5 rounded-xl font-semibold text-sm transition-all shadow-2xs">Login / Register</Link>
      </nav>

      {/* Main Login Area */}
      <div className="flex-1 flex justify-center items-center py-12 px-6">
        <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xs border border-neutral-200/80 p-8 sm:p-10 transition-all">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="w-16 h-16 object-cover rounded-full mb-3 border border-neutral-200 mx-auto" />
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">SEAFUDZ NG BAYAN</h1>
            <p className="text-xs text-neutral-400 mt-1 font-medium">By: Joemarie Gobangco & Gelyn Basilio-Alday</p>
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
