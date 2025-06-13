interface FigurePersonality {
  name: string;
  traits: string[];
  speechPatterns: string[];
  topics: string[];
  quotes: string[];
}

const figurePersonalities: Record<string, FigurePersonality> = {
  'ambedkar': {
    name: 'Dr. B.R. Ambedkar',
    traits: ['thoughtful', 'determined', 'scholarly', 'passionate about justice'],
    speechPatterns: [
      'I have always believed that...',
      'In my experience...',
      'The Constitution teaches us...',
      'Education is the key to...',
      'We must remember that...'
    ],
    topics: ['education', 'equality', 'constitution', 'social justice', 'law', 'democracy', 'rights'],
    quotes: [
      'Education is the milk of a lioness - whoever drinks it will roar.',
      'I measure the progress of a community by the degree of progress which women have achieved.',
      'Religion is for man and not man for religion.',
      'Political tyranny is nothing compared to the social tyranny.',
      'Law and order are the medicine of the body politic and when the body politic gets sick, medicine must be administered.'
    ]
  },
  'gandhi': {
    name: 'Mahatma Gandhi',
    traits: ['peaceful', 'wise', 'humble', 'spiritual'],
    speechPatterns: [
      'My dear friend...',
      'In my humble opinion...',
      'Truth has taught me...',
      'Non-violence is...',
      'Let us remember...'
    ],
    topics: ['non-violence', 'truth', 'independence', 'spirituality', 'simple living', 'civil rights'],
    quotes: [
      'Be the change you wish to see in the world.',
      'Truth never damages a cause that is just.',
      'In a gentle way, you can shake the world.',
      'The weak can never forgive. Forgiveness is the attribute of the strong.',
      'Live as if you were to die tomorrow. Learn as if you were to live forever.'
    ]
  },
  'einstein': {
    name: 'Albert Einstein',
    traits: ['curious', 'imaginative', 'humble', 'philosophical'],
    speechPatterns: [
      'It is fascinating to consider...',
      'From a scientific perspective...',
      'I have often wondered...',
      'The universe teaches us...',
      'In my research, I discovered...'
    ],
    topics: ['science', 'physics', 'relativity', 'universe', 'imagination', 'curiosity', 'peace'],
    quotes: [
      'Imagination is more important than knowledge.',
      'The important thing is not to stop questioning.',
      'Try not to become a person of success, but rather try to become a person of value.',
      'A person who never made a mistake never tried anything new.',
      'Science without religion is lame, religion without science is blind.'
    ]
  },
  'curie': {
    name: 'Marie Curie',
    traits: ['determined', 'pioneering', 'scientific', 'perseverant'],
    speechPatterns: [
      'In my laboratory work...',
      'Science has shown me...',
      'Through careful observation...',
      'My research indicates...',
      'As a woman in science...'
    ],
    topics: ['science', 'radioactivity', 'research', 'perseverance', 'women in science', 'discovery'],
    quotes: [
      'Nothing in life is to be feared, it is only to be understood.',
      'I was taught that the way of progress was neither swift nor easy.',
      'Be less curious about people and more curious about ideas.',
      'I am among those who think that science has great beauty.',
      'Life is not easy for any of us. But what of that? We must have perseverance.'
    ]
  },
  'shakespeare': {
    name: 'William Shakespeare',
    traits: ['eloquent', 'dramatic', 'insightful', 'poetic'],
    speechPatterns: [
      'Methinks...',
      'In truth...',
      'As I have written...',
      'The human condition teaches us...',
      'In my plays, I have explored...'
    ],
    topics: ['literature', 'human nature', 'love', 'tragedy', 'comedy', 'poetry', 'theater'],
    quotes: [
      'To be or not to be, that is the question.',
      'All the world\'s a stage, and all the men and women merely players.',
      'The course of true love never did run smooth.',
      'We know what we are, but know not what we may be.',
      'Better three hours too soon than a minute too late.'
    ]
  },
  'mandela': {
    name: 'Nelson Mandela',
    traits: ['resilient', 'forgiving', 'determined', 'inspiring'],
    speechPatterns: [
      'During my years in prison...',
      'I have learned that...',
      'Freedom means...',
      'In the struggle for justice...',
      'Ubuntu teaches us...'
    ],
    topics: ['freedom', 'justice', 'reconciliation', 'leadership', 'human rights', 'forgiveness'],
    quotes: [
      'Education is the most powerful weapon which you can use to change the world.',
      'It always seems impossible until it\'s done.',
      'I learned that courage was not the absence of fear, but the triumph over it.',
      'A good head and a good heart are always a formidable combination.',
      'There is no passion to be found playing small – in settling for a life that is less than the one you are capable of living.'
    ]
  }
};

export function generateAIResponse(figureId: string, userMessage: string): string {
  const personality = figurePersonalities[figureId];
  if (!personality) {
    return "I apologize, but I'm having trouble connecting to that historical figure right now.";
  }

  const message = userMessage.toLowerCase();
  
  // Check for greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('greetings')) {
    const pattern = personality.speechPatterns[Math.floor(Math.random() * personality.speechPatterns.length)];
    return `${pattern} It is wonderful to meet you. How may I share my experiences and wisdom with you today?`;
  }

  // Check for questions about their life
  if (message.includes('life') || message.includes('biography') || message.includes('story')) {
    const pattern = personality.speechPatterns[Math.floor(Math.random() * personality.speechPatterns.length)];
    return `${pattern} My life has been a journey of ${personality.traits.join(', ')}. Each experience has shaped my understanding of the world. What aspect of my journey interests you most?`;
  }

  // Check for topic-specific responses
  for (const topic of personality.topics) {
    if (message.includes(topic)) {
      const pattern = personality.speechPatterns[Math.floor(Math.random() * personality.speechPatterns.length)];
      const quote = personality.quotes[Math.floor(Math.random() * personality.quotes.length)];
      return `${pattern} ${topic} has been central to my work. As I once said, "${quote}" What are your thoughts on this matter?`;
    }
  }

  // Check for advice requests
  if (message.includes('advice') || message.includes('help') || message.includes('guidance')) {
    const quote = personality.quotes[Math.floor(Math.random() * personality.quotes.length)];
    const pattern = personality.speechPatterns[Math.floor(Math.random() * personality.speechPatterns.length)];
    return `${pattern} "${quote}" This wisdom has guided me through many challenges. How might this apply to your situation?`;
  }

  // Default responses
  const responses = [
    `That is a thoughtful question. ${personality.speechPatterns[0]} ${personality.quotes[Math.floor(Math.random() * personality.quotes.length)]}`,
    `${personality.speechPatterns[1]} this relates to my core belief in ${personality.topics[Math.floor(Math.random() * personality.topics.length)]}. What draws you to this topic?`,
    `Your question reminds me of something important. ${personality.quotes[Math.floor(Math.random() * personality.quotes.length)]} How do you see this applying to today's world?`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export function getTypingDelay(): number {
  return 1000 + Math.random() * 2000; // 1-3 seconds
}