"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Globe, MessageCircle, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/trait-universe', icon: Globe, label: 'Universe' },
    { href: '/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className="relative">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}