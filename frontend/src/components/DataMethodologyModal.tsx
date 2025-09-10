import React from 'react';
import { X, Database, Satellite, BarChart3, Shield, Clock, Users } from 'lucide-react';

interface DataMethodologyModalProps {
  onClose: () => void;
}

export const DataMethodologyModal: React.FC<DataMethodologyModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-labelledby="methodology-modal-title"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <h2 id="methodology-modal-title" className="text-2xl font-bold text-gray-900">
                Data Sources & Methodology
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Data Sources */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Satellite className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-blue-800">Primary Data Sources</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Government Agencies</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Central Water Commission (CWC)</li>
                      <li>• Central Ground Water Board (CGWB)</li>
                      <li>• Ministry of Jal Shakti</li>
                      <li>• India Meteorological Department (IMD)</li>
                      <li>• National Remote Sensing Centre (NRSC)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">International Sources</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• NASA GRACE Satellite Data</li>
                      <li>• European Space Agency (ESA)</li>
                      <li>• World Bank Water Data</li>
                      <li>• UN Water Resources Database</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Real-time Monitoring</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Automated Weather Stations</li>
                      <li>• Groundwater Monitoring Wells</li>
                      <li>• River Gauge Stations</li>
                      <li>• Reservoir Level Sensors</li>
                      <li>• Rainfall Measurement Networks</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Community Reports</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Local Government Submissions</li>
                      <li>• NGO Field Reports</li>
                      <li>• Citizen Science Data</li>
                      <li>• Agricultural Department Reports</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Processing */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-green-800">Data Processing & Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-green-900 mb-3">Collection Methods</h4>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Automated data ingestion from 2,500+ monitoring stations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Satellite imagery analysis using AI/ML algorithms</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Manual verification by field experts</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-3">Quality Control</h4>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Multi-source data validation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Outlier detection algorithms</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Expert review and approval process</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-3">Analysis Framework</h4>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Statistical trend analysis</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Predictive modeling using machine learning</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Risk assessment algorithms</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Crisis Classification */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-orange-600" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-orange-800">Crisis Classification System</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-orange-900 mb-3">Severity Levels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-red-800">Critical (0-30%)</p>
                        <p className="text-sm text-red-700">Immediate intervention required</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-orange-800">High (31-50%)</p>
                        <p className="text-sm text-orange-700">Urgent action needed</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-yellow-800">Moderate (51-70%)</p>
                        <p className="text-sm text-yellow-700">Monitoring and planning required</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-green-800">Low (71-100%)</p>
                        <p className="text-sm text-green-700">Stable water availability</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900 mb-3">Assessment Criteria</h4>
                  <ul className="space-y-2 text-orange-800 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Groundwater depletion rate</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Surface water availability</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Population water demand</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Agricultural water stress</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Industrial water consumption</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Water quality indicators</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Update Frequency */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-purple-600" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-purple-800">Data Update Schedule</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" aria-hidden="true" />
                    <p className="font-semibold text-purple-900">Real-time Data</p>
                    <p className="text-sm text-purple-700 mt-1">Every 15 minutes</p>
                    <p className="text-xs text-purple-600 mt-2">Weather, river levels, alerts</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" aria-hidden="true" />
                    <p className="font-semibold text-purple-900">Daily Updates</p>
                    <p className="text-sm text-purple-700 mt-1">Every 6 hours</p>
                    <p className="text-xs text-purple-600 mt-2">State data, crisis levels</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <Satellite className="h-8 w-8 text-purple-600 mx-auto mb-2" aria-hidden="true" />
                    <p className="font-semibold text-purple-900">Satellite Data</p>
                    <p className="text-sm text-purple-700 mt-1">Weekly</p>
                    <p className="text-xs text-purple-600 mt-2">Groundwater, land use</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accuracy & Reliability */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-gray-600" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-800">Accuracy & Reliability</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Data Accuracy</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Water Level Measurements</span>
                      <span className="font-semibold text-green-600">±2% accuracy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Rainfall Data</span>
                      <span className="font-semibold text-green-600">±5% accuracy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Groundwater Levels</span>
                      <span className="font-semibold text-green-600">±3% accuracy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Population Data</span>
                      <span className="font-semibold text-green-600">Census verified</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Quality Assurance</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>24/7 automated monitoring systems</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Expert validation by water resource specialists</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Cross-verification with multiple data sources</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Regular calibration of monitoring equipment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};