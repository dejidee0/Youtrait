"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Brain, ArrowRight } from 'lucide-react';
import BubbleBackground from '@/components/ui/bubble-background';
import { useRouter } from 'next/navigation';

export default function ValidationPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Mock validation questions (in real app, these would be AI-generated)
  const validationQuestions = [
    {
      skill: 'JavaScript',
      question: "You're debugging a React application where a component isn't re-rendering when state changes. The state is being updated in a nested object. What's the most likely cause and solution?",
      options: [
        "The component needs a key prop - add a unique key",
        "React doesn't detect mutations in nested objects - create a new object reference",
        "The useState hook is broken - switch to useReducer",
        "The component needs to be wrapped in React.memo"
      ],
      correct: 1,
      explanation: "React uses Object.is() comparison for state changes. Mutating nested objects doesn't create a new reference, so React doesn't detect the change."
    },
    {
      skill: 'React',
      question: "A client reports that their e-commerce site is slow when filtering through 10,000 products. The filter runs on every keystroke. What's your optimization strategy?",
      options: [
        "Use React.memo on all product components",
        "Implement debouncing for the search input and virtualization for the product list",
        "Move all products to Redux store",
        "Use useCallback for all event handlers"
      ],
      correct: 1,
      explanation: "Debouncing reduces API calls/filtering frequency, while virtualization only renders visible items, dramatically improving performance."
    },
    {
      skill: 'Node.js',
      question: "Your Node.js API is experiencing memory leaks in production. Users report the server becomes unresponsive after a few hours. What's your debugging approach?",
      options: [
        "Restart the server every hour with a cron job",
        "Use heap snapshots and profiling tools to identify memory retention patterns",
        "Increase server RAM allocation",
        "Switch to a different Node.js version"
      ],
      correct: 1,
      explanation: "Heap snapshots and profiling tools like clinic.js or --inspect help identify memory leaks by showing object retention patterns."
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion();
    }
  }, [timeLeft, showResult]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === validationQuestions[currentQuestion].correct;
    const newAnswer = {
      questionIndex: currentQuestion,
      selectedAnswer,
      isCorrect,
      timeSpent: 60 - timeLeft
    };
    
    setAnswers([...answers, newAnswer]);
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < validationQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(60);
      } else {
        handleFinishValidation();
      }
    }, 3000);
  };

  const handleFinishValidation = () => {
    setLoading(true);
    
    // Calculate results
    const correctAnswers = answers.filter(a => a.isCorrect).length + 
                          (selectedAnswer === validationQuestions[currentQuestion].correct ? 1 : 0);
    const totalQuestions = validationQuestions.length;
    const passRate = correctAnswers / totalQuestions;
    
    setTimeout(() => {
      if (passRate >= 0.6) {
        router.push('/dashboard?validation=passed');
      } else {
        router.push('/dashboard?validation=failed');
      }
    }, 2000);
  };

  const currentQ = validationQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / validationQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative">
      <BubbleBackground density={4} />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="text-purple-300" size={24} />
                  <CardTitle className="text-white text-xl">Skill Validation</CardTitle>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={16} />
                    <span className={`font-mono ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Badge className="bg-purple-500/30 text-purple-200">
                    {currentQuestion + 1} of {validationQuestions.length}
                  </Badge>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </CardHeader>
            
            <CardContent>
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-6">
                      <Badge className="bg-blue-500/30 text-blue-200 border-blue-500/30 mb-4">
                        {currentQ.skill}
                      </Badge>
                      <h2 className="text-white text-lg leading-relaxed">
                        {currentQ.question}
                      </h2>
                    </div>
                    
                    <div className="space-y-3">
                      {currentQ.options.map((option, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              selectedAnswer === index
                                ? 'bg-purple-500/30 border-purple-400 text-white'
                                : 'bg-white/5 border-white/20 text-purple-100 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswer === index
                                  ? 'border-purple-400 bg-purple-500'
                                  : 'border-white/30'
                              }`}>
                                {selectedAnswer === index && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                              </div>
                              <span>{option}</span>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswer === null}
                        className="bg-white text-purple-900 hover:bg-purple-50 disabled:bg-white/50"
                      >
                        {currentQuestion === validationQuestions.length - 1 ? 'Finish' : 'Next Question'}
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    {selectedAnswer === currentQ.correct ? (
                      <div>
                        <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
                        <h3 className="text-white text-2xl font-bold mb-2">Correct!</h3>
                        <p className="text-green-300 text-lg mb-4">Great job! You got it right.</p>
                      </div>
                    ) : (
                      <div>
                        <XCircle size={64} className="text-red-400 mx-auto mb-4" />
                        <h3 className="text-white text-2xl font-bold mb-2">Not quite right</h3>
                        <p className="text-red-300 text-lg mb-4">Don't worry, keep learning!</p>
                      </div>
                    )}
                    
                    <div className="bg-white/5 rounded-lg p-4 text-left">
                      <h4 className="text-white font-medium mb-2">Explanation:</h4>
                      <p className="text-purple-200">{currentQ.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
                  <p className="text-white">Processing your results...</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}