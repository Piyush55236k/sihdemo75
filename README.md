# 🌾 FarmQuest - Gamified Farming Platform

A modern, gamified platform designed to help Indian farmers learn and implement sustainable farming practices through interactive quests, community engagement, and progress tracking.

## ✨ Features

### 🏡 Landing Page
- **Hero Section**: Compelling value proposition with "Grow Smarter. Get Rewarded."
- **Features Grid**: Showcases core platform benefits with icons and descriptions
- **Social Proof**: Testimonials from farmers and partner logos
- **Call-to-Action**: Prominent buttons to start farming journey

### 📊 Dashboard
- **Sustainability Score**: Circular progress indicator with percentage
- **Level System**: Visual level progression (Seedling → Sprout → Harvest Master)
- **Progress Tracker**: Current quests with progress bars and rewards
- **Recent Achievements**: Badge showcase and point rewards
- **Activity Feed**: Community updates and peer engagement

### 🌿 Quest System
- **Quest Cards**: Visual quest selection with difficulty levels
- **Step-by-Step Guides**: Detailed instructions for each farming task
- **Photo Upload**: In-app camera integration for quest completion
- **Rewards System**: Points and badges for completed quests
- **Categories**: Soil Health, Water Management, Energy, Pest Management, Crop Management

### 🏆 Community Hub
- **Leaderboard**: Competitive rankings based on sustainability scores
- **Farmer Profiles**: Detailed profiles with achievements and badges
- **Community Forums**: Discussion topics and knowledge sharing
- **Search & Filter**: Find farmers and topics easily

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gamified-farming-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: CSS with CSS Variables
- **Animations**: CSS Transitions + Framer Motion
- **Build Tool**: Vite

## 📱 Design Philosophy

### Inspired by:
- **Duolingo**: Learning through play with vibrant colors and clear progress paths
- **Headspace**: Clean, minimalist design with calming aesthetics
- **Strava**: Social fitness tracking and community engagement
- **LinkedIn**: Professional networking and profile management

### Key Design Principles:
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: High contrast and readable typography
- **Gamification**: Progress bars, badges, and reward systems
- **Community**: Social features and peer learning
- **Sustainability**: Green color scheme and nature-inspired elements

## 🎯 Target Audience

- **Primary**: Indian farmers looking to adopt sustainable practices
- **Secondary**: Agricultural students and researchers
- **Tertiary**: Farming communities and cooperatives

## 🔮 Future Enhancements

- **Backend Integration**: User authentication and data persistence
- **Mobile App**: Native iOS and Android applications
- **AI Recommendations**: Personalized quest suggestions
- **Weather Integration**: Local weather data for farming decisions
- **Marketplace**: Connect farmers with sustainable farming supplies
- **Expert Consultation**: Video calls with agricultural experts
- **Multi-language Support**: Hindi, English, and regional languages

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.jsx     # Navigation component
├── pages/              # Page components
│   ├── LandingPage.jsx # Landing page with hero and features
│   ├── Dashboard.jsx   # User dashboard and progress
│   ├── QuestPage.jsx   # Quest selection and completion
│   └── CommunityPage.jsx # Community features and leaderboard
├── App.jsx             # Main app component with routing
├── main.jsx            # Application entry point
├── index.css           # Global styles and CSS variables
└── App.css             # App-specific styles
```

## 🎨 Customization

### Colors
The platform uses CSS variables for easy theming:
```css
:root {
  --primary-green: #22c55e;
  --secondary-green: #86efac;
  --accent-yellow: #fbbf24;
  --accent-orange: #fb923c;
}
```

### Adding New Quests
Quests are defined in `src/pages/QuestPage.jsx` with the following structure:
```javascript
{
  id: 1,
  title: "Quest Title",
  description: "Quest description",
  difficulty: "Easy|Medium|Hard",
  estimatedTime: "2-3 hours",
  location: "Farm location",
  rewards: { points: 50, badge: "Badge Name" },
  icon: IconComponent,
  category: "Category Name",
  steps: ["Step 1", "Step 2", "Step 3"],
  tips: ["Tip 1", "Tip 2", "Tip 3"]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Indian Council of Agricultural Research (ICAR)
- National Bank for Agriculture and Rural Development (NABARD)
- Krishi Vigyan Kendras (KVK)
- Farming communities across India

---

**Made with ❤️ for Indian Farmers**

*Empowering sustainable agriculture through technology and community*
