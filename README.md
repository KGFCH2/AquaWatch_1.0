# AquaWatch 🌊

**Real-time Water Crisis Monitoring System for India**

AquaWatch is a comprehensive web application that provides real-time monitoring and analysis of India's water crisis situation across all states and union territories. The platform offers critical insights into groundwater depletion, water availability, and population impact through an intuitive dashboard interface.

## 🌟 Features

### 📊 **Dashboard Overview**

- **National Crisis Statistics**: Real-time monitoring of states in crisis, water availability levels, affected population, and groundwater depletion rates
- **State-wise Analysis**: Detailed breakdown of water conditions across all Indian states
- **Interactive State Grid**: Visual representation of water crisis severity with color-coded indicators
- **Trend Analysis**: Historical data tracking with up/down/stable trend indicators

### 🚨 **Emergency Response**

- **Crisis Alerts Panel**: Real-time alerts and notifications for water emergencies
- **Emergency Response Modal**: Quick access to emergency protocols and response procedures
- **Emergency Contacts**: State-wise emergency contact information for water crisis situations

### 💡 **Solutions & Resources**

- **Water Management Solutions**: Comprehensive list of water conservation and management strategies
- **Data Methodology**: Transparent information about data sources and analysis methods
- **Government Resources**: Links to official water management policies and initiatives

### 📱 **User Experience**

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading Animations**: Smooth user experience with elegant loading screens
- **Accessible Interface**: ARIA-compliant design for screen readers and accessibility tools
- **Mobile-First Navigation**: Collapsible menu system for mobile users

## 🏗️ Project Structure

```
AquaWatch_1.0/
├── frontend/                 # React + TypeScript frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── AlertsPanel.tsx          # Water crisis alerts system
│   │   │   ├── CrisisOverview.tsx       # National crisis statistics
│   │   │   ├── DataMethodologyModal.tsx # Data sources modal
│   │   │   ├── EmergencyModal.tsx       # Emergency response system
│   │   │   ├── Footer.tsx               # Application footer
│   │   │   ├── Header.tsx               # Navigation header
│   │   │   ├── LoadingScreen.tsx        # Loading animation
│   │   │   ├── Solutions.tsx            # Water management solutions
│   │   │   └── StateGrid.tsx            # Interactive state grid
│   │   ├── App.tsx           # Main application component
│   │   ├── main.tsx          # Application entry point
│   │   ├── index.css         # Global styles with Tailwind CSS
│   │   └── vite-env.d.ts     # TypeScript environment definitions
│   ├── index.html            # HTML entry point
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.ts        # Vite build configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── postcss.config.js     # PostCSS configuration
│   ├── eslint.config.js      # ESLint configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── tsconfig.app.json     # App-specific TypeScript config
│   └── tsconfig.node.json    # Node-specific TypeScript config
└── backend/                  # Python data processing scripts
    ├── analyse_csv.py        # CSV to JSON data conversion
    ├── upload_to_firebase.py # Firebase Firestore data upload
    └── .gitignore            # Git ignore for sensitive files
```

## 🛠️ Technology Stack

### **Frontend**

- **React 18.3.1** - Modern React with functional components and hooks
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Beautiful, customizable icons
- **Firebase 12.2.1** - Real-time database and hosting

### **Backend**

- **Python** - Data processing and analysis
- **Pandas** - Data manipulation and analysis
- **Firebase Admin SDK** - Server-side Firebase integration

### **Development Tools**

- **ESLint** - Code linting and quality assurance
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS post-processing
- **Autoprefixer** - Automatic vendor prefixing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Python 3.8+** (for backend scripts)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Atanu2k4/AquaWatch_1.0.git
   cd AquaWatch_1.0
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies** (optional, for data processing)
   ```bash
   cd ../backend
   pip install pandas firebase-admin
   ```

### Development

1. **Start the development server**

   ```bash
   cd frontend
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

2. **Build for production**

   ```bash
   npm run build
   ```

3. **Preview production build**

   ```bash
   npm run preview
   ```

4. **Run linting**
   ```bash
   npm run lint
   ```

### Backend Data Processing

1. **Convert CSV to JSON** (requires data/groundwater_india.csv)

   ```bash
   cd backend
   python analyse_csv.py
   ```

2. **Upload to Firebase** (requires Firebase credentials)
   ```bash
   python upload_to_firebase.py
   ```

## 📊 Data Sources

AquaWatch aggregates data from multiple reliable sources:

- **Government Databases**: Central Ground Water Board (CGWB)
- **Satellite Data**: Remote sensing for groundwater monitoring
- **Real-time Sensors**: IoT-enabled water level monitoring systems
- **Weather Services**: Meteorological data for drought assessment
- **Population Census**: Demographic data for impact analysis

_Data is updated every 6 hours to ensure accuracy and timeliness._

## 🎯 Key Metrics Tracked

- **Water Availability**: Current reservoir and groundwater levels
- **Crisis Severity**: State-wise crisis classification (Critical/High/Moderate/Low)
- **Population Impact**: Number of people affected by water stress
- **Groundwater Depletion**: Annual decline rates across regions
- **Trend Analysis**: Month-over-month and year-over-year comparisons

## 🔧 Configuration

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
# ... other Firebase config
```

## 🤝 Contributing

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Atanu2k4/AquaWatch_1.0/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## 🌍 Impact

AquaWatch aims to:

- **Raise Awareness** about India's water crisis
- **Enable Quick Response** to water emergencies
- **Support Decision Making** with real-time data
- **Promote Conservation** through education and solutions
- **Connect Communities** with resources and support

---

**Built with ❤️ for India's water security**

_Last updated: September 2025_
