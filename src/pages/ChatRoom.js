import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Image, Copy, Loader2, ArrowDown } from 'lucide-react';
import { 
  setCurrentChatroom, 
  addMessage, 
  setTyping, 
  loadMoreMessages,
  setMessageLoading 
} from '../store/slices/chatSlice';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useThrottle } from '../hooks/useThrottle';
import { 
  generateId, 
  generateAIResponse, 
  formatMessageTime, 
  copyToClipboard,
  fileToBase64,
  validateImageFile,
  generateDummyMessages
} from '../utils/helpers';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { MESSAGE_TYPES, AI_RESPONSE_DELAY, TYPING_DELAY, AI_THROTTLE_DELAY } from '../utils/constants';
import toast from 'react-hot-toast';
import MessageSkeleton from '../components/Chat/MessageSkeleton';
import TypingIndicator from '../components/Chat/TypingIndicator';

const ChatRoom = () => {
  const { chatroomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { chatrooms, currentChatroom, messages, isTyping, hasMoreMessages, messagePages } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastAIResponseTime = useRef(0);

  const chatroomMessages = messages[chatroomId] || [];
  const hasMore = hasMoreMessages[chatroomId] || false;

  // Find current chatroom
  useEffect(() => {
    const chatroom = chatrooms.find(room => room.id === chatroomId);
    if (chatroom) {
      dispatch(setCurrentChatroom(chatroom));
      
      // Load initial messages if none exist
      if (!messages[chatroomId] || messages[chatroomId].length === 0) {
        const initialMessages = generateDummyMessages(10, chatroomId);
        dispatch(loadMoreMessages({
          chatroomId,
          messages: initialMessages,
          hasMore: true
        }));
      }
    } else {
      navigate('/dashboard');
    }
  }, [chatroomId, chatrooms, dispatch, navigate, messages]);

  // Infinite scroll for loading more messages
  const [isFetchingMore] = useInfiniteScroll(async () => {
    if (hasMore) {
      dispatch(setMessageLoading(true));
      
      // Simulate loading delay
      setTimeout(() => {
        const currentPage = messagePages[chatroomId] || 1;
        const newMessages = generateDummyMessages(20, chatroomId, currentPage * 20);
        
        dispatch(loadMoreMessages({
          chatroomId,
          messages: newMessages,
          hasMore: currentPage < 5 // Limit to 5 pages for demo
        }));
        
        dispatch(setMessageLoading(false));
      }, 1000);
    }
  }, hasMore);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatroomMessages.length, isAtBottom]);

  // Handle scroll events
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsAtBottom(isNearBottom);
    setShowScrollButton(!isNearBottom && scrollTop > 200);
  };

  // Throttled AI response function
  const throttledAIResponse = useThrottle(() => {
    const now = Date.now();
    if (now - lastAIResponseTime.current < AI_THROTTLE_DELAY) {
      toast.error('Please wait a moment before sending another message');
      return;
    }
    
    lastAIResponseTime.current = now;
    
    dispatch(setTyping(true));
    
    setTimeout(() => {
      const aiMessage = {
        id: generateId(),
        content: generateAIResponse(),
        type: MESSAGE_TYPES.AI,
        timestamp: Date.now(),
        chatroomId,
        status: 'sent',
      };
      
      dispatch(addMessage({ chatroomId, message: aiMessage }));
      dispatch(setTyping(false));
      
      // Save to localStorage
      const savedMessages = storage.get(STORAGE_KEYS.MESSAGES) || {};
      savedMessages[chatroomId] = [...(savedMessages[chatroomId] || []), aiMessage];
      storage.set(STORAGE_KEYS.MESSAGES, savedMessages);
      
      // Update chatroom in localStorage
      const savedChatrooms = storage.get(STORAGE_KEYS.CHATROOMS) || [];
      const updatedChatrooms = savedChatrooms.map(room => 
        room.id === chatroomId 
          ? { ...room, lastMessage: aiMessage.content, lastMessageTime: aiMessage.timestamp, updatedAt: aiMessage.timestamp }
          : room
      );
      storage.set(STORAGE_KEYS.CHATROOMS, updatedChatrooms);
    }, AI_RESPONSE_DELAY);
  }, AI_THROTTLE_DELAY);

  const handleSendMessage = () => {
    if (!messageText.trim() && !selectedImage) return;

    const userMessage = {
      id: generateId(),
      content: messageText.trim(),
      type: MESSAGE_TYPES.USER,
      timestamp: Date.now(),
      chatroomId,
      status: 'sent',
      image: selectedImage,
    };

    dispatch(addMessage({ chatroomId, message: userMessage }));
    
    // Save to localStorage
    const savedMessages = storage.get(STORAGE_KEYS.MESSAGES) || {};
    savedMessages[chatroomId] = [...(savedMessages[chatroomId] || []), userMessage];
    storage.set(STORAGE_KEYS.MESSAGES, savedMessages);
    
    // Update chatroom in localStorage
    const savedChatrooms = storage.get(STORAGE_KEYS.CHATROOMS) || [];
    const updatedChatrooms = savedChatrooms.map(room => 
      room.id === chatroomId 
        ? { ...room, lastMessage: userMessage.content || 'Image', lastMessageTime: userMessage.timestamp, updatedAt: userMessage.timestamp }
        : room
    );
    storage.set(STORAGE_KEYS.CHATROOMS, updatedChatrooms);

    setMessageText('');
    setSelectedImage(null);
    
    // Trigger AI response
    throttledAIResponse();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setSelectedImage(base64);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleCopyMessage = async (content) => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success('Message copied to clipboard!');
    } else {
      toast.error('Failed to copy message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!currentChatroom) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading chatroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentChatroom.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI Assistant • Always online
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 chat-messages"
      >
        {/* Loading more messages indicator */}
        {isFetchingMore && (
          <div className="text-center py-4">
            <MessageSkeleton />
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">
          {chatroomMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === MESSAGE_TYPES.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  group relative max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl
                  ${message.type === MESSAGE_TYPES.USER
                    ? 'bg-primary-600 text-white rounded-l-lg rounded-tr-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-r-lg rounded-tl-lg'
                  }
                  p-3 shadow-sm
                `}
              >
                {/* Image */}
                {message.image && (
                  <div className="mb-2">
                    <img
                      src={message.image}
                      alt="Uploaded"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Message content */}
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}

                {/* Timestamp and copy button */}
                <div className={`
                  flex items-center justify-between mt-2 text-xs
                  ${message.type === MESSAGE_TYPES.USER 
                    ? 'text-primary-100' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  <span>{formatMessageTime(message.timestamp)}</span>
                  <button
                    onClick={() => handleCopyMessage(message.content)}
                    className={`
                      opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded
                      ${message.type === MESSAGE_TYPES.USER
                        ? 'hover:bg-primary-700'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                    title="Copy message"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}

      {/* Image preview */}
      {selectedImage && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Image ready to send</p>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-red-500 hover:text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end space-x-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Upload image"
          >
            <Image className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !selectedImage}
            className="p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default ChatRoom;
