# 🦕 Dineosaur - Collaborative Restaurant Discovery

A no-login, group-based web app for collaborative restaurant discovery — similar to how Spotify asks you to choose your favorite artists and Tinder uses swipe-based decisions. This app solves the common problem of "where to eat" among couples or groups by allowing anonymous users to make a group decision based on personal food preferences.

## 🎯 Features

- **Anonymous Usage**: No login or signup required
- **Group Decision Making**: Perfect for couples and groups up to 8 people
- **Tinder-Style Interface**: Swipe through restaurant recommendations
- **Preference-Based Filtering**: Select food preferences to narrow down options
- **Real-Time Collaboration**: Share room codes and collaborate in real-time
- **Smart Matching**: AI-powered recommendations based on group preferences
- **Mobile-First Design**: Beautiful, responsive UI that works on all devices

## 🧱 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React
- **Backend**: Firebase Firestore (configured but using localStorage for demo)
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dineosaur
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for demo)
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔄 App Flow

1. **Homepage**: Choose between "Couple" or "Group" room type
2. **Room Creation**: Generate a 6-character room code and shareable link
3. **Join Page**: Enter room code to join existing sessions
4. **Preference Picker**: Select food preferences (minimum 3, maximum 8)
5. **Swipe Screen**: Tinder-style interface for restaurant discovery
6. **Results Screen**: View top matches based on group consensus

## 📱 Usage

### Creating a Room
1. Visit the homepage
2. Select "Couple" or "Group"
3. Click "Create Room"
4. Share the generated room code with your friends

### Joining a Room
1. Click "Join an existing room" on the homepage
2. Enter the 6-character room code
3. Start selecting your preferences

### Selecting Preferences
- Choose at least 3 food preferences
- Options include cuisines, tastes, and dietary restrictions
- Your selections help filter restaurant recommendations

### Swiping on Restaurants
- Swipe right to like, left to skip
- Use the super like button for restaurants you really love
- View restaurant details and take actions (Maps, Website, Copy Address)

### Viewing Results
- See top matches based on group consensus
- View scores, likes, and super likes for each restaurant
- Take actions to visit or get directions to restaurants

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── join/              # Join room page
│   ├── room/[roomId]/     # Room pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── PreferencePicker.tsx
│   ├── SwipeScreen.tsx
│   └── ResultsScreen.tsx
├── lib/                   # Utilities and configurations
│   ├── firebase.ts        # Firebase configuration
│   ├── types.ts           # TypeScript interfaces
│   ├── constants.ts       # App constants
│   └── utils.ts           # Utility functions
└── globals.css           # Global styles
```

## 🔧 Configuration

### Firebase Setup (Optional)

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Add your Firebase config to `.env.local`
4. Update `src/lib/firebase.ts` to use real Firebase instead of localStorage

### Zomato API Integration (Future)

To integrate real restaurant data:
1. Get a Zomato API key from [developers.zomato.com](https://developers.zomato.com)
2. Create API routes in `src/app/api/`
3. Replace mock data in `src/lib/constants.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Environment Variables for Production

Set these in your Vercel dashboard:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 🎨 Customization

### Styling
- Colors: Update Tailwind config in `tailwind.config.ts`
- Animations: Modify Framer Motion animations in components
- Layout: Adjust responsive breakpoints and grid layouts

### Features
- Add more food preferences in `src/lib/constants.ts`
- Modify scoring algorithm in `src/lib/utils.ts`
- Add new restaurant actions in components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Tinder's swipe interface
- Food preference selection inspired by Spotify's artist selection
- Built with Next.js and Tailwind CSS
- Icons from Lucide React

## 📞 Support

For support, email support@dineosaur.app or create an issue in this repository.

---

Made with ❤️ by the Dineosaur Team
