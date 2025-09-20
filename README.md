# Gemini Clone - AI Chat Application

A responsive React.js frontend for a Gemini-style conversational AI chat application.

## 🚀 Live Demo

*Deployment URL will be added after hosting on Vercel/Netlify*

## 📋 Key Features

- **OTP Authentication** with country codes and form validation
- **Dashboard** with chatroom management and search
- **Real-time Chat** with AI responses, typing indicators, and message history
- **Image Upload** support with file validation
- **Infinite Scroll** and pagination for message loading
- **Dark Mode** toggle with localStorage persistence
- **Mobile Responsive** design with touch-friendly interface
- **Accessibility** features and keyboard navigation

## 🛠️ Tech Stack

| Feature | Technology |
|---------|------------|
| **Framework** | React.js 18 |
| **State Management** | Redux Toolkit |
| **Routing** | React Router DOM |
| **Form Validation** | React Hook Form + Zod |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Build Tool** | Create React App |

## 📁 Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── MessageSkeleton.js
│   │   └── TypingIndicator.js
│   └── Layout/
│       ├── Header.js
│       ├── Layout.js
│       └── Sidebar.js
├── hooks/
│   ├── useDebounce.js
│   ├── useInfiniteScroll.js
│   ├── useLocalStorage.js
│   └── useThrottle.js
├── pages/
│   ├── AuthPage.js
│   ├── ChatRoom.js
│   └── Dashboard.js
├── store/
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── chatSlice.js
│   │   └── uiSlice.js
│   └── index.js
├── utils/
│   ├── cn.js
│   ├── constants.js
│   ├── helpers.js
│   └── storage.js
├── App.js
├── index.css
└── index.js
```

## 🚀 Setup and Installation

```bash
# Clone and install
git clone [repository-url]
cd gemini-clone
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🔧 Implementation Highlights

- **Authentication**: Real country API integration with Zod validation
- **State Management**: Redux Toolkit with auth, chat, and UI slices
- **Chat Features**: Message throttling, infinite scroll, and image upload
- **Performance**: Debounced search, lazy loading, and optimized re-renders
- **Responsive**: Mobile-first design with adaptive layouts

## 🧪 Demo Features

- **OTP Testing**: Use any 6-digit number (e.g., 123456)
- **Mock Data**: Pre-populated dummy messages for demonstration
- **Simulated Delays**: Realistic AI response timing

## 🚀 Deployment

Ready for deployment on Vercel or Netlify with optimized production build.

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For any questions or feedback regarding this project, please feel free to reach out.

---

**Built for Kuvaka Tech Frontend Developer Assignment**

*This project demonstrates proficiency in React.js, Redux, modern UI/UX design, and frontend development best practices.*
