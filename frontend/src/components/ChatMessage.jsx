import React from 'react';
import { Check, CheckCheck, Download, FileIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

function ChatMessage({ message }) {
  const isSender = message?.senderRole;
 
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const {userData}=useSelector(state=>state.user)

  const renderMessageContent = () => {
    switch(message?.messageType) {
      case 'image':
        return (
          <div className="space-y-1">
            {message.content && message.content !== message.fileName && (
              <p className="text-sm break-words">{message.content}</p>
            )}
            <div className="relative">
              <img 
                src={message.fileUrl} 
                alt={message.fileName}
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
              <button
                onClick={() => window.open(message.fileUrl, '_blank')}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition"
              >
                <Download className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        );
      case 'file':
        return (
          <div className="space-y-1">
            {message.content && message.content !== message.fileName && (
              <p className="text-sm break-words">{message.content}</p>
            )}
            <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg border border-slate-600/50 max-w-xs">
              <FileIcon className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{message.fileName}</p>
                <p className="text-xs opacity-70">Click to download</p>
              </div>
              <button
                onClick={() => window.open(message.fileUrl, '_blank')}
                className="p-1 hover:bg-slate-600/50 rounded transition"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      default:
        return <p className="text-sm break-words">{message?.content}</p>;
    }
  };

  return (
    <div className={`flex ${isSender==userData.role ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs ${isSender==userData.role ? 'lg:max-w-md' : 'lg:max-w-md'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isSender
              ? 'bg-purple-600 text-white rounded-br-none'
              : 'bg-slate-700/70 text-slate-100 rounded-bl-none'
          }`}
        >
          {renderMessageContent()}
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isSender==userData.role ? 'justify-end' : 'justify-start'} text-xs text-slate-400`}>
          <span>{formatTime(message?.createdAt)}</span>
          {isSender==userData.role && (
            message?.isRead ? <CheckCheck className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;