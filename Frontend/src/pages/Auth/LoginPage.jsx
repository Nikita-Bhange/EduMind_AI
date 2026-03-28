import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  // The focusedField state is used to track which input 
  // field is currently focused and
  //  provide visual feedback by changing the icon color.

   const { login } = useAuth(); 
  //# login function from AuthContext to update auth state on successful login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await authService.login({ email, password });
      login(user, token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-500'>
        <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30' />

        <div className='relative w-full max-w-md px-6'>
          <div className='bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-10'>
            {/**Header */}
            <div className='text-center mb-10'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl  bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-6'>
                <BrainCircuit strokeWidth={2} className='w-7 h-7 text-white' />
              </div>
              <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'> welcome back</h1>
              <p className='text-slate-500 text-sm'> sign in to your account</p>
            </div>
            {/**Form */}
            <div className='space-y-5'>
              <form onSubmit={handleSubmit} className=''>
                <div className='space-y-2'>
                  <label className='block text-xs font-medium text-slate-700 mb-2'>
                    Email
                  </label>
                  <div className='relative group'>
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'}`}>
                      <Mail className='w-4 h-4' strokeWidth={2} />
                    </div>

                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className='w-full h-12 pr-4 pl-12  border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400  text-sm font-medium transition-all duration-200 focus:outline-none focus-border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10'
                      placeholder='Enter your email'
                    />
                  </div>
                </div>

                {/**password */}
                <div className='space-y-2'>
                  <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wide'>
                    password
                  </label>
                  <div className='relative group'>
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      <Lock className='w-4 h-4' strokeWidth={2} />
                    </div>
                    <input
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className='w-full h-12 pr-4 pl-12  border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400  text-sm font-medium transition-all duration-200 focus:outline-none focus-border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10'
                      placeholder='Enter your password'
                    />
                  </div>
                </div>
                {/** error  */}
                {error && (
                  <div className='rounded-lg bg-red-50 border border-red-200 p-3'>
                    <p className='text-xs text-red-600 font-medium text-center'>{error}</p>

                  </div>
                )}

                {/* submitbtn */}
                <button onClick={handleSubmit} disabled={loading} className='mt-2 group relative w-full h-12 
            bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98]
          text-white text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/20
           disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-emerald-500/25 overflow-hidden '>

                  <span className='relative z-10 flex justify-center items-center gap-2'>
                    {loading ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin'></div>Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className='w-4 h-4  group-hover:translate-x-1 transition-transform duration-200' strokeWidth={2.5} />
                      </>
                    )}
                  </span>
                  <div className='absolute inset00  bg-linear-to-r from-white/0 to-white/20  -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
                </button>


              </form>
            </div>

           
            <div className='mt-8 pt-6 border-t border-slate-200/60'>
              <p className='text-center text-sm text-slate-600'>
                Don't have an account?

                <Link to='/register' className='font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200'>
                  Sign Up</Link>

              </p>
            </div>
          </div>



        </div>
      </div>
    </>
  )
}

export default LoginPage