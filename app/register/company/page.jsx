"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Clock, Sparkles } from 'lucide-react';
import BubbleBackground from '@/components/ui/bubble-background';

export default function CompanyComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative flex flex-col">
      <BubbleBackground density={10} />
      
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center pb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6"
                >
                  <Building2 size={40} className="text-white" />
                </motion.div>
                <CardTitle className="text-white text-2xl mb-2">Company Features</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="text-purple-300" size={20} />
                  <span className="text-purple-300 text-lg font-medium">Coming Soon</span>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-purple-100 text-lg leading-relaxed">
                  We're building amazing features for companies to discover and connect with skilled professionals.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-purple-200">
                    <Sparkles size={16} />
                    <span>Skill-based talent discovery</span>
                  </div>
                  <div className="flex items-center gap-3 text-purple-200">
                    <Sparkles size={16} />
                    <span>Team skill mapping</span>
                  </div>
                  <div className="flex items-center gap-3 text-purple-200">
                    <Sparkles size={16} />
                    <span>Advanced recruitment tools</span>
                  </div>
                </div>

                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white font-medium mt-6"
                >
                  Stay tuned for the launch!
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}