import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Clock, Search } from 'lucide-react';
import { formatTimestamp } from '../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { chatrooms, searchQuery } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  // Filter chatrooms based on search query
  const filteredChatrooms = chatrooms.filter(room =>
    room.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatroomClick = (chatroomId) => {
    navigate(`/chat/${chatroomId}`);
  };

  const recentChatrooms = filteredChatrooms
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your conversations or start a new chat with Gemini AI
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {chatrooms.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Total Chats</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {recentChatrooms.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Recent Chats</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchQuery ? filteredChatrooms.length : chatrooms.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? 'Search Results' : 'Available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Chats */}
        {recentChatrooms.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {searchQuery ? 'Search Results' : 'Recent Chats'}
              </h2>
              {searchQuery && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredChatrooms.length} result{filteredChatrooms.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentChatrooms.map((chatroom) => (
                <div
                  key={chatroom.id}
                  onClick={() => handleChatroomClick(chatroom.id)}
                  className="card p-4 cursor-pointer hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {chatroom.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimestamp(chatroom.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {chatroom.lastMessage && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {chatroom.lastMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchQuery ? (
                <Search className="w-12 h-12 text-gray-400" />
              ) : (
                <MessageSquare className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No chats match "${searchQuery}". Try a different search term.`
                : 'Start your first conversation with Gemini AI. Create a new chat to begin.'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Chat
              </button>
            )}
          </div>
        )}

        {/* Getting Started Tips */}
        {!searchQuery && chatrooms.length === 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Getting Started
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Create a Chat</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click the "New Chat" button to start a conversation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Ask Questions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type your message and get AI-powered responses
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Share Images</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload images to get visual analysis and insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Manage Chats</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Organize and search through your conversation history
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
