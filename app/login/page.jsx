"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import BubbleBackground from '@/components/ui/bubble-background';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate login process
    setTimeout(() => {
      if (formData.email && formData.password) {
        router.push('/dashboard');
      } else {
        setError('Please fill in all fields');
        setLoading(false);
      }
    }, 2000);
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative">
      <BubbleBackground density={10} />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <LogIn className="text-white" size={32} />
              </div>
              <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
              <p className="text-purple-200">Sign in to your YOUTRAIT account</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 mt-2"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
                  >
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                >
                  <Button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="w-full bg-white text-purple-900 hover:bg-purple-50 disabled:bg-white/50 py-6 text-lg font-semibold rounded-xl"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </motion.div>

                {/* Forgot Password */}
                <div className="text-center">
                  <Link 
                    href="/forgot-password" 
                    className="text-purple-300 hover:text-white text-sm transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-purple-300 text-sm">
                    Don't have an account?{' '}
                    <Link 
                      href="/register" 
                      className="text-white hover:text-purple-200 font-medium transition-colors"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Back to Welcome */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6"
          >
            <Link href="/">
              <Button
                variant="outline"
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Welcome
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}