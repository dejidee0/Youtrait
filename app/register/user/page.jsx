"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, FileText, Eye, EyeOff } from 'lucide-react';
import BubbleBackground from '@/components/ui/bubble-background';
import { useRouter } from 'next/navigation';

export default function UserRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profilePicture: null,
    resume: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const profileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, resume: file });
      setResumeUploaded(true);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      if (formData.resume) {
        router.push('/register/skills-extracted');
      } else {
        router.push('/register/skills-manual');
      }
    }, 2000);
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative">
      <BubbleBackground density={8} />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Create Your Profile</CardTitle>
              <p className="text-purple-200">Join the skill-based social network</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Avatar 
                      className="w-20 h-20 mx-auto cursor-pointer border-2 border-white/30 hover:border-white/50 transition-colors"
                      onClick={() => profileInputRef.current?.click()}
                    >
                      <AvatarImage src={profilePreview} />
                      <AvatarFallback className="bg-purple-500/30 text-white">
                        {profilePreview ? (
                          <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                  <p className="text-purple-200 text-sm mt-2">Click to upload profile picture</p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
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

                {/* Resume Upload */}
                <div>
                  <Label className="text-white">Resume (Optional)</Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      resumeUploaded 
                        ? 'border-green-400 bg-green-400/10' 
                        : 'border-white/30 hover:border-white/50'
                    }`}
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    <FileText size={32} className={resumeUploaded ? 'text-green-400' : 'text-purple-300'} />
                    <p className={`mt-2 text-sm ${resumeUploaded ? 'text-green-300' : 'text-purple-300'}`}>
                      {resumeUploaded ? 'Resume uploaded!' : 'Upload your resume (PDF) for skill extraction'}
                    </p>
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleResumeUpload}
                    />
                  </motion.div>
                </div>

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
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}