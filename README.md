# 💧 AquaWatch 💧  

![React](https://img.shields.io/badge/React-18-blue?logo=react)  ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)   ![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)  ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-teal?logo=tailwindcss)  ![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)  ![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green?logo=fastapi)  ![Python](https://img.shields.io/badge/Python-3.13.7-yellow?logo=python) 

**🌍 Real-time Water Crisis Monitoring System for India**  

AquaWatch is a comprehensive web application that provides **real-time monitoring and analysis** of India’s water crisis across all states and union territories.  
The platform offers **critical insights** into groundwater depletion, water availability, and population impact through an intuitive dashboard.  

---

## ✨ Features  

### 🛠️ Admin Dashboard  
- 🌐 **National Water Crisis Overview**: Real-time monitoring of states in crisis with statistics  
- 🗺️ **State-wise Analysis**: Detailed breakdown of water conditions across all Indian states  
- 📑 **Interactive State Cards**: Clickable cards with historical water level charts  
- 📈 **Trend Analysis**: Up/down/stable water level trends  
- 👥 **User Management**: Admin panel for managing users  

### 👤 User Dashboard  
- 📍 **Personal Water Level Monitoring**: Real-time tracking for user’s state  
- 📊 **Real-time Graphs**: Interactive charts with trends  
- 🚦 **Status Overview**: Visual indicators for water conditions  
- ⚡ **Quick Actions**: Easy access to emergency contacts and solutions  

### 🔐 Authentication & Security  
- 🧑‍💼 **Role-based Access**: Admin vs User dashboards  
- 🔑 **Firebase Authentication**: Secure login  
- 📝 **User Registration**: Signup with state selection  
- 🔒 **Session Management**: Persistent secure sessions  

### 🚨 Emergency Response  
- 🔔 **Crisis Alerts Panel**: Real-time notifications  
- 🚑 **Emergency Response Modal**: Quick response procedures  
- ☎️ **Emergency Contacts**: State-wise emergency info  

### 💡 Solutions & Resources  
- 🌱 **Water Management Solutions**: Conservation and management strategies  
- 📖 **Data Methodology**: Transparent data sources  
- 🏛️ **Government Resources**: Official policy links  

### 🎨 User Experience  
- 🌙 **Dark/Light Theme**: Mode toggle  
- 📱 **Responsive Design**: Mobile-first  
- ⏳ **Loading Animations**: Smooth experience  
- ♿ **Accessible Interface**: ARIA-compliant  
- 🧭 **Mobile Navigation**: Collapsible menu  
 
---

## 📂 Project Structure  

| 📁 Folder/File | 📖 Description |
|----------------|----------------|
| 🖥️ **frontend/** | React + TypeScript frontend |
| ├── ⚛️ **components/** | Reusable UI components |
| ├── 🌐 **contexts/** | Auth, Theme, Data providers |
| ├── 🔥 **firebase/** | Firebase configuration |
| ├── 🛠️ **utils/** | Data utilities |
| └── 📝 **App.tsx** | Main entry |
| 🐍 **backend/** | Python FastAPI backend |
| ├── 🚀 **main.py** | API server |
| ├── 📊 **check_firebase_data.py** | Firebase data analysis |
| ├── 📤 **upload_csv_data.py** | CSV upload utility |
| └── 📑 **data/dwlr_india.csv** | Dataset |

---

## 🛠️ Technology Stack  

| ⚙️Layer | 🔧Tools |
|-------|-------|
| **Frontend** | ⚛️ React · 🟦 TypeScript · ⚡ Vite · 🎨 Tailwind · 🔥 Firebase · 📊 Chart.js · 🎞️ Framer Motion |
| **Backend** | 🐍 Python · 🚀 FastAPI · 📊 Pandas · 🔥 Firebase Admin SDK · 👀 Watchdog · 🌐 Uvicorn |
| **Dev Tools** | ✅ ESLint · 🧹 TypeScript ESLint · 🎨 PostCSS · 🔄 Autoprefixer |

---

## ⚡ Getting Started  

### 📋 Prerequisites  
- 📦 Node.js (v18+)  
- 🐍 Python 3.8+  
- 🛠️ npm / yarn  

### 🔧 Installation  

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

### ▶️ Development

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

### ⚙️ Backend API Server (Optional)

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

## 🏗️ Application Architecture  

![AquaWatch Architecture Diagram](aquawatch_architecture.png)

---

## 📊 Data Sources  

- 🌍 **Government Databases**: CGWB  
- ⛏️ **DWLR Sensors**: Deep Water Level Recorders  
- 📡 **IoT Monitoring**: Real-time sensors  
- 🔥 **Firebase**: Real-time sync  
- 📂 **CSV Processing**: Automated updates  

---

## 📐 Key Metrics  

- 📏 **Water Level (m bgl)**  
- 🚨 **Crisis Status**: Critical / Warning / Normal / Good  
- ⏳ **Trends**: Live & historical  
- 🗺️ **Coverage**: All Indian states  
- 📈 **User Analytics**: Usage patterns  

---

## ⚙️ Configuration  

### 🔥 Firebase Setup  
- Create project → Enable Firestore → Download config → Update `.env`  

### ⚡ Environment Variables (`frontend/.env`)  
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🤝 Contributing  

We welcome contributions to improve **AquaWatch**!  

1. 🍴 **Fork** the repository  
2. 🌿 **Create** your feature branch (`git checkout -b feature/AmazingFeature`)  
3. 💾 **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)  
4. 📤 **Push** to the branch (`git push origin feature/AmazingFeature`)  
5. 🔀 **Open a Pull Request**  

Please ensure your code follows the existing style guidelines and is well-documented.  

---

## 🆘 Support  

If you encounter any issues or bugs, please:  

- 📌 Check the [Issues](https://github.com/Atanu2k4/AquaWatch_1.0/issues) page to see if it’s already reported.  
- 📝 If not, create a **new issue** with:  
  - 🖥️ Your OS and environment details  
  - ⚠️ Error messages/logs  
  - 📷 Screenshots (if applicable)  

For general questions or suggestions, feel free to open a **discussion thread**.  

---

## 🌍 Impact  

AquaWatch aims to:  
- 📢 Raise awareness about India’s water crisis  
- 🚨 Enable quick emergency response  
- 📊 Support data-driven decision making  
- 🌱 Promote conservation  
- 🤝 Connect communities with solutions  

---

🔵 **Built for India’s Water Security 🇮🇳**  

🕒 Last updated: October 03, 2025 

---





