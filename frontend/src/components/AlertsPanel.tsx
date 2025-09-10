import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, MapPin } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  isRead: boolean;
  action?: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Severe Water Shortage in Chennai',
    description: 'Day Zero approaching - only 15% water reserves remaining in city reservoirs',
    location: 'Chennai, Tamil Nadu',
    timestamp: '2 hours ago',
    isRead: false,
    action: 'Emergency water supply activated'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Groundwater Depletion Alert',
    description: 'Water table dropped 2 meters below critical level in Marathwada region',
    location: 'Marathwada, Maharashtra',
    timestamp: '4 hours ago',
    isRead: false,
    action: 'Restrict agricultural usage'
  },
  {
    id: '3',
    type: 'critical',
    title: 'Industrial Pollution Contamination',
    description: 'Heavy metal contamination detected in Yamuna river affecting Delhi water supply',
    location: 'Delhi NCR',
    timestamp: '6 hours ago',
    isRead: true,
    action: 'Alternative sources activated'
  },
  {
    id: '4',
    type: 'info',
    title: 'Monsoon Forecast Update',
    description: 'IMD predicts 95% normal rainfall this season - potential relief for water-stressed regions',
    location: 'Pan India',
    timestamp: '8 hours ago',
    isRead: false
  },
  {
    id: '5',
    type: 'success',
    title: 'Successful Groundwater Recharge',
    description: 'Artificial recharge project increased water table by 3 meters in pilot villages',
    location: 'Rajasthan',
    timestamp: '12 hours ago',
    isRead: true
  },
  {
    id: '6',
    type: 'warning',
    title: 'Dam Water Level Critical',
    description: 'Mettur dam water level at 35% - irrigation restrictions may be imposed',
    location: 'Tamil Nadu',
    timestamp: '1 day ago',
    isRead: false,
    action: 'Monitor and restrict usage'
  }
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'critical': return <AlertTriangle className="h-5 w-5" aria-hidden="true" />;
    case 'warning': return <AlertTriangle className="h-5 w-5" aria-hidden="true" />;
    case 'info': return <Info className="h-5 w-5" aria-hidden="true" />;
    case 'success': return <CheckCircle className="h-5 w-5" aria-hidden="true" />;
    default: return <Bell className="h-5 w-5" aria-hidden="true" />;
  }
};

const getAlertColor = (type: string) => {
  switch (type) {
    case 'critical': return 'bg-red-50 border-red-200 text-red-800';
    case 'warning': return 'bg-orange-50 border-orange-200 text-orange-800';
    case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'success': return 'bg-green-50 border-green-200 text-green-800';
    default: return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export const AlertsPanel: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [alertsList, setAlertsList] = useState(alerts);

  const filteredAlerts = selectedFilter === 'all' 
    ? alertsList 
    : alertsList.filter(alert => alert.type === selectedFilter);

  const unreadCount = alertsList.filter(alert => !alert.isRead).length;

  const markAsRead = (alertId: string) => {
    setAlertsList(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlertsList(prev => 
      prev.map(alert => ({ ...alert, isRead: true }))
    );
  };

  const filters = [
    { id: 'all', label: 'All Alerts', count: alertsList.length },
    { id: 'critical', label: 'Critical', count: alertsList.filter(a => a.type === 'critical').length },
    { id: 'warning', label: 'Warning', count: alertsList.filter(a => a.type === 'warning').length },
    { id: 'info', label: 'Info', count: alertsList.filter(a => a.type === 'info').length },
    { id: 'success', label: 'Success', count: alertsList.filter(a => a.type === 'success').length }
  ];

  return (
    <section aria-labelledby="alerts-title">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Bell className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <div>
              <h2 id="alerts-title" className="text-3xl font-bold text-gray-900">
                Water Crisis Alerts
              </h2>
              <p className="text-gray-600">
                Real-time notifications about water crisis situations across India
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Mark all ${unreadCount} alerts as read`}
            >
              Mark All Read ({unreadCount})
            </button>
          )}
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
              <span className="text-red-800 font-semibold">Critical</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-2">
              {alerts.filter(a => a.type === 'critical').length}
            </p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" aria-hidden="true" />
              <span className="text-orange-800 font-semibold">Warning</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-2">
              {alerts.filter(a => a.type === 'warning').length}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <span className="text-blue-800 font-semibold">Info</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {alerts.filter(a => a.type === 'info').length}
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
              <span className="text-green-800 font-semibold">Success</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {alerts.filter(a => a.type === 'success').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedFilter === filter.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              aria-label={`Filter by ${filter.label}`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500 text-lg">No alerts found for the selected filter.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-md ${
                getAlertColor(alert.type)
              } ${!alert.isRead ? 'ring-2 ring-blue-200' : ''}`}
              role="article"
              aria-labelledby={`alert-${alert.id}-title`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 id={`alert-${alert.id}-title`} className="text-lg font-semibold">
                        {alert.title}
                      </h3>
                      {!alert.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full" aria-label="Unread alert"></span>
                      )}
                    </div>
                    
                    <p className="text-sm mb-3">{alert.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs opacity-75">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                    
                    {alert.action && (
                      <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                        <p className="text-sm font-medium">Action Taken: {alert.action}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {!alert.isRead && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="ml-4 text-xs bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Mark alert "${alert.title}" as read`}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emergency Contact */}
      <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          <h3 className="text-xl font-semibold text-red-800">Emergency Response</h3>
        </div>
        <p className="text-red-700 mb-4">
          For immediate assistance during water crisis emergencies, contact our 24/7 helpline.
        </p>
        <div className="flex items-center space-x-6">
          <div>
            <p className="text-red-600 font-medium">Crisis Helpline</p>
            <p className="text-2xl font-bold text-red-800">1800-WATER-HELP</p>
          </div>
          <div>
            <p className="text-red-600 font-medium">WhatsApp Support</p>
            <p className="text-lg font-semibold text-red-800">+91 9876543210</p>
          </div>
        </div>
      </div>
    </section>
  );
};