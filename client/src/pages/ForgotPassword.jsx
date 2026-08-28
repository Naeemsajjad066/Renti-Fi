import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Home, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthContext } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: Email input, 2: Code input, 3: New password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        setStep(2);
      } else {
        setErrors({ email: response.message });
      }
    } catch {
      setErrors({
        email: 'Failed to send reset code. Please try again.',
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!code) {
      setErrors({ code: 'Reset code is required' });
      return;
    }

    if (!newPassword) {
      setErrors({ newPassword: 'New password is required' });
      return;
    }

    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      const response = await resetPassword(email, code, newPassword);

      if (response.success) {
        setStep(3);

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ code: response.message });
      }
    } catch {
      setErrors({
        code: 'Failed to reset password. Please try again.',
      });
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await forgotPassword(email);
      if (response.success) {
        toast.success('Reset code sent again');
      }
    } catch {
      toast.error('Failed to resend code');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        {/* Logo */}
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

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center space-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-earth-brown/10 rounded-full mx-auto mb-4">
                {step === 1 && <Mail className="w-8 h-8 text-earth-brown" />}
                {step === 2 && <AlertCircle className="w-8 h-8 text-earth-brown" />}
                {step === 3 && <Check className="w-8 h-8 text-green-600" />}
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900">
                {step === 1 && 'Forgot Password?'}
                {step === 2 && 'Enter Reset Code'}
                {step === 3 && 'Password Reset Successfully!'}
              </CardTitle>

              <CardDescription className="text-gray-600">
                {step === 1 && "Don't worry, we'll send you reset instructions."}
                {step === 2 && `We've sent a 6-digit code to ${email}`}
                {step === 3 &&
                  'Your password has been reset successfully. You can now login with your new password.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Email Input */}
              {step === 1 && (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-earth-brown hover:bg-earth-brown/90 disabled:opacity-50"
                    disabled={!email || !!errors.email}
                  >
                    Send Reset Code
                  </Button>
                </form>
              )}

              {/* Step 2: Code Input and New Password */}
              {step === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="code">Reset Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                      maxLength={6}
                      className={`text-center text-lg tracking-widest ${errors.code ? 'border-red-500' : ''}`}
                    />
                    {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code}</p>}
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password (min. 6 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={errors.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-earth-brown hover:bg-earth-brown/90 disabled:opacity-50"
                    disabled={
                      !code || !newPassword || !confirmPassword || newPassword !== confirmPassword
                    }
                  >
                    Reset Password
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-sm text-earth-brown hover:underline disabled:opacity-50"
                    >
                      Didn't receive the code? Resend
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success Message */}
              {step === 3 && (
                <div className="text-center space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your password has been successfully reset. Redirecting to login...
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={() => navigate('/login')}
                    className="w-full bg-earth-brown hover:bg-earth-brown/90"
                  >
                    Go to Login
                  </Button>
                </div>
              )}

              {/* Back to Login Link */}
              {step !== 3 && (
                <div className="text-center pt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-earth-brown transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
