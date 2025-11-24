import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplets,
  Shield,
  Database,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Activity,
  Bell,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Waves,
  CloudRain,
  Gauge,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you! We will contact you shortly.");
    setFormData({ name: "", phone: "", email: "" });
  };

  const features = [
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description:
        "Continuous 24/7 groundwater level tracking with instant data updates and alerts",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive data analysis with trend predictions and historical comparisons",
    },
    {
      icon: Bell,
      title: "Crisis Alerts",
      description:
        "Automated alert system for critical water levels and emergency situations",
    },
    {
      icon: Shield,
      title: "CGWA Compliant",
      description:
        "Full compliance with Central Ground Water Authority guidelines and regulations",
    },
    {
      icon: Database,
      title: "Centralized Database",
      description:
        "Secure cloud storage with API access for seamless data integration",
    },
    {
      icon: Lightbulb,
      title: "Smart Solutions",
      description:
        "AI-powered recommendations for water conservation and management strategies",
    },
  ];

  const services = [
    {
      icon: Waves,
      title: "Digital Water Level Recorder (DWLR)",
      description:
        "Advanced DWLR systems with high accuracy, stability, and durability for precise groundwater monitoring",
    },
    {
      icon: Gauge,
      title: "Telemetry & Data Collection",
      description:
        "Remote data acquisition through GPRS/GSM with real-time transmission to centralized servers",
    },
    {
      icon: CloudRain,
      title: "Hydrogeological Survey",
      description:
        "Comprehensive groundwater surveys and aquifer assessment for sustainable water management",
    },
    {
      icon: Database,
      title: "Data Management Platform",
      description:
        "Cloud-based platform for data storage, analysis, and visualization with API integration",
    },
  ];

  const stats = [
    { number: "28+", label: "States Covered", icon: MapPin },
    { number: "14,000+", label: "DWLR Installations", icon: Gauge },
    { number: "24/7", label: "Real-Time Monitoring", icon: Activity },
    { number: "100%", label: "CGWA Compliant", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 to-blue-800 dark:from-slate-900 dark:to-slate-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/t2-removebg-preview.png"
                alt="AquaWatch Logo"
                className="h-10 w-9 object-cover"
              />
              <div>
                <h1 className="text-xl font-bold">AquaWatch</h1>
                <p className="text-xs text-blue-200 dark:text-water-300">
                  Water Crisis Monitoring
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              <a
                href="#features"
                className="px-3 py-2 hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#services"
                className="px-3 py-2 hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                Services
              </a>
              <a
                href="#contact"
                className="px-3 py-2 hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                Contact
              </a>
              <div className="flex items-center px-2">
                <ThemeToggle />
              </div>
              <button
                onClick={handleGetStarted}
                className="bg-cyan-400 hover:bg-cyan-500 text-blue-900 px-6 py-2.5 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <div className="flex items-center">
                <ThemeToggle />
              </div>
              <button
                onClick={handleGetStarted}
                className="bg-cyan-400 hover:bg-cyan-500 text-blue-900 px-5 py-2 rounded-full font-bold text-sm shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-800/40 dark:bg-slate-800/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-cyan-400/30 dark:border-cyan-400/20">
                <CheckCircle className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-white">
                  ISO 9001:2015 & ISO 14001:2015 Certified
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Digital Water Level Recorder
                <span className="block text-cyan-400 mt-3">(DWLR)</span>
              </h1>

              <p className="text-xl text-blue-100 dark:text-slate-300 leading-relaxed max-w-2xl">
                Advanced Digital Water Level Recorders (DWLR) for precise groundwater monitoring with real-time data collection, telemetry features, and full CGWA compliance. Ideal for environmental management and resource conservation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="group bg-cyan-400 hover:bg-cyan-500 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#contact"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 text-center shadow-lg hover:shadow-xl"
                >
                  Schedule Free Consultation
                </a>
              </div>

            </div>

            {/* Right side - Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-white/20 dark:border-slate-700/50 hover:border-cyan-400 dark:hover:border-cyan-400 hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  >
                    <Icon className="h-8 w-8 text-cyan-400 mb-4" />
                    <div className="text-3xl font-bold mb-2 text-white">{stat.number}</div>
                    <div className="text-sm text-blue-200 dark:text-slate-300 font-medium leading-snug">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              className="fill-white dark:fill-slate-900"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Revolutionizing Groundwater Monitoring with DWLRs
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              In today's data-driven world, efficient groundwater management is crucial. Digital Water Level Recorders (DWLRs) offer a smart, reliable, and real-time solution for tracking water resources across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-400"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              Comprehensive water monitoring solutions for sustainable resource
              management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-xl flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Sensor Features
              </h2>
              <ul className="space-y-4">
                {[
                  "Titanium / other construction for good automatic control",
                  "Fully sealed, submersible level transmitter with high accuracy",
                  "Uses highly reliable & stable pressure sensor with intelligent processing circuit, precise digital temperature compensation, and linearity correction",
                  "The waterproof cable connects with a sealed housing",
                  "Integrated construction and standard output signal",
                  "Compact size, lightweight, and easy installation and operation",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-gray-700 dark:text-slate-300"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Datalogger and Telemetry Features
              </h2>
              <ul className="space-y-4">
                {[
                  "Inbuilt Telemetry Module for seamless data transfer",
                  "Remote data acquisition through GPRS or GSM protocol",
                  "Data sent to a centralized data collection website",
                  "Captures data in digital (RS485 MODBUS, RS 232) format",
                  "Successfully deployed for groundwater level meters, weather data, river flow sensors, and pollution data",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-gray-700 dark:text-slate-300"
                  >
                    <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Get Free Expert Assistance
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Request Free Callback
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-8">
                  Regulating and Managing Groundwater Resources for a
                  Water-Secure India.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-xl">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400">
                      +91-9691858058
                    </p>
                    <p className="text-gray-600 dark:text-slate-400">
                      +91-6264506023
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-xl">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400">
                      support@aquawatch.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Address
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400">
                      National Water Monitoring Center
                      <br />
                      New Delhi, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl shadow-lg border-2 border-blue-200 dark:border-cyan-900">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Certifications
                  </h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-blue-600 dark:text-cyan-400">ISO 9001:2015</span>, <span className="font-bold text-blue-600 dark:text-cyan-400">ISO 14001:2015</span> & <span className="font-bold text-blue-600 dark:text-cyan-400">ISO 45001:2018</span> Certified company ensuring quality, environmental, and safety standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-slate-950 dark:to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Droplets className="h-8 w-8 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold">AquaWatch</h3>
                  <p className="text-sm text-blue-200">
                    Water Crisis Monitoring
                  </p>
                </div>
              </div>
              <p className="text-blue-200 dark:text-slate-300 text-sm">
                Regulating and Managing Groundwater Resources for a
                Water-Secure India.
              </p>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Useful Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={handleGetStarted}
                    className="text-blue-200 hover:text-cyan-400 transition-colors text-left"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-blue-200 hover:text-cyan-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-blue-200 hover:text-cyan-400 transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-blue-200 hover:text-cyan-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-blue-200 dark:text-slate-300">
                <li>CGWA NOC</li>
                <li>NOC Renewal From CGWA</li>
                <li>NOC Compliances</li>
                <li>Ground Water Survey</li>
                <li>Hydrogeological Survey</li>
                <li>Earth Resistivity Test</li>
                <li>Satellite Survey</li>
                <li>Yield Testing</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-700 dark:border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-blue-200 dark:text-slate-400">
                © 2025 AquaWatch. All Right Reserved | Developed by AquaWatch
                Team
              </p>
              <p className="text-sm text-blue-200 dark:text-slate-400 mt-2 md:mt-0">
                AquaWatch is an ISO 9001:2015, ISO 14001:2015 & ISO 45001:2018
                Certified company
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <a
        href="tel:+919691858058"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-200 transform hover:scale-110 z-40 animate-pulse"
        aria-label="Call us now"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
};
