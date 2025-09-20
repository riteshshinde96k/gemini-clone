import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, MessageSquare, Trash2, X } from 'lucide-react';
import { addChatroom, deleteChatroom, setSearchQuery } from '../../store/slices/chatSlice';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { generateId } from '../../utils/helpers';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { SAMPLE_CHATROOM_NAMES } from '../../utils/constants';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { chatrooms, searchQuery } = useSelector(state => state.chat);
  const { isMobile } = useSelector(state => state.ui);
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Update Redux search query when debounced value changes
  React.useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [debouncedSearchQuery, dispatch]);

  // Filter chatrooms based on search query
  const filteredChatrooms = chatrooms.filter(room =>
    room.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const handleCreateChatroom = () => {
    const randomName = SAMPLE_CHATROOM_NAMES[Math.floor(Math.random() * SAMPLE_CHATROOM_NAMES.length)];
    const newChatroom = {
      id: generateId(),
      title: randomName,
      lastMessage: '',
      lastMessageTime: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    dispatch(addChatroom(newChatroom));
    
    // Update localStorage
    const updatedChatrooms = [newChatroom, ...chatrooms];
    storage.set(STORAGE_KEYS.CHATROOMS, updatedChatrooms);
    
    toast.success('New chatroom created!');
    navigate(`/chat/${newChatroom.id}`);
    
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  };

  const handleDeleteChatroom = (chatroomId, event) => {
    event.stopPropagation();
    
    dispatch(deleteChatroom(chatroomId));
    
    // Update localStorage
    const updatedChatrooms = chatrooms.filter(room => room.id !== chatroomId);
    storage.set(STORAGE_KEYS.CHATROOMS, updatedChatrooms);
    
    // Remove messages from localStorage
    const savedMessages = storage.get(STORAGE_KEYS.MESSAGES) || {};
    delete savedMessages[chatroomId];
    storage.set(STORAGE_KEYS.MESSAGES, savedMessages);
    
    toast.success('Chatroom deleted!');
    
    // Navigate to dashboard if we're currently in the deleted chatroom
    if (location.pathname === `/chat/${chatroomId}`) {
      navigate('/dashboard');
    }
  };

  const handleChatroomClick = (chatroomId) => {
    navigate(`/chat/${chatroomId}`);
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chats
          </h2>
          {isMobile && (
            <button
              onClick={handleCloseSidebar}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-600"
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleCreateChatroom}
          className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChatrooms.length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </p>
            {!searchQuery && (
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Create your first chat to get started
              </p>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredChatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                onClick={() => handleChatroomClick(chatroom.id)}
                className={`
                  group relative p-3 rounded-lg cursor-pointer transition-colors mb-1
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  ${location.pathname === `/chat/${chatroom.id}` 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' 
                    : ''
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {chatroom.title}
                    </h3>
                    {chatroom.lastMessage && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {chatroom.lastMessage}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatTime(chatroom.updatedAt)}
                    </span>
                    <button
                      onClick={(e) => handleDeleteChatroom(chatroom.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-all"
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
