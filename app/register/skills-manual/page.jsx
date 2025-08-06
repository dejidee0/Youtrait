"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, CheckCircle } from 'lucide-react';
import BubbleBackground from '@/components/ui/bubble-background';
import { useRouter } from 'next/navigation';

export default function SkillsManualPage() {
  const [profession, setProfession] = useState('');
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState({ name: '', years: 1, category: 'Technology' });
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const skillCategories = [
    'Technology', 'Design', 'Marketing', 'Business', 'Data', 'Communication'
  ];

  // Suggested skills based on profession
  const professionSkills = {
    'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
    'UI/UX Designer': ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Wireframing'],
    'Digital Marketer': ['Google Analytics', 'SEO', 'Content Marketing', 'Social Media', 'PPC', 'Email Marketing'],
    'Data Scientist': ['Python', 'R', 'Machine Learning', 'SQL', 'Tableau', 'Statistics'],
    'Project Manager': ['Agile', 'Scrum', 'JIRA', 'Risk Management', 'Stakeholder Management', 'Budget Planning']
  };

  const suggestedSkills = professionSkills[profession] || [];

  const handleAddSkill = () => {
    if (currentSkill.name.trim() && !skills.find(s => s.name.toLowerCase() === currentSkill.name.toLowerCase())) {
      setSkills([...skills, { ...currentSkill, id: Date.now() }]);
      setCurrentSkill({ name: '', years: 1, category: 'Technology' });
    }
  };

  const handleAddSuggestedSkill = (skillName) => {
    if (!skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      setSkills([...skills, { 
        id: Date.now(), 
        name: skillName, 
        years: 1, 
        category: 'Technology' 
      }]);
    }
  };

  const handleRemoveSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleUpdateSkill = (id, field, value) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const handleContinue = async () => {
    if (!profession.trim() || skills.length === 0) return;
    
    setLoading(true);
    
    // Check if any skills require validation (intermediate+ level)
    const skillsNeedingValidation = skills.filter(skill => skill.years >= 3);
    
    setTimeout(() => {
      if (skillsNeedingValidation.length > 0) {
        router.push('/register/validation');
      } else {
        router.push('/dashboard');
      }
    }, 2000);
  };

  const isFormValid = profession.trim() && skills.length > 0;

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
              <CardTitle className="text-white text-2xl">Add Your Skills</CardTitle>
              <p className="text-purple-200">Tell us about your professional expertise</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profession */}
              <div>
                <Label className="text-white text-lg">What's your profession?</Label>
                <Input
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 mt-2"
                  placeholder="e.g., Full Stack Developer, UI/UX Designer"
                />
              </div>

              {/* Suggested Skills */}
              {suggestedSkills.length > 0 && (
                <div>
                  <Label className="text-white text-lg">Suggested Skills for {profession}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestedSkills.map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          onClick={() => handleAddSuggestedSkill(skill)}
                          className="cursor-pointer bg-purple-500/30 text-purple-200 hover:bg-purple-500/50 border-purple-500/30"
                        >
                          <Plus size={12} className="mr-1" />
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Skill */}
              <div>
                <Label className="text-white text-lg">Add a Skill</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                  <Input
                    value={currentSkill.name}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    placeholder="Skill name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={currentSkill.years}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, years: parseInt(e.target.value) || 1 })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Years"
                  />
                  <select
                    value={currentSkill.category}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                    className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                  >
                    {skillCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-purple-900">{cat}</option>
                    ))}
                  </select>
                  <Button
                    onClick={handleAddSkill}
                    disabled={!currentSkill.name.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Skills List */}
              {skills.length > 0 && (
                <div>
                  <Label className="text-white text-lg">Your Skills ({skills.length})</Label>
                  <div className="space-y-3 mt-2">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                          <Input
                            value={skill.name}
                            onChange={(e) => handleUpdateSkill(skill.id, 'name', e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                          />
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={skill.years}
                            onChange={(e) => handleUpdateSkill(skill.id, 'years', parseInt(e.target.value) || 1)}
                            className="bg-white/10 border-white/20 text-white"
                          />
                          <select
                            value={skill.category}
                            onChange={(e) => handleUpdateSkill(skill.id, 'category', e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                          >
                            {skillCategories.map(cat => (
                              <option key={cat} value={cat} className="bg-purple-900">{cat}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2">
                            {skill.years >= 3 && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                                Validation Required
                              </Badge>
                            )}
                          </div>
                          <Button
                            onClick={() => handleRemoveSkill(skill.id)}
                            size="sm"
                            variant="destructive"
                            className="w-full md:w-auto"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <motion.div
                whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              >
                <Button
                  onClick={handleContinue}
                  disabled={!isFormValid || loading}
                  className="w-full bg-white text-purple-900 hover:bg-purple-50 disabled:bg-white/50 py-6 text-lg font-semibold rounded-xl"
                >
                  {loading ? 'Processing...' : 'Continue'}
                </Button>
              </motion.div>

              {!isFormValid && (
                <p className="text-purple-300 text-sm text-center">
                  Please add your profession and at least one skill to continue
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}