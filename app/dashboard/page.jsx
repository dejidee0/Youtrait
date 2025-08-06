"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, TrendingUp, Award, Users, Zap } from 'lucide-react';
import SkillBubble from '@/components/ui/skill-bubble';
import MobileNavigation from '@/components/navigation/mobile-navigation';
import DesktopSidebar from '@/components/navigation/desktop-sidebar';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const validationStatus = searchParams.get('validation');

  useEffect(() => {
    // Simulate loading feed data
    setTimeout(() => {
      setFeedData([
        {
          id: 1,
          user: {
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
            profession: 'UI/UX Designer'
          },
          type: 'endorsement_milestone',
          skill: 'Figma',
          endorsementCount: 50,
          level: 'intermediate',
          timestamp: '2 hours ago',
          endorsers: [
            { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
            { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' }
          ]
        },
        {
          id: 2,
          user: {
            name: 'Marcus Johnson',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            profession: 'Full Stack Developer'
          },
          type: 'skill_godmode',
          skill: 'JavaScript',
          endorsementCount: 300,
          level: 'godmode',
          timestamp: '5 hours ago',
          endorsers: []
        },
        {
          id: 3,
          user: {
            name: 'Emily Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            profession: 'Data Scientist'
          },
          type: 'new_skill',
          skill: 'Machine Learning',
          endorsementCount: 15,
          level: 'beginner',
          timestamp: '1 day ago',
          endorsers: []
        },
        {
          id: 4,
          user: {
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            profession: 'Product Manager'
          },
          type: 'endorsement_received',
          skill: 'Product Strategy',
          endorsementCount: 75,
          level: 'intermediate',
          timestamp: '2 days ago',
          endorsers: [
            { name: 'Lisa Wang', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getPostIcon = (type) => {
    switch (type) {
      case 'endorsement_milestone':
        return <TrendingUp className="text-blue-500" size={20} />;
      case 'skill_godmode':
        return <Zap className="text-yellow-500" size={20} />;
      case 'new_skill':
        return <Award className="text-green-500" size={20} />;
      case 'endorsement_received':
        return <Heart className="text-red-500" size={20} />;
      default:
        return <Users className="text-purple-500" size={20} />;
    }
  };

  const getPostMessage = (post) => {
    switch (post.type) {
      case 'endorsement_milestone':
        return `reached ${post.endorsementCount} endorsements on ${post.skill}!`;
      case 'skill_godmode':
        return `achieved GODMODE status in ${post.skill}! 🔥`;
      case 'new_skill':
        return `added a new skill: ${post.skill}`;
      case 'endorsement_received':
        return `received an endorsement for ${post.skill}`;
      default:
        return 'updated their profile';
    }
  };

  const handleEndorse = (postId, skill) => {
    // Handle endorsement logic
    console.log(`Endorsing ${skill} for post ${postId}`);
  };

  const handleViewProfile = (userId) => {
    router.push(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <div className="p-4 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-20 bg-gray-200 rounded mb-4" />
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded w-20" />
                      <div className="h-8 bg-gray-200 rounded w-24" />
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
          {/* Validation Status Alert */}
          {validationStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                validationStatus === 'passed' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {validationStatus === 'passed' ? (
                  <Award className="text-green-600" size={24} />
                ) : (
                  <TrendingUp className="text-yellow-600" size={24} />
                )}
                <div>
                  <h3 className={`font-semibold ${
                    validationStatus === 'passed' ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {validationStatus === 'passed' 
                      ? 'Skills Validated Successfully!' 
                      : 'Skills Need More Practice'
                    }
                  </h3>
                  <p className={`text-sm ${
                    validationStatus === 'passed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {validationStatus === 'passed'
                      ? 'Your intermediate and expert skills have been verified.'
                      : 'Keep learning and try validation again later.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Welcome to YOUTRAIT
            </h1>
            <p className="text-gray-600">
              Discover what's happening in your professional network
            </p>
          </div>

          {/* Feed */}
          <div className="max-w-2xl mx-auto space-y-6">
            {feedData.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback>
                            {post.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {post.user.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {post.user.profession}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        {getPostIcon(post.type)}
                        <span className="text-sm">{post.timestamp}</span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-800 mb-4">
                        <span className="font-medium">{post.user.name}</span>{' '}
                        {getPostMessage(post)}
                      </p>

                      {/* Skill Bubble */}
                      <div className="flex items-center justify-center py-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                        <SkillBubble
                          skill={post.skill}
                          level={post.level}
                          endorsementCount={post.endorsementCount}
                          size="large"
                          interactive={false}
                        />
                      </div>

                      {/* Endorsers */}
                      {post.endorsers.length > 0 && (
                        <div className="mt-4 flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {post.endorsers.slice(0, 3).map((endorser, i) => (
                              <Avatar key={i} className="w-6 h-6 border-2 border-white">
                                <AvatarImage src={endorser.avatar} />
                                <AvatarFallback className="text-xs">
                                  {endorser.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {post.endorsers.length === 1 
                              ? `${post.endorsers[0].name} endorsed this`
                              : `${post.endorsers[0].name} and ${post.endorsers.length - 1} others endorsed this`
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEndorse(post.id, post.skill)}
                          className="text-gray-600 hover:text-purple-600"
                        >
                          <Heart size={16} className="mr-2" />
                          Endorse
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-purple-600"
                        >
                          <MessageCircle size={16} className="mr-2" />
                          Comment
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(post.user.id)}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Load More */}
            <div className="text-center py-8">
              <Button variant="outline" className="text-purple-600 border-purple-200">
                Load More Posts
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}