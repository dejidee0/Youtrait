"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Award, TrendingUp, Users, CheckCircle, X } from 'lucide-react';
import MobileNavigation from '@/components/navigation/mobile-navigation';
import DesktopSidebar from '@/components/navigation/desktop-sidebar';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'endorsements', label: 'Endorsements' },
    { value: 'messages', label: 'Messages' },
    { value: 'achievements', label: 'Achievements' },
    { value: 'connections', label: 'Connections' }
  ];

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'endorsement',
          title: 'New Endorsement',
          message: 'Sarah Chen endorsed your JavaScript skill',
          user: {
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
            profession: 'UI/UX Designer'
          },
          skill: 'JavaScript',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false,
          actionable: true
        },
        {
          id: 2,
          type: 'achievement',
          title: 'Skill Level Up!',
          message: 'Your React skill reached Intermediate level (50 endorsements)',
          skill: 'React',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isRead: false,
          actionable: false
        },
        {
          id: 3,
          type: 'message',
          title: 'New Message',
          message: 'Marcus Johnson sent you a message',
          user: {
            name: 'Marcus Johnson',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            profession: 'Full Stack Developer'
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true,
          actionable: true
        },
        {
          id: 4,
          type: 'endorsement',
          title: 'New Endorsement',
          message: 'Emily Rodriguez endorsed your Python skill',
          user: {
            name: 'Emily Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            profession: 'Data Scientist'
          },
          skill: 'Python',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          isRead: true,
          actionable: true
        },
        {
          id: 5,
          type: 'achievement',
          title: 'Milestone Reached!',
          message: 'You\'ve received 100 total endorsements across all skills',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isRead: true,
          actionable: false
        },
        {
          id: 6,
          type: 'connection',
          title: 'New Connection',
          message: 'David Kim wants to connect with you',
          user: {
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            profession: 'Product Manager'
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          isRead: true,
          actionable: true
        },
        {
          id: 7,
          type: 'endorsement',
          title: 'New Endorsement',
          message: 'Lisa Wang endorsed your UI/UX Design skill',
          user: {
            name: 'Lisa Wang',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            profession: 'Product Designer'
          },
          skill: 'UI/UX Design',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          isRead: true,
          actionable: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'endorsement':
        return <Heart className="text-red-500" size={20} />;
      case 'message':
        return <MessageCircle className="text-blue-500" size={20} />;
      case 'achievement':
        return <Award className="text-yellow-500" size={20} />;
      case 'connection':
        return <Users className="text-green-500" size={20} />;
      default:
        return <TrendingUp className="text-purple-500" size={20} />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'endorsements') return notification.type === 'endorsement';
    if (filter === 'messages') return notification.type === 'message';
    if (filter === 'achievements') return notification.type === 'achievement';
    if (filter === 'connections') return notification.type === 'connection';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleAction = (notification) => {
    switch (notification.type) {
      case 'endorsement':
        // Navigate to profile or endorse back
        console.log('Navigate to endorsement action');
        break;
      case 'message':
        // Navigate to chat
        console.log('Navigate to chat');
        break;
      case 'connection':
        // Accept/decline connection
        console.log('Handle connection request');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <div className="p-4 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />
      
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Notifications
                </h1>
                <p className="text-gray-600">
                  Stay updated with your professional network
                </p>
              </div>
              
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Mark all as read ({unreadCount})
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filterOptions.map(option => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(option.value)}
                  className="whitespace-nowrap"
                >
                  {option.label}
                  {option.value === 'all' && unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-w-2xl mx-auto space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-600">
                    You're all caught up! Check back later for updates.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`hover:shadow-md transition-shadow ${
                    !notification.isRead ? 'ring-2 ring-purple-100 bg-purple-50/30' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Icon or Avatar */}
                          <div className="flex-shrink-0">
                            {notification.user ? (
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={notification.user.avatar} />
                                <AvatarFallback>
                                  {notification.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                              )}
                            </div>
                            
                            <p className="text-gray-700 text-sm mb-2">
                              {notification.message}
                            </p>

                            {notification.user && (
                              <p className="text-xs text-gray-500 mb-2">
                                {notification.user.profession}
                              </p>
                            )}

                            {notification.skill && (
                              <Badge variant="secondary" className="text-xs mb-2">
                                {notification.skill}
                              </Badge>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>

                              {notification.actionable && (
                                <div className="flex items-center space-x-2">
                                  {notification.type === 'connection' && (
                                    <>
                                      <Button size="sm" variant="outline" className="text-xs">
                                        Decline
                                      </Button>
                                      <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700">
                                        Accept
                                      </Button>
                                    </>
                                  )}
                                  {notification.type === 'endorsement' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs text-purple-600 border-purple-200 hover:bg-purple-50"
                                      onClick={() => handleAction(notification)}
                                    >
                                      Endorse Back
                                    </Button>
                                  )}
                                  {notification.type === 'message' && (
                                    <Button
                                      size="sm"
                                      className="text-xs bg-purple-600 hover:bg-purple-700"
                                      onClick={() => handleAction(notification)}
                                    >
                                      Reply
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <CheckCircle size={16} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}