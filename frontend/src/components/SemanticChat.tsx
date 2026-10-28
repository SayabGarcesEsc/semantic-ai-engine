import { useState } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
}

export const SemanticChat: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    const currentQuery = query;
    setQuery('');
    setLoading(true);

    try {
      const response = await axios.post<{ answer: string; source: string }>('http://localhost:8000/query', {
        question: currentQuery,
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: response.data.answer,
        source: response.data.source,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching semantic response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px] w-full max-w-lg border border-gray-200 rounded-xl bg-white shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-center text-gray-400 mt-20">Initialize a chat loop to query semantic document embeddings.</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
            <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
            {msg.source && (
              <span className="text-[10px] text-gray-400 font-mono mt-1 px-1 bg-gray-50 border border-gray-100 rounded">
                Source: {msg.source}
              </span>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="border-t border-gray-100 p-3 flex gap-2 bg-gray-50 rounded-b-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something semantically..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50" 
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};
