"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Maximize2, Minimize2, Users, TrendingUp } from 'lucide-react';
import SkillBubble from '@/components/ui/skill-bubble';
import MobileNavigation from '@/components/navigation/mobile-navigation';
import DesktopSidebar from '@/components/navigation/desktop-sidebar';

export default function TraitUniversePage() {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);

  const categories = [
    'all', 'Technology', 'Design', 'Marketing', 'Business', 'Data', 'Communication'
  ];

  useEffect(() => {
    // Simulate loading global skills data
    setTimeout(() => {
      setSkills([
        { id: 1, name: 'JavaScript', category: 'Technology', totalUsers: 15420, avgEndorsements: 85, level: 'expert', connections: ['React', 'Node.js', 'TypeScript'] },
        { id: 2, name: 'React', category: 'Technology', totalUsers: 12350, avgEndorsements: 92, level: 'expert', connections: ['JavaScript', 'Next.js', 'Redux'] },
        { id: 3, name: 'Python', category: 'Technology', totalUsers: 18900, avgEndorsements: 78, level: 'expert', connections: ['Django', 'Machine Learning', 'Data Analysis'] },
        { id: 4, name: 'UI/UX Design', category: 'Design', totalUsers: 8750, avgEndorsements: 65, level: 'intermediate', connections: ['Figma', 'Adobe XD', 'Prototyping'] },
        { id: 5, name: 'Figma', category: 'Design', totalUsers: 6420, avgEndorsements: 58, level: 'intermediate', connections: ['UI/UX Design', 'Prototyping', 'Design Systems'] },
        { id: 6, name: 'Node.js', category: 'Technology', totalUsers: 9870, avgEndorsements: 71, level: 'intermediate', connections: ['JavaScript', 'Express.js', 'MongoDB'] },
        { id: 7, name: 'Machine Learning', category: 'Data', totalUsers: 7650, avgEndorsements: 95, level: 'expert', connections: ['Python', 'TensorFlow', 'Data Science'] },
        { id: 8, name: 'Digital Marketing', category: 'Marketing', totalUsers: 11200, avgEndorsements: 52, level: 'intermediate', connections: ['SEO', 'Content Strategy', 'Analytics'] },
        { id: 9, name: 'Project Management', category: 'Business', totalUsers: 13450, avgEndorsements: 67, level: 'intermediate', connections: ['Agile', 'Scrum', 'Leadership'] },
        { id: 10, name: 'Data Analysis', category: 'Data', totalUsers: 8900, avgEndorsements: 73, level: 'intermediate', connections: ['Python', 'SQL', 'Tableau'] },
        { id: 11, name: 'TypeScript', category: 'Technology', totalUsers: 5670, avgEndorsements: 82, level: 'intermediate', connections: ['JavaScript', 'React', 'Angular'] },
        { id: 12, name: 'Adobe Photoshop', category: 'Design', totalUsers: 9200, avgEndorsements: 45, level: 'beginner', connections: ['Graphic Design', 'UI/UX Design', 'Illustration'] },
        { id: 13, name: 'SEO', category: 'Marketing', totalUsers: 7800, avgEndorsements: 48, level: 'beginner', connections: ['Digital Marketing', 'Content Strategy', 'Analytics'] },
        { id: 14, name: 'Leadership', category: 'Business', totalUsers: 16700, avgEndorsements: 89, level: 'expert', connections: ['Project Management', 'Team Building', 'Strategy'] },
        { id: 15, name: 'SQL', category: 'Data', totalUsers: 14200, avgEndorsements: 76, level: 'intermediate', connections: ['Data Analysis', 'Database Design', 'Python'] }
      ]);
    }, 1000);
  }, []);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction) => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  const getSkillPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = Math.min(300, total * 15);
    const centerX = 400;
    const centerY = 300;
    
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  };

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
                  Trait Universe
                </h1>
                <p className="text-gray-600">
                  Explore the interconnected world of professional skills
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleZoom('out')}
                  disabled={zoom <= 0.5}
                >
                  <Minimize2 size={16} />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleZoom('in')}
                  disabled={zoom >= 3}
                >
                  <Maximize2 size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category === 'all' ? 'All Skills' : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Universe Visualization */}
          <Card className={`${isFullscreen ? 'fixed inset-4 z-50' : 'h-[600px]'} overflow-hidden`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-purple-600" size={20} />
                  Global Skill Network
                </CardTitle>
                <Badge variant="secondary">
                  {filteredSkills.length} skills
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div
                ref={containerRef}
                className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br from-purple-50 to-indigo-50"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom})`,
                    transformOrigin: 'center center'
                  }}
                  animate={{
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom})`
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {filteredSkills.map((skill, index) => {
                      const pos = getSkillPosition(index, filteredSkills.length);
                      return skill.connections?.map(connectionName => {
                        const connectedSkill = filteredSkills.find(s => s.name === connectionName);
                        if (!connectedSkill) return null;
                        
                        const connectedIndex = filteredSkills.indexOf(connectedSkill);
                        const connectedPos = getSkillPosition(connectedIndex, filteredSkills.length);
                        
                        return (
                          <line
                            key={`${skill.id}-${connectedSkill.id}`}
                            x1={pos.x}
                            y1={pos.y}
                            x2={connectedPos.x}
                            y2={connectedPos.y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        );
                      });
                    })}
                  </svg>

                  {/* Skill Bubbles */}
                  {filteredSkills.map((skill, index) => {
                    const position = getSkillPosition(index, filteredSkills.length);
                    
                    return (
                      <motion.div
                        key={skill.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{
                          left: position.x,
                          top: position.y
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                      >
                        <SkillBubble
                          skill={skill.name}
                          level={skill.level}
                          endorsementCount={skill.avgEndorsements}
                          size="medium"
                          interactive={true}
                        />
                        
                        {/* Skill Info Tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-lg p-3 min-w-[200px] z-20">
                          <h4 className="font-semibold text-gray-900 mb-1">{skill.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Users size={14} />
                              <span>{skill.totalUsers.toLocaleString()} professionals</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp size={14} />
                              <span>{skill.avgEndorsements} avg endorsements</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {skill.category}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Skills</p>
                    <p className="text-2xl font-bold text-gray-900">{skills.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {skills.reduce((sum, skill) => sum + skill.totalUsers, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Filter className="text-green-600" size={24} />
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