import React from 'react';
import { Droplets, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Droplets className="h-8 w-8 text-blue-400" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-bold">AquaWatch</h3>
                <p className="text-sm text-gray-400">Water Crisis Monitoring</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering communities and governments with real-time water crisis data and actionable solutions for a water-secure India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2" role="navigation" aria-label="Footer navigation">
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigateToTab', { detail: { tab: 'dashboard' } }));
                }}
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400 text-left"
              >
                Crisis Dashboard
              </button>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigateToTab', { detail: { tab: 'solutions' } }));
                }}
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400 text-left"
              >
                Recovery Solutions
              </button>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigateToTab', { detail: { tab: 'alerts' } }));
                }}
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400 text-left"
              >
                Alert System
              </button>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('showDataMethodology'));
                }}
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400 text-left"
              >
                Data Methodology
              </button>
            </nav>
          </div>

          {/* Government Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Government Resources</h4>
            <nav className="space-y-2" role="navigation" aria-label="Government resources">
              <a 
                href="https://jalshakti-dowr.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400"
                aria-label="Ministry of Jal Shakti (opens in new tab)"
              >
                <span>Ministry of Jal Shakti</span>
                <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
              </a>
              <a 
                href="https://cwc.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400"
                aria-label="Central Water Commission (opens in new tab)"
              >
                <span>Central Water Commission</span>
                <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
              </a>
              <a 
                href="https://cgwb.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400"
                aria-label="Central Ground Water Board (opens in new tab)"
              >
                <span>Ground Water Board</span>
                <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
              </a>
              <a 
                href="https://indiawris.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400"
                aria-label="India Water Resources Information System (opens in new tab)"
              >
                <span>India WRIS</span>
                <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
              </a>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Emergency Contacts</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-medium">Crisis Helpline</p>
                  <p className="text-sm text-gray-300">1800-WATER-HELP (24/7)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-medium">Emergency Email</p>
                  <p className="text-sm text-gray-300">crisis@aquawatch.gov.in</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="font-medium">National Water Crisis Center</p>
                  <p className="text-sm text-gray-300">New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <p>&copy; 2025 AquaWatch India. All rights reserved.</p>
              <span aria-hidden="true">|</span>
              <a href="#privacy" className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400">
                Privacy Policy
              </a>
              <span aria-hidden="true">|</span>
              <a href="#terms" className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:text-blue-400">
                Terms of Service
              </a>
            </div>
            <div className="text-sm text-gray-400">
              <p>Data updated every 6 hours | Last update: 2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};