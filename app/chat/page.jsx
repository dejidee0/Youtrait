"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Search, MoreVertical, Phone, Video, Smile } from 'lucide-react';
import MobileNavigation from '@/components/navigation/mobile-navigation';
import DesktopSidebar from '@/components/navigation/desktop-sidebar';

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Simulate loading conversations
    setTimeout(() => {
      const mockConversations = [
        {
          id: 1,
          participant: {
            id: 2,
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
            profession: 'UI/UX Designer',
            isOnline: true,
            lastSeen: null
          },
          lastMessage: {
            content: 'Thanks for the endorsement on Figma!',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            isRead: false,
            senderId: 2
          },
          unreadCount: 2
        },
        {
          id: 2,
          participant: {
            id: 3,
            name: 'Marcus Johnson',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            profession: 'Full Stack Developer',
            isOnline: false,
            lastSeen: new Date(Date.now() - 1000 * 60 * 30)
          },
          lastMessage: {
            content: 'Would love to collaborate on that React project',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            isRead: true,
            senderId: 1
          },
          unreadCount: 0
        },
        {
          id: 3,
          participant: {
            id: 4,
            name: 'Emily Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            profession: 'Data Scientist',
            isOnline: true,
            lastSeen: null
          },
          lastMessage: {
            content: 'The machine learning model looks great!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            isRead: true,
            senderId: 4
          },
          unreadCount: 0
        }
      ];
      
      setConversations(mockConversations);
      setActiveConversation(mockConversations[0]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      // Simulate loading messages for active conversation
      const mockMessages = [
        {
          id: 1,
          content: 'Hey! I saw your JavaScript skills on your profile. Really impressive!',
          senderId: activeConversation.participant.id,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true
        },
        {
          id: 2,
          content: 'Thank you! I noticed you have great Figma skills too. Would love to learn more about your design process.',
          senderId: 1, // Current user
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
          isRead: true
        },
        {
          id: 3,
          content: 'I\'d be happy to share! I actually just posted a case study on my latest project. Check it out when you have time.',
          senderId: activeConversation.participant.id,
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          isRead: true
        },
        {
          id: 4,
          content: 'That sounds amazing! I just endorsed your Figma skill. You definitely deserve it! 🎉',
          senderId: 1,
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          isRead: true
        },
        {
          id: 5,
          content: 'Thanks for the endorsement on Figma!',
          senderId: activeConversation.participant.id,
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false
        }
      ];
      
      setMessages(mockMessages);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message = {
      id: Date.now(),
      content: newMessage,
      senderId: 1, // Current user
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation's last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation.id 
          ? { ...conv, lastMessage: { ...message, senderId: 1 } }
          : conv
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatLastSeen = (date) => {
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

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DesktopSidebar />
        <div className="lg:ml-64">
          <div className="h-screen flex">
            <div className="w-full lg:w-1/3 border-r border-gray-200 bg-white">
              <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
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
        <div className="h-screen flex">
          {/* Conversations List */}
          <div className={`${activeConversation ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 border-r border-gray-200 bg-white`}>
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-full pb-20 lg:pb-0">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    activeConversation?.id === conversation.id ? 'bg-purple-50 border-purple-200' : ''
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback>
                          {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.participant.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.participant.profession}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {conversation.lastMessage.senderId === 1 ? 'You: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-2 bg-purple-600 text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {activeConversation ? (
            <div className={`${activeConversation ? 'block' : 'hidden lg:block'} flex-1 flex flex-col bg-white`}>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setActiveConversation(null)}
                    >
                      ←
                    </Button>
                    
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={activeConversation.participant.avatar} />
                        <AvatarFallback>
                          {activeConversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {activeConversation.participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {activeConversation.participant.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activeConversation.participant.isOnline 
                          ? 'Online' 
                          : `Last seen ${formatLastSeen(activeConversation.participant.lastSeen)}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone size={20} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video size={20} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical size={20} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.senderId === 1 ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === 1
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 1 ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Smile size={20} />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-12"
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send size={20} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="text-purple-600" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}