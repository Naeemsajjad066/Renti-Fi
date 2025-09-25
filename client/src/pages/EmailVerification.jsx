import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Mail, RefreshCw, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { axios } = useContext(AuthContext);
  
  // Get email and userData from location state (passed from SignUp page)
  const email = location.state?.email;
  const userData = location.state?.userData;

  useEffect(() => {
    // Redirect if no email provided
    if (!email) {
      navigate('/signup');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/auth/verify-email', {
        email,
        code,
        userData
      });

      if (data.success) {
        toast.success('Email verified successfully! 🎉');
        // Redirect to login page after short delay
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Account created successfully! Please login.' }
          });
        }, 1500);
      } else {
        toast.error(data.message || 'Verification failed');
        // Clear the code on error
        setVerificationCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      setVerificationCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    
    try {
      const { data } = await axios.post('/api/auth/resend-verification', {
        email,
        fullName: userData?.fullName
      });

      if (data.success) {
        toast.success('New verification code sent!');
        setCountdown(60);
        setCanResend(false);
        setVerificationCode(['', '', '', '', '', '']);
        
        // Restart countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data.message || 'Failed to resend code');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-earth-brown to-soft-peach rounded-lg flex items-center justify-center shadow-md">
                  <Home size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-soft-peach"></div>
              </div>
              <span className="ml-2 text-3xl font-display font-bold">
                <span className="text-earth-brown">Rent</span>
                <span className="text-soft-peach">ifi</span>
              </span>
            </div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-sm font-semibold text-gray-900">{email}</p>
          </div>

          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.join('').length !== 6}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={20} className="animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Verify Email
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendCode}
              disabled={!canResend || isResending}
              className="text-sm text-primary hover:underline disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline"
            >
              {isResending ? (
                'Sending...'
              ) : canResend ? (
                'Resend Code'
              ) : (
                `Resend in ${countdown}s`
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/signup" className="text-sm text-gray-600 hover:text-primary">
              ← Back to Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default EmailVerification;