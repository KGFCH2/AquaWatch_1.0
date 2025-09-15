# AquaWatch

**Real-time Water Crisis Monitoring System for India**

AquaWatch is a comprehensive web application that provides real-time monitoring and analysis of India's water crisis situation across all states and union territories. The platform offers critical insights into groundwater depletion, water availability, and population impact through an intuitive dashboard interface.

## Features

### Admin Dashboard

- **National Water Crisis Overview**: Real-time monitoring of states in crisis with comprehensive statistics
- **State-wise Analysis**: Detailed breakdown of water conditions across all Indian states
- **Interactive State Cards**: Clickable state cards with detailed water level history charts
- **Trend Analysis**: Historical data tracking with up/down/stable trend indicators
- **User Management**: Admin interface for managing user accounts and access

### User Dashboard

- **Personal Water Level Monitoring**: Real-time water level tracking for user's state
- **Real-time Graphs**: Interactive charts showing water level trends over time
- **Status Overview**: Current water status with visual indicators
- **Quick Actions**: Easy access to emergency contacts and solutions

### Authentication & Security

- **Role-based Access**: Separate dashboards for admin and regular users
- **Firebase Authentication**: Secure login system with email/password
- **User Registration**: New user signup with state selection
- **Session Management**: Persistent login sessions with secure logout

### Emergency Response

- **Crisis Alerts Panel**: Real-time alerts and notifications for water emergencies
- **Emergency Response Modal**: Quick access to emergency protocols and response procedures
- **Emergency Contacts**: State-wise emergency contact information for water crisis situations

### Solutions and Resources

- **Water Management Solutions**: Comprehensive list of water conservation and management strategies
- **Data Methodology**: Transparent information about data sources and analysis methods
- **Government Resources**: Links to official water management policies and initiatives

### User Experience

- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading Animations**: Smooth user experience with elegant loading screens
- **Accessible Interface**: ARIA-compliant design for screen readers and accessibility tools
- **Mobile-First Navigation**: Collapsible menu system for mobile users

## Project Structure

**AquaWatch_1.0/**

- **frontend/** - React + TypeScript frontend application
  - **src/**
    - **components/** - Reusable React components
      - AdminDashboard.tsx - Admin dashboard with national overview
      - AdminLogin.tsx - Admin authentication component
      - AlertsPanel.tsx - Water crisis alerts system
      - Authentication.tsx - Main authentication wrapper
      - DataMethodologyModal.tsx - Data sources modal
      - EmergencyModal.tsx - Emergency response system
      - Footer.tsx - Application footer
      - Header.tsx - Navigation header with theme toggle
      - LoadingScreen.tsx - Loading animation
      - RealTimeGraph.tsx - Real-time water level charts
      - RoleSelection.tsx - User role selection component
      - Solutions.tsx - Water management solutions
      - StateDetailsPopup.tsx - Detailed state water history popup
      - ThemeToggle.tsx - Dark/light mode toggle
      - UserDatabase.tsx - User management interface
      - UserDashboard.tsx - User dashboard with personal monitoring
      - UserLogin.tsx - User authentication component
      - UserSignup.tsx - User registration component
    - **contexts/** - React context providers
      - AuthContext.tsx - Authentication state management
      - ThemeContext.tsx - Theme state management
      - WaterDataContext.tsx - Water data state management
    - **firebase/** - Firebase configuration
      - config.ts - Firebase app configuration
    - **lib/** - Utility libraries
      - utils.ts - General utility functions
    - **pages/** - Page components
      - AlertsPage.tsx - Alerts page for routing
      - SolutionsPage.tsx - Solutions page for routing
    - **utils/** - Utility functions
      - dataUtils.ts - Data processing utilities
    - App.tsx - Main application component
    - main.tsx - Application entry point
    - index.css - Global styles with Tailwind CSS
    - vite-env.d.ts - TypeScript environment definitions
  - index.html - HTML entry point
  - package.json - Frontend dependencies
  - vite.config.ts - Vite build configuration
  - tailwind.config.js - Tailwind CSS configuration
  - postcss.config.js - PostCSS configuration
  - eslint.config.js - ESLint configuration
  - tsconfig.json - TypeScript configuration
  - tsconfig.app.json - App-specific TypeScript config
  - tsconfig.node.json - Node-specific TypeScript config
- **backend/** - Python data processing and API
  - main.py - FastAPI server for data management
  - check_firebase_data.py - Firebase data analysis script
  - upload_csv_data.py - CSV to Firebase upload utility
  - data/dwlr_india.csv - Water level dataset
  - aquawatch-42795-firebase-adminsdk-fbsvc-c63652eac0.json - Firebase credentials
  - .gitignore - Git ignore for sensitive files

## Technology Stack

### Frontend

- **React 18.3.1** - Modern React with functional components and hooks
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Beautiful, customizable icons
- **Firebase 12.2.1** - Real-time database, authentication, and hosting
- **React Router DOM** - Client-side routing
- **Chart.js & React-Chartjs-2** - Interactive charts and data visualization
- **Framer Motion** - Smooth animations and transitions

### Backend

- **FastAPI** - Modern Python web framework for APIs
- **Python** - Data processing and analysis
- **Pandas** - Data manipulation and analysis
- **Firebase Admin SDK** - Server-side Firebase integration
- **Watchdog** - File system monitoring for real-time updates
- **Uvicorn** - ASGI server for FastAPI

### Development Tools

- **ESLint** - Code linting and quality assurance
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS post-processing
- **Autoprefixer** - Automatic vendor prefixing

## Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Python 3.8+** (for backend scripts)

### Installation

1. **Clone the repository**

   ```
   git clone https://github.com/Atanu2k4/AquaWatch_1.0.git
   cd AquaWatch_1.0
   ```

2. **Install frontend dependencies**

   ```
   cd frontend
   npm install
   ```

3. **Install backend dependencies** (optional, for running API server)
   ```bash
   cd ../backend
   pip install fastapi uvicorn pandas firebase-admin watchdog
   ```

### Development

1. **Start the development server**

   ```
   cd frontend
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

2. **Build for production**

   ```
   npm run build
   ```

3. **Preview production build**

   ```
   npm run preview
   ```

4. **Run linting**
   ```
   npm run lint
   ```

### Backend API Server (Optional)

1. **Start the FastAPI server** (requires data/dwlr_india.csv)

   ```bash
   cd backend
   python main.py
   ```

   The API will be available at `http://localhost:8000`

2. **Check Firebase data**

   ```bash
   python check_firebase_data.py
   ```

3. **Upload CSV data to Firebase** (requires Firebase credentials)
   ```bash
   python upload_csv_data.py
   ```

## Application Architecture

### User Roles

- **Admin Users**: Access to national dashboard, state management, and user administration
- **Regular Users**: Personal dashboard with state-specific water monitoring

### Data Flow

1. **CSV Data**: Water level data stored in backend/data/dwlr_india.csv
2. **Firebase Firestore**: Real-time database storing processed water data
3. **Frontend**: React app consuming Firebase data through contexts
4. **Authentication**: Firebase Auth managing user sessions and roles

### Key Components

- **WaterDataContext**: Manages water level data across the application
- **AuthContext**: Handles user authentication and role management
- **ThemeContext**: Manages dark/light theme preferences
- **Real-time Updates**: Firebase listeners for live data updates

## Data Sources

AquaWatch integrates data from multiple reliable sources:

- **Government Databases**: Central Ground Water Board (CGWB)
- **DWLR Sensors**: Deep Water Level Recorder data from across India
- **Real-time Monitoring**: IoT-enabled water level monitoring systems
- **Firebase Integration**: Real-time data synchronization and storage
- **CSV Processing**: Automated data processing from government datasets

_Data is updated in real-time through Firebase listeners and CSV monitoring._

## Key Metrics Tracked

- **Water Level (m bgl)**: Water depth below ground level in meters
- **Crisis Status**: State-wise classification (Critical/Warning/Normal/Good)
- **Real-time Trends**: Live water level changes and historical patterns
- **State Coverage**: Comprehensive monitoring across Indian states
- **User Analytics**: Dashboard usage and monitoring patterns

## Configuration

### Firebase Setup (Optional)

If you want to enable Firebase integration:

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Download the configuration and add to your environment
4. Update the Firebase configuration in your application

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend API Configuration

For the FastAPI backend server, update the configuration in `main.py`:

```python
# Configuration
CSV_FILE = "data/dwlr_india.csv"
COLLECTION_NAME = "DWLR_state"
API_KEY = "your_api_key_here"
```

## Contributing

We welcome contributions to AquaWatch! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent Tailwind CSS utility usage
- Add proper ARIA labels for accessibility
- Write meaningful commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Atanu2k4/AquaWatch_1.0/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## Impact

AquaWatch aims to:

- Raise awareness about India's water crisis
- Enable quick response to water emergencies
- Support decision making with real-time data
- Promote conservation through education and solutions
- Connect communities with resources and support

---

**Built for India's water security**

Last updated: September 15, 2025
