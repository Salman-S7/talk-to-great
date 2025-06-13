export interface StoredMessage {
  id: string;
  content: string;
  sender: 'user' | 'figure';
  timestamp: Date;
  figureId: string;
}

export interface ConversationSummary {
  figureId: string;
  figureName: string;
  lastMessage: string;
  lastMessageTime: Date;
  messageCount: number;
}

const STORAGE_KEY = 'talk-to-history-conversations';

export function saveMessage(figureId: string, message: StoredMessage): void {
  try {
    const conversations = getStoredConversations();
    if (!conversations[figureId]) {
      conversations[figureId] = [];
    }
    conversations[figureId].push(message);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to save message:', error);
  }
}

export function getConversationHistory(figureId: string): StoredMessage[] {
  try {
    const conversations = getStoredConversations();
    return conversations[figureId] || [];
  } catch (error) {
    console.error('Failed to load conversation history:', error);
    return [];
  }
}

export function getStoredConversations(): Record<string, StoredMessage[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    Object.keys(parsed).forEach(figureId => {
      parsed[figureId] = parsed[figureId].map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    });
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse stored conversations:', error);
    return {};
  }
}

export function getConversationSummaries(): ConversationSummary[] {
  try {
    const conversations = getStoredConversations();
    const summaries: ConversationSummary[] = [];
    
    Object.keys(conversations).forEach(figureId => {
      const messages = conversations[figureId];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        summaries.push({
          figureId,
          figureName: lastMessage.figureId,
          lastMessage: lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : ''),
          lastMessageTime: lastMessage.timestamp,
          messageCount: messages.length
        });
      }
    });
    
    return summaries.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  } catch (error) {
    console.error('Failed to get conversation summaries:', error);
    return [];
  }
}

export function clearConversation(figureId: string): void {
  try {
    const conversations = getStoredConversations();
    delete conversations[figureId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to clear conversation:', error);
  }
}

export function exportConversation(figureId: string): string {
  try {
    const messages = getConversationHistory(figureId);
    let exportText = `Conversation with ${figureId}\n`;
    exportText += `Exported on ${new Date().toLocaleString()}\n\n`;
    
    messages.forEach(message => {
      const sender = message.sender === 'user' ? 'You' : message.figureId;
      const time = message.timestamp.toLocaleString();
      exportText += `[${time}] ${sender}: ${message.content}\n\n`;
    });
    
    return exportText;
  } catch (error) {
    console.error('Failed to export conversation:', error);
    return '';
  }
}