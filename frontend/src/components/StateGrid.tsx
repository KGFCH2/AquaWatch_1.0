import React, { useState } from 'react';
import { MapPin, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface StateData {
  name: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  waterLevel: number;
  population: string;
  mainIssues: string[];
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

const statesData: StateData[] = [
  {
    name: 'Tamil Nadu',
    severity: 'critical',
    waterLevel: 25,
    population: '72M',
    mainIssues: ['Groundwater depletion', 'Drought conditions', 'Industrial pollution'],
    trend: 'down',
    lastUpdated: '2 hours ago'
  },
  {
    name: 'Karnataka',
    severity: 'critical',
    waterLevel: 28,
    population: '65M',
    mainIssues: ['River disputes', 'Groundwater over-extraction', 'Urban water crisis'],
    trend: 'down',
    lastUpdated: '1 hour ago'
  },
  {
    name: 'Maharashtra',
    severity: 'high',
    waterLevel: 35,
    population: '123M',
    mainIssues: ['Drought in Marathwada', 'Industrial contamination', 'Unequal distribution'],
    trend: 'stable',
    lastUpdated: '3 hours ago'
  },
  {
    name: 'Rajasthan',
    severity: 'high',
    waterLevel: 32,
    population: '78M',
    mainIssues: ['Desert climate', 'Groundwater depletion', 'Salt water intrusion'],
    trend: 'down',
    lastUpdated: '1 hour ago'
  },
  {
    name: 'Gujarat',
    severity: 'moderate',
    waterLevel: 55,
    population: '65M',
    mainIssues: ['Coastal salinity', 'Industrial pollution', 'Seasonal variations'],
    trend: 'up',
    lastUpdated: '2 hours ago'
  },
  {
    name: 'Uttar Pradesh',
    severity: 'high',
    waterLevel: 38,
    population: '238M',
    mainIssues: ['Ganga pollution', 'Groundwater contamination', 'High population density'],
    trend: 'down',
    lastUpdated: '4 hours ago'
  },
  {
    name: 'Kerala',
    severity: 'moderate',
    waterLevel: 65,
    population: '35M',
    mainIssues: ['Seasonal flooding', 'Coastal erosion', 'Pollution of backwaters'],
    trend: 'stable',
    lastUpdated: '2 hours ago'
  },
  {
    name: 'Punjab',
    severity: 'high',
    waterLevel: 40,
    population: '30M',
    mainIssues: ['Agricultural over-extraction', 'Pesticide contamination', 'Water table decline'],
    trend: 'down',
    lastUpdated: '3 hours ago'
  },
  {
    name: 'Haryana',
    severity: 'high',
    waterLevel: 42,
    population: '29M',
    mainIssues: ['Groundwater depletion', 'Agricultural runoff', 'Industrial pollution'],
    trend: 'down',
    lastUpdated: '2 hours ago'
  },
  {
    name: 'Andhra Pradesh',
    severity: 'critical',
    waterLevel: 30,
    population: '53M',
    mainIssues: ['Drought conditions', 'River water disputes', 'Coastal salinity'],
    trend: 'down',
    lastUpdated: '1 hour ago'
  },
  {
    name: 'Telangana',
    severity: 'high',
    waterLevel: 38,
    population: '39M',
    mainIssues: ['Groundwater over-extraction', 'Industrial contamination', 'Urban water stress'],
    trend: 'stable',
    lastUpdated: '4 hours ago'
  },
  {
    name: 'Odisha',
    severity: 'moderate',
    waterLevel: 58,
    population: '45M',
    mainIssues: ['Cyclone damage', 'Coastal erosion', 'Seasonal flooding'],
    trend: 'stable',
    lastUpdated: '3 hours ago'
  },
  {
    name: 'West Bengal',
    severity: 'moderate',
    waterLevel: 52,
    population: '99M',
    mainIssues: ['Arsenic contamination', 'River pollution', 'Coastal salinity'],
    trend: 'up',
    lastUpdated: '2 hours ago'
  },
  {
    name: 'Bihar',
    severity: 'high',
    waterLevel: 35,
    population: '128M',
    mainIssues: ['Flood-drought cycle', 'Groundwater contamination', 'High population density'],
    trend: 'down',
    lastUpdated: '5 hours ago'
  },
  {
    name: 'Jharkhand',
    severity: 'high',
    waterLevel: 36,
    population: '38M',
    mainIssues: ['Mining pollution', 'Deforestation impact', 'Tribal area water access'],
    trend: 'down',
    lastUpdated: '4 hours ago'
  },
  {
    name: 'Chhattisgarh',
    severity: 'moderate',
    waterLevel: 48,
    population: '29M',
    mainIssues: ['Mining activities', 'Forest degradation', 'Industrial pollution'],
    trend: 'stable',
    lastUpdated: '3 hours ago'
  },
  {
    name: 'Madhya Pradesh',
    severity: 'high',
    waterLevel: 41,
    population: '85M',
    mainIssues: ['Drought prone regions', 'Groundwater depletion', 'Agricultural stress'],
    trend: 'down',
    lastUpdated: '2 hours ago'
  },
  {
    name: 'Assam',
    severity: 'moderate',
    waterLevel: 62,
    population: '35M',
    mainIssues: ['Flood management', 'River erosion', 'Tea garden pollution'],
    trend: 'stable',
    lastUpdated: '6 hours ago'
  },
  {
    name: 'Himachal Pradesh',
    severity: 'low',
    waterLevel: 75,
    population: '7M',
    mainIssues: ['Glacier melting', 'Tourism pressure', 'Seasonal variations'],
    trend: 'up',
    lastUpdated: '4 hours ago'
  },
  {
    name: 'Uttarakhand',
    severity: 'moderate',
    waterLevel: 68,
    population: '11M',
    mainIssues: ['Glacier retreat', 'Deforestation', 'Tourism impact'],
    trend: 'stable',
    lastUpdated: '3 hours ago'
  },
  {
    name: 'Jammu and Kashmir',
    severity: 'moderate',
    waterLevel: 72,
    population: '13M',
    mainIssues: ['Seasonal variations', 'Infrastructure damage', 'Cross-border issues'],
    trend: 'stable',
    lastUpdated: '5 hours ago'
  },
  {
    name: 'Goa',
    severity: 'moderate',
    waterLevel: 58,
    population: '1.5M',
    mainIssues: ['Coastal salinity', 'Mining pollution', 'Tourism pressure'],
    trend: 'down',
    lastUpdated: '2 hours ago'
  },
  {
    name: 'Manipur',
    severity: 'moderate',
    waterLevel: 55,
    population: '3M',
    mainIssues: ['Seasonal flooding', 'Deforestation', 'Limited infrastructure'],
    trend: 'stable',
    lastUpdated: '6 hours ago'
  },
  {
    name: 'Meghalaya',
    severity: 'low',
    waterLevel: 78,
    population: '3M',
    mainIssues: ['Coal mining pollution', 'Acid rain', 'Forest degradation'],
    trend: 'up',
    lastUpdated: '4 hours ago'
  },
  {
    name: 'Tripura',
    severity: 'moderate',
    waterLevel: 52,
    population: '4M',
    mainIssues: ['Seasonal variations', 'Limited storage', 'Cross-border pollution'],
    trend: 'stable',
    lastUpdated: '5 hours ago'
  },
  {
    name: 'Mizoram',
    severity: 'moderate',
    waterLevel: 60,
    population: '1M',
    mainIssues: ['Hilly terrain challenges', 'Limited infrastructure', 'Seasonal scarcity'],
    trend: 'stable',
    lastUpdated: '7 hours ago'
  },
  {
    name: 'Arunachal Pradesh',
    severity: 'low',
    waterLevel: 82,
    population: '1.4M',
    mainIssues: ['Remote accessibility', 'Infrastructure gaps', 'Seasonal variations'],
    trend: 'up',
    lastUpdated: '8 hours ago'
  },
  {
    name: 'Nagaland',
    severity: 'moderate',
    waterLevel: 56,
    population: '2M',
    mainIssues: ['Hilly terrain', 'Limited storage capacity', 'Seasonal dependency'],
    trend: 'stable',
    lastUpdated: '6 hours ago'
  },
  {
    name: 'Sikkim',
    severity: 'low',
    waterLevel: 85,
    population: '0.6M',
    mainIssues: ['Glacier dependency', 'Landslide risks', 'Limited infrastructure'],
    trend: 'up',
    lastUpdated: '5 hours ago'
  },
  // Union Territories
  {
    name: 'Delhi',
    severity: 'critical',
    waterLevel: 22,
    population: '32M',
    mainIssues: ['Yamuna pollution', 'Groundwater depletion', 'High population density'],
    trend: 'down',
    lastUpdated: '1 hour ago'
  },
  {
    name: 'Puducherry',
    severity: 'high',
    waterLevel: 38,
    population: '1.2M',
    mainIssues: ['Coastal salinity', 'Limited freshwater sources', 'Cyclone damage'],
    trend: 'down',
    lastUpdated: '3 hours ago'
  },
  {
    name: 'Chandigarh',
    severity: 'moderate',
    waterLevel: 48,
    population: '1.1M',
    mainIssues: ['Dependency on neighboring states', 'Groundwater depletion', 'Urban stress'],
    trend: 'stable',
    lastUpdated: '2 hours ago'
  },
  {
    name: 'Andaman and Nicobar Islands',
    severity: 'moderate',
    waterLevel: 62,
    population: '0.4M',
    mainIssues: ['Island water security', 'Saltwater intrusion', 'Limited storage'],
    trend: 'stable',
    lastUpdated: '12 hours ago'
  },
  {
    name: 'Lakshadweep',
    severity: 'high',
    waterLevel: 35,
    population: '0.06M',
    mainIssues: ['Coral island challenges', 'Saltwater intrusion', 'Climate change impact'],
    trend: 'down',
    lastUpdated: '10 hours ago'
  },
  {
    name: 'Dadra and Nagar Haveli',
    severity: 'moderate',
    waterLevel: 45,
    population: '0.4M',
    mainIssues: ['Industrial pollution', 'Coastal salinity', 'Limited freshwater'],
    trend: 'stable',
    lastUpdated: '4 hours ago'
  },
  {
    name: 'Daman and Diu',
    severity: 'moderate',
    waterLevel: 58,
    population: '0.22M',
    mainIssues: ['High altitude challenges', 'Glacier dependency', 'Extreme weather'],
    trend: 'stable',
    lastUpdated: '8 hours ago'
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-600" aria-label="Water levels improving" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-red-600" aria-label="Water levels declining" />;
    case 'stable': return <Minus className="h-4 w-4 text-gray-600" aria-label="Water levels stable" />;
    default: return null;
  }
};

export const StateGrid: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  return (
    <section aria-labelledby="states-title">
      <div className="mb-6">
        <h2 id="states-title" className="text-2xl font-bold text-gray-900 mb-2">
          State-wise Water Crisis Status
        </h2>
        <p className="text-gray-600">
          Click on any state to view detailed information and recommended solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statesData.map((state, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setSelectedState(state)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedState(state);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${state.name}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" aria-hidden="true" />
                <h3 className="font-semibold text-gray-900">{state.name}</h3>
              </div>
              {getTrendIcon(state.trend)}
            </div>

            <div className="mb-4">
              <span 
                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(state.severity)}`}
              >
                {state.severity.charAt(0).toUpperCase() + state.severity.slice(1)} Risk
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Water Availability</span>
                  <span className="font-medium">{state.waterLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      state.waterLevel < 30 ? 'bg-red-500' :
                      state.waterLevel < 50 ? 'bg-orange-500' :
                      state.waterLevel < 70 ? 'bg-amber-300' : 'bg-green-500'
                    }`}
                    style={{ width: `${state.waterLevel}%` }}
                    role="progressbar"
                    aria-valuenow={state.waterLevel}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Water availability: ${state.waterLevel}%`}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Population:</span> {state.population}</p>
                <p><span className="font-medium">Updated:</span> {state.lastUpdated}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* State Detail Modal */}
      {selectedState && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedState(null)}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 id="modal-title" className="text-2xl font-bold text-gray-900">
                  {selectedState.name} - Crisis Details
                </h3>
                <button
                  onClick={() => setSelectedState(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Water Availability</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedState.waterLevel}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Population Affected</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedState.population}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Main Issues</h4>
                  <ul className="space-y-2">
                    {selectedState.mainIssues.map((issue, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <button 
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => {
                      setSelectedState(null);
                      // Navigate to solutions tab with state filter
                      window.dispatchEvent(new CustomEvent('navigateToSolutions', { 
                        detail: { state: selectedState.name } 
                      }));
                    }}
                  >
                    View Solutions
                  </button>
                  <button 
                    className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={() => {
                      setSelectedState(null);
                      // Show emergency contacts modal
                      window.dispatchEvent(new CustomEvent('showEmergencyContacts', { 
                        detail: { state: selectedState.name } 
                      }));
                    }}
                  >
                    Emergency Contacts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};