import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  setLoading, 
  setCountries, 
  setPhoneNumber, 
  setCountryCode, 
  setOtpSent, 
  loginSuccess 
} from '../store/slices/authSlice';
import { API_ENDPOINTS } from '../utils/constants';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/helpers';
import { Phone, Lock, Globe, ArrowRight, Loader2 } from 'lucide-react';

// Validation schemas
const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Please select a country'),
  phoneNumber: z.string()
    .min(7, 'Phone number must be at least 7 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});

const otpSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

const AuthPage = () => {
  const dispatch = useDispatch();
  const { isLoading, otpSent, countries, phoneNumber, countryCode } = useSelector(state => state.auth);
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '',
      phoneNumber: '',
    },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.COUNTRIES);
        const data = await response.json();
        
        const formattedCountries = data
          .filter(country => country.idd && country.idd.root)
          .map(country => ({
            name: country.name.common,
            code: country.idd.root + (country.idd.suffixes?.[0] || ''),
            flag: country.flag,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        dispatch(setCountries(formattedCountries));
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to load countries. Please refresh the page.');
      }
    };

    fetchCountries();
  }, [dispatch]);

  const handleSendOTP = async (data) => {
    dispatch(setLoading(true));
    dispatch(setPhoneNumber(data.phoneNumber));
    dispatch(setCountryCode(data.countryCode));

    // Simulate OTP sending
    setTimeout(() => {
      dispatch(setOtpSent(true));
      dispatch(setLoading(false));
      setStep('otp');
      toast.success('OTP sent successfully!');
    }, 2000);
  };

  const handleVerifyOTP = async (data) => {
    dispatch(setLoading(true));

    // Simulate OTP verification
    setTimeout(() => {
      // For demo purposes, accept any 6-digit OTP
      const user = {
        id: generateId(),
        phoneNumber: `${countryCode}${phoneNumber}`,
        name: `User ${phoneNumber.slice(-4)}`,
        createdAt: Date.now(),
      };

      dispatch(loginSuccess(user));
      storage.set(STORAGE_KEYS.AUTH_USER, user);
      dispatch(setLoading(false));
      toast.success('Login successful!');
    }, 1500);
  };

  const handleResendOTP = () => {
    dispatch(setLoading(true));
    
    setTimeout(() => {
      dispatch(setLoading(false));
      toast.success('OTP resent successfully!');
    }, 1000);
  };

  const handleBackToPhone = () => {
    setStep('phone');
    dispatch(setOtpSent(false));
    otpForm.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Gemini Clone
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'phone' ? 'Enter your phone number to get started' : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        <div className="card p-6">
          {step === 'phone' ? (
            <form onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <select
                  {...phoneForm.register('countryCode')}
                  className="input w-full"
                  disabled={isLoading}
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                {phoneForm.formState.errors.countryCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {phoneForm.formState.errors.countryCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...phoneForm.register('phoneNumber')}
                    type="tel"
                    className="input pl-10"
                    placeholder="Enter your phone number"
                    disabled={isLoading}
                  />
                </div>
                {phoneForm.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {phoneForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full h-12 text-base"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...otpForm.register('otp')}
                    type="text"
                    className="input pl-10 text-center text-lg tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
                {otpForm.formState.errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                OTP sent to {countryCode}{phoneNumber}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full h-12 text-base"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="text-primary-600 hover:text-primary-700"
                  disabled={isLoading}
                >
                  Change number
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-primary-600 hover:text-primary-700"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
