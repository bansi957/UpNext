import React from 'react';
import { Check, CheckCheck, Download, FileIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { serverUrl } from '../App';

function ChatMessage({ message, chatId }) {
  const isSender = message?.senderRole;
 
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const {userData}=useSelector(state=>state.user)

  const handleFileDownload = async (isImage = false) => {
    try {
      if (!message._id) {
        alert('Message ID not found');
        return;
      }

      if (!chatId) {
        alert('Chat ID not found');
        return;
      }

      // Use backend download endpoint which serves the file with proper headers
      const downloadUrl = `${serverUrl}/api/chats/download/${chatId}/${message._id}`;
      
      console.log('[Frontend] Downloading from:', downloadUrl);
      console.log('[Frontend] File name:', message.fileName);

      // Fetch the file from backend
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      console.log('[Frontend] File fetched successfully');

      // Convert response to blob
      const blob = await response.blob();
      
      console.log('[Frontend] Blob created, size:', blob.size);

      // Create object URL and download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = message.fileName || 'file';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      
      console.log('[Frontend] Triggering download with filename:', link.download);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      console.log('[Frontend] Download triggered for:', message.fileName);
    } catch (error) {
      console.error('[Frontend] Download error:', error);
      alert(`Download failed: ${error.message}`);
    }
  };

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
                onClick={() => handleFileDownload(true)}
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
            <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg border border-slate-600/50 max-w-xs cursor-pointer hover:bg-slate-700/50 transition"
              onClick={() => handleFileDownload()}
            >
              <FileIcon className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{message.fileName}</p>
                <p className="text-xs opacity-70">Click to download</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileDownload();
                }}
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