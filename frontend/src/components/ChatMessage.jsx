import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

function ChatMessage({ message }) {
  const isSender = message.sender === 'mentor';

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs ${isSender ? 'lg:max-w-md' : 'lg:max-w-md'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isSender
              ? 'bg-purple-600 text-white rounded-br-none'
              : 'bg-slate-700/70 text-slate-100 rounded-bl-none'
          }`}
        >
          <p className="text-sm break-words">{message.text}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isSender ? 'justify-end' : 'justify-start'} text-xs text-slate-400`}>
          <span>{formatTime(message.timestamp)}</span>
          {isSender && (
            message.read ? <CheckCheck className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
