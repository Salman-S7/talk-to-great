'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Users, Clock, Sparkles, ArrowRight, Search, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getConversationSummaries, type ConversationSummary } from '@/lib/conversation-storage';
import Link from 'next/link';

const historicalFigures = [
  {
    id: 'ambedkar',
    name: 'Dr. B.R. Ambedkar',
    title: 'Father of Indian Constitution',
    era: '1891-1956',
    image: 'https://images.pexels.com/photos/8847615/pexels-photo-8847615.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    description: 'Principal architect of the Indian Constitution and social reformer',
    category: 'Politics & Law',
    popularity: 95
  },
  {
    id: 'gandhi',
    name: 'Mahatma Gandhi',
    title: 'Father of the Nation',
    era: '1869-1948',
    image: 'https://images.pexels.com/photos/8847617/pexels-photo-8847617.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    description: 'Leader of Indian independence movement through non-violent resistance',
    category: 'Politics & Philosophy',
    popularity: 98
  },
  {
    id: 'einstein',
    name: 'Albert Einstein',
    title: 'Theoretical Physicist',
    era: '1879-1955',
    image: 'https://images.pexels.com/photos/8847616/pexels-photo-8847616.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    description: 'Developer of theory of relativity and Nobel Prize winner',
    category: 'Science',
    popularity: 92
  },
  {
    id: 'curie',
    name: 'Marie Curie',
    title: 'Pioneering Physicist',
    era: '1867-1934',
    image: 'https://images.pexels.com/photos/8847618/pexels-photo-8847618.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    description: 'First woman to win Nobel Prize and discover radioactive elements',
    category: 'Science',
    popularity: 88
  },
  {
    id: 'shakespeare',
    name: 'William Shakespeare',
    title: 'The Bard',
    era: '1564-1616',
    image: 'https://images.pexels.com/photos/8847619/pexels-photo-8847619.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    description: 'Greatest writer in English language and world\'s greatest dramatist',
    category: 'Literature',
    popularity: 90
  },
  {
    id: 'mandela',
    name: 'Nelson Mandela',
    title: 'Anti-Apartheid Revolutionary',
    era: '1918-2013',
    image: 'https://images.pexels.com/photos/8847620/pexels-photo-8847620.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    description: 'South African leader who fought against apartheid',
    category: 'Politics & Human Rights',
    popularity: 94
  }
];

const categories = ['All', 'Politics & Law', 'Science', 'Literature', 'Philosophy', 'Human Rights'];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recentConversations, setRecentConversations] = useState<ConversationSummary[]>([]);

  useEffect(() => {
    // Load recent conversations on component mount
    const summaries = getConversationSummaries();
    setRecentConversations(summaries.slice(0, 3)); // Show only 3 most recent
  }, []);

  const filteredFigures = historicalFigures.filter(figure => {
    const matchesSearch = figure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         figure.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || figure.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Talk to History</h1>
                <p className="text-sm text-gray-600">Converse with the Past</p>
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Step Into
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent block">
              History's Greatest Minds
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Have meaningful conversations with history's most influential figures. Ask questions, seek wisdom, 
            and learn from the greatest minds that shaped our world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Conversations */}
      {recentConversations.length > 0 && (
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center space-x-2 mb-8">
                <History className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Continue Your Conversations</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentConversations.map((conversation) => {
                  const figure = historicalFigures.find(f => f.id === conversation.figureId);
                  if (!figure) return null;
                  
                  return (
                    <Card key={conversation.figureId} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img 
                              src={figure.image} 
                              alt={figure.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{figure.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {conversation.messageCount} messages
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime.toLocaleDateString()}
                          </span>
                          <Link href={`/chat/${conversation.figureId}`}>
                            <Button size="sm" variant="outline">
                              Continue
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Historical Figures</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Conversations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">2000+</h3>
              <p className="text-gray-600">Years of History</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Historical Guide</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select from our collection of remarkable historical figures and start your conversation
            </p>
          </div>

          {/* Search and Categories */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search historical figures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Historical Figures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFigures.map((figure) => (
              <Card key={figure.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden">
                      <img 
                        src={figure.image} 
                        alt={figure.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800"
                    >
                      {figure.era}
                    </Badge>
                  </div>
                  <CardTitle className="text-center text-xl">{figure.name}</CardTitle>
                  <CardDescription className="text-center font-medium text-blue-600">
                    {figure.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-sm leading-relaxed">
                    {figure.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs">
                      {figure.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Available</span>
                    </div>
                  </div>
                  <Link href={`/chat/${figure.id}`}>
                    <Button className="w-full group-hover:bg-blue-700 transition-colors">
                      Start Conversation
                      <MessageCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFigures.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No figures found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Talk to History</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Bridging the gap between past and present through AI-powered conversations
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}