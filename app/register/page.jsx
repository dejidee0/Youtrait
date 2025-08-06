"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2 } from 'lucide-react';
import BubbleBackground from '@/components/ui/bubble-background';
import { useRouter } from 'next/navigation';

export default function RegisterTypePage() {
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedType === 'user') {
      router.push('/register/user');
    } else if (selectedType === 'company') {
      router.push('/register/company');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative flex flex-col">
      <BubbleBackground density={12} />
      
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-4">Join YOUTRAIT</h1>
            <p className="text-purple-200 text-lg">Choose how you want to showcase your skills</p>
          </motion.div>

          <div className="space-y-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedType === 'user' 
                    ? 'ring-2 ring-white bg-white/20 backdrop-blur-sm border-white/30' 
                    : 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                }`}
                onClick={() => setSelectedType('user')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                    <User size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">Individual User</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-purple-100">
                    Showcase your skills with animated trait bubbles and get endorsed by your network
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedType === 'company' 
                    ? 'ring-2 ring-white bg-white/20 backdrop-blur-sm border-white/30' 
                    : 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                }`}
                onClick={() => setSelectedType('company')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto bg-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                    <Building2 size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">Company</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-purple-100">
                    Find talent based on verified skills and build high-performing teams
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: selectedType ? 1.02 : 1 }}
            whileTap={{ scale: selectedType ? 0.98 : 1 }}
          >
            <Button
              onClick={handleContinue}
              disabled={!selectedType}
              className="w-full bg-white text-purple-900 hover:bg-purple-50 disabled:bg-white/50 disabled:text-purple-900/50 py-6 text-lg font-semibold rounded-xl"
              size="lg"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}