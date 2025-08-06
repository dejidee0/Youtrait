"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, MessageCircle, Share, Award, TrendingUp, Users, MapPin, Calendar, ExternalLink } from 'lucide-react';
import SkillBubble from '@/components/ui/skill-bubble';
import MobileNavigation from '@/components/navigation/mobile-navigation';
import DesktopSidebar from '@/components/navigation/desktop-sidebar';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [endorsements, setEndorsements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skills');

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setProfile({
        id: 1,
        name: 'John Doe',
        profession: 'Full Stack Developer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Love working with React, Node.js, and modern web technologies.',
        location: 'San Francisco, CA',
        joinDate: new Date('2023-01-15'),
        totalEndorsements: 247,
        skillsCount: 12,
        connectionsCount: 156,
        website: 'https://johndoe.dev',
        isOwnProfile: true
      });

      setSkills([
        { id: 1, name: 'JavaScript', level: 'expert', endorsementCount: 85, yearsExperience: 5, category: 'Technology' },
        { id: 2, name: 'React', level: 'expert', endorsementCount: 92, yearsExperience: 4, category: 'Technology' },
        { id: 3, name: 'Node.js', level: 'intermediate', endorsementCount: 67, yearsExperience: 3, category: 'Technology' },
        { id: 4, name: 'Python', level: 'intermediate', endorsementCount: 54, yearsExperience: 2, category: 'Technology' },
        { id: 5, name: 'UI/UX Design', level: 'intermediate', endorsementCount: 43, yearsExperience: 3, category: 'Design' },
        { id: 6, name: 'TypeScript', level: 'intermediate', endorsementCount: 38, yearsExperience: 2, category: 'Technology' },
        { id: 7, name: 'MongoDB', level: 'beginner', endorsementCount: 29, yearsExperience: 2, category: 'Technology' },
        { id: 8, name: 'AWS', level: 'beginner', endorsementCount: 22, yearsExperience: 1, category: 'Technology' },
        { id: 9, name: 'Docker', level: 'beginner', endorsementCount: 18, yearsExperience: 1, category: 'Technology' },
        { id: 10, name: 'GraphQL', level: 'beginner', endorsementCount: 15, yearsExperience: 1, category: 'Technology' },
        { id: 11, name: 'Project Management', level: 'intermediate', endorsementCount: 31, yearsExperience: 3, category: 'Business' },
        { id: 12, name: 'Technical Writing', level: 'beginner', endorsementCount: 12, yearsExperience: 2, category: 'Communication' }
      ]);

      setEndorsements([
        {
          id: 1,
          skill: 'JavaScript',
          endorser: {
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
            profession: 'UI/UX Designer'
          },
          message: 'John is an exceptional JavaScript developer. His code is clean and well-structured.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
        },
        {
          id: 2,
          skill: 'React',
          endorser: {
            name: 'Marcus Johnson',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            profession: 'Full Stack Developer'
          },
          message: 'Worked with John on several React projects. His component architecture is top-notch.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
        },
        {
          id: 3,
          skill: 'Node.js',
          endorser: {
            name: 'Emily Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            profession: 'Data Scientist'
          },
          message: 'John built a robust API for our data pipeline. Great attention to performance and scalability.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <div className="p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <Card className="animate-pulse">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-4 text-center lg:text-left">
                      <div className="h-8 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.name}
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                      {profile.profession}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        Joined {formatDate(profile.joinDate)}
                      </div>
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                        >
                          <ExternalLink size={16} />
                          Portfolio
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-6 max-w-2xl">
                      {profile.bio}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                      {profile.isOwnProfile ? (
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Edit size={16} className="mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <MessageCircle size={16} className="mr-2" />
                            Message
                          </Button>
                          <Button variant="outline">
                            Connect
                          </Button>
                        </>
                      )}
                      <Button variant="outline">
                        <Share size={16} className="mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Award className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {profile.totalEndorsements}
                  </h3>
                  <p className="text-gray-600">Total Endorsements</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {profile.skillsCount}
                  </h3>
                  <p className="text-gray-600">Skills</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {profile.connectionsCount}
                  </h3>
                  <p className="text-gray-600">Connections</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={activeTab === 'skills' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('skills')}
                className="flex-1"
              >
                Skills
              </Button>
              <Button
                variant={activeTab === 'endorsements' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('endorsements')}
                className="flex-1"
              >
                Endorsements
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-600 rounded-full" />
                        {category}
                        <Badge variant="secondary">{categorySkills.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categorySkills.map((skill, index) => (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg"
                          >
                            <SkillBubble
                              skill={skill.name}
                              level={skill.level}
                              endorsementCount={skill.endorsementCount}
                              size="large"
                              interactive={true}
                            />
                            <div className="mt-4 space-y-1">
                              <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                              <p className="text-sm text-gray-600">
                                {skill.yearsExperience} {skill.yearsExperience === 1 ? 'year' : 'years'} experience
                              </p>
                              <p className="text-sm text-gray-500">
                                {skill.endorsementCount} endorsements
                              </p>
                              {!profile.isOwnProfile && (
                                <Button size="sm" variant="outline" className="mt-2">
                                  Endorse
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'endorsements' && (
              <div className="space-y-4">
                {endorsements.map((endorsement, index) => (
                  <motion.div
                    key={endorsement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={endorsement.endorser.avatar} />
                            <AvatarFallback>
                              {endorsement.endorser.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {endorsement.endorser.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {endorsement.endorser.profession}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">{endorsement.skill}</Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatTimeAgo(endorsement.timestamp)}
                                </p>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 italic">
                              "{endorsement.message}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {endorsements.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="text-gray-400" size={32} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No endorsements yet
                      </h3>
                      <p className="text-gray-600">
                        Endorsements from colleagues will appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}