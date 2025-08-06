"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Edit3, Plus, X, Sparkles } from 'lucide-react';
import BubbleBackground from '@/components/ui/bubble-background';
import { useRouter } from 'next/navigation';

export default function SkillsExtractedPage() {
  const [extractedData, setExtractedData] = useState({
    name: 'John Doe',
    profession: 'Full Stack Developer',
    skills: [
      { name: 'JavaScript', years: 5, category: 'Technology' },
      { name: 'React', years: 4, category: 'Technology' },
      { name: 'Node.js', years: 3, category: 'Technology' },
      { name: 'Python', years: 2, category: 'Technology' },
      { name: 'UI/UX Design', years: 3, category: 'Design' }
    ]
  });
  
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({ name: '', years: 1, category: 'Technology' });
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const skillCategories = [
    'Technology', 'Design', 'Marketing', 'Business', 'Data', 'Communication'
  ];

  const handleEditSkill = (index, field, value) => {
    const updatedSkills = [...extractedData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setExtractedData({ ...extractedData, skills: updatedSkills });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = extractedData.skills.filter((_, i) => i !== index);
    setExtractedData({ ...extractedData, skills: updatedSkills });
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setExtractedData({
        ...extractedData,
        skills: [...extractedData.skills, { ...newSkill }]
      });
      setNewSkill({ name: '', years: 1, category: 'Technology' });
      setShowAddSkill(false);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    
    // Check if any skills require validation (intermediate+ level)
    const skillsNeedingValidation = extractedData.skills.filter(skill => skill.years >= 3);
    
    setTimeout(() => {
      if (skillsNeedingValidation.length > 0) {
        router.push('/register/validation');
      } else {
        router.push('/dashboard');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative">
      <BubbleBackground density={6} />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-yellow-400" size={24} />
                <CardTitle className="text-white text-2xl">Skills Extracted!</CardTitle>
              </div>
              <p className="text-purple-200">Review and edit your extracted skills</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Name</Label>
                  <Input
                    value={extractedData.name}
                    onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Profession</Label>
                  <Input
                    value={extractedData.profession}
                    onChange={(e) => setExtractedData({ ...extractedData, profession: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Skills List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-white text-lg">Extracted Skills</Label>
                  <Button
                    onClick={() => setShowAddSkill(true)}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Skill
                  </Button>
                </div>

                <div className="space-y-3">
                  {extractedData.skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                    >
                      {editingSkill === index ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <Input
                            value={skill.name}
                            onChange={(e) => handleEditSkill(index, 'name', e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="Skill name"
                          />
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={skill.years}
                            onChange={(e) => handleEditSkill(index, 'years', parseInt(e.target.value))}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="Years"
                          />
                          <select
                            value={skill.category}
                            onChange={(e) => handleEditSkill(index, 'category', e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                          >
                            {skillCategories.map(cat => (
                              <option key={cat} value={cat} className="bg-purple-900">{cat}</option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setEditingSkill(null)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle size={16} />
                            </Button>
                            <Button
                              onClick={() => handleRemoveSkill(index)}
                              size="sm"
                              variant="destructive"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="text-white font-medium">{skill.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="bg-purple-500/30 text-purple-200">
                                  {skill.category}
                                </Badge>
                                <span className="text-purple-300 text-sm">
                                  {skill.years} {skill.years === 1 ? 'year' : 'years'}
                                </span>
                                {skill.years >= 3 && (
                                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                    Needs Validation
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => setEditingSkill(index)}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                          >
                            <Edit3 size={16} />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Add New Skill */}
                {showAddSkill && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 mt-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Input
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Skill name"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={newSkill.years}
                        onChange={(e) => setNewSkill({ ...newSkill, years: parseInt(e.target.value) })}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Years"
                      />
                      <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                        className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                      >
                        {skillCategories.map(cat => (
                          <option key={cat} value={cat} className="bg-purple-900">{cat}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddSkill}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button
                          onClick={() => setShowAddSkill(false)}
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Continue Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleContinue}
                  disabled={loading}
                  className="w-full bg-white text-purple-900 hover:bg-purple-50 py-6 text-lg font-semibold rounded-xl"
                >
                  {loading ? 'Processing...' : 'Continue to Validation'}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}