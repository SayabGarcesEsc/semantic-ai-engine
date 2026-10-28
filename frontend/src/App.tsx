import React from 'react';
import { SemanticChat } from './components/SemanticChat';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Enterprise Knowledge Base</h1>
        <p className="text-gray-500 text-sm mt-1">FastAPI + Qdrant Semantic Vector Copilot Engine</p>
      </header>
      <SemanticChat />
    </div>
  );
}

export default App;
