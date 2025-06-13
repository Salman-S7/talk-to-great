'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, User, Bot, Clock, Copy, Share, MoreVertical, Download, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { generateAIResponse, getTypingDelay } from '@/lib/ai-responses';
import { saveMessage, getConversationHistory, clearConversation, exportConversation, type StoredMessage } from '@/lib/conversation-storage';

// Mock data for historical figures
const figuresData = {
  'ambedkar': {
    name: 'Dr. B.R. Ambedkar',
    title: 'Father of Indian Constitution',
    era: '1891-1956',
    image: 'https://images.pexels.com/photos/8847615/pexels-photo-8847615.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    background: 'Principal architect of the Indian Constitution, social reformer, and champion of Dalit rights.',
    personality: 'Thoughtful, determined, eloquent, and deeply committed to social justice and equality.',
    welcomeMessage: "Namaste! I am Dr. Bhimrao Ramji Ambedkar. I have spent my life fighting for social justice and equality. How may I assist you in understanding the principles of justice, equality, and the importance of education?"
  },
  'gandhi': {
    name: 'Mahatma Gandhi',
    title: 'Father of the Nation',
    era: '1869-1948',
    image: 'https://images.pexels.com/photos/8847617/pexels-photo-8847617.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    background: 'Leader of Indian independence movement through non-violent resistance and civil disobedience.',
    personality: 'Peaceful, wise, humble, and deeply spiritual with unwavering commitment to truth and non-violence.',
    welcomeMessage: "Greetings, my friend. I am Mohandas Karamchand Gandhi. Truth and non-violence have been my guiding principles. What wisdom can I share with you today?"
  },
  'einstein': {
    name: 'Albert Einstein',
    title: 'Theoretical Physicist',
    era: '1879-1955',
    image: 'https://images.pexels.com/photos/8847616/pexels-photo-8847616.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    background: 'Developer of theory of relativity, Nobel Prize winner, and one of the most influential physicists.',
    personality: 'Curious, imaginative, humble about the mysteries of the universe, and passionate about peace.',
    welcomeMessage: "Guten Tag! I am Albert Einstein. The universe is a wonderful mystery, and I've spent my life trying to understand its secrets. What questions about science, life, or the cosmos can I help you explore?"
  },
  'curie': {
    name: 'Marie Curie',
    title: 'Pioneering Physicist',
    era: '1867-1934',
    image: 'https://images.pexels.com/photos/8847618/pexels-photo-8847618.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    background: 'First woman to win Nobel Prize and discover radioactive elements',
    personality: 'Determined, pioneering, scientific, and perseverant in the face of adversity.',
    welcomeMessage: "Bonjour! I am Marie Curie. Science has been my passion and my life's work. I believe that nothing in life is to be feared, it is only to be understood. What scientific mysteries shall we explore together?"
  },
  'shakespeare': {
    name: 'William Shakespeare',
    title: 'The Bard',
    era: '1564-1616',
    image: 'https://images.pexels.com/photos/8847619/pexels-photo-8847619.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    background: 'Greatest writer in English language and world\'s greatest dramatist',
    personality: 'Eloquent, dramatic, insightful about human nature, and masterful with words.',
    welcomeMessage: "Good morrow! I am William Shakespeare, humble servant of the written word. All the world's a stage, and I have spent my life chronicling the human drama. What tales of life, love, or loss shall we discuss?"
  },
  'mandela': {
    name: 'Nelson Mandela',
    title: 'Anti-Apartheid Revolutionary',
    era: '1918-2013',
    image: 'https://images.pexels.com/photos/8847620/pexels-photo-8847620.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    background: 'South African leader who fought against apartheid',
    personality: 'Resilient, forgiving, determined, and inspiring leader for human rights.',
    welcomeMessage: "Sawubona! I am Nelson Mandela. I have learned that courage is not the absence of fear, but the triumph over it. How can we work together toward a more just and equal world?"
  }
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'figure';
  timestamp: Date;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const figureId = params?.figureId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const figure = figuresData[figureId as keyof typeof figuresData];

  useEffect(() => {
    if (!figure) {
      router.push('/');
      return;
    }

    // Load conversation history
    const history = getConversationHistory(figureId);
    
    if (history.length > 0) {
      // Convert stored messages to local message format
      const convertedMessages: Message[] = history.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp
      }));
      setMessages(convertedMessages);
    } else {
      // Add welcome message for new conversations
      const welcomeMessage: Message = {
        id: '1',
        content: figure.welcomeMessage,
        sender: 'figure',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Save welcome message to storage
      const storedWelcomeMessage: StoredMessage = {
        ...welcomeMessage,
        figureId: figure.name
      };
      saveMessage(figureId, storedWelcomeMessage);
    }
    
    setIsLoading(false);
  }, [figure, router, figureId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Save user message
    const storedUserMessage: StoredMessage = {
      ...userMessage,
      figureId: figure.name
    };
    saveMessage(figureId, storedUserMessage);
    
    setInputMessage('');
    setIsTyping(true);

    // Generate AI response with realistic delay
    const delay = getTypingDelay();
    setTimeout(() => {
      const response = generateAIResponse(figureId, inputMessage);
      const figureMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'figure',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, figureMessage]);
      
      // Save figure message
      const storedFigureMessage: StoredMessage = {
        ...figureMessage,
        figureId: figure.name
      };
      saveMessage(figureId, storedFigureMessage);
      
      setIsTyping(false);
    }, delay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    clearConversation(figureId);
    const welcomeMessage: Message = {
      id: '1',
      content: figure.welcomeMessage,
      sender: 'figure',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Save new welcome message
    const storedWelcomeMessage: StoredMessage = {
      ...welcomeMessage,
      figureId: figure.name
    };
    saveMessage(figureId, storedWelcomeMessage);
  };

  const handleExportConversation = () => {
    const exportText = exportConversation(figureId);
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${figureId}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareConversation = async () => {
    const exportText = exportConversation(figureId);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Conversation with ${figure.name}`,
          text: exportText
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(exportText);
      }
    } else {
      navigator.clipboard.writeText(exportText);
    }
  };

  if (!figure) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={figure.image} 
                alt={figure.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{figure.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
                <Badge variant="outline" className="text-xs">
                  {figure.era}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleShareConversation}>
              <Share className="mr-2 h-4 w-4" />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportConversation}>
              <Download className="mr-2 h-4 w-4" />
              Export as Text
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem onClick={handleClearConversation} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Figure Info Panel */}
      <div className="bg-white/60 backdrop-blur-sm border-b px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-1">{figure.title}</p>
          <p className="text-sm text-gray-700">{figure.background}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex space-x-3 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  {message.sender === 'figure' ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={figure.image} 
                        alt={figure.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <Card className={`${message.sender === 'user' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white/80 backdrop-blur-sm border-gray-200'
                } shadow-sm`}>
                  <CardContent className="px-4 py-3">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center space-x-1 mt-2 opacity-70">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-3xl">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={figure.image} 
                      alt={figure.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
                  <CardContent className="px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${figure.name} anything...`}
              className="flex-1 h-12 text-base"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Responses are generated by AI and may not reflect the actual views of historical figures
          </p>
        </div>
      </div>
    </div>
  );
}