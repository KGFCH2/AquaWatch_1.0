import React from 'react';
import { X, Phone, Mail, MapPin, AlertTriangle, Users, Droplets, Truck } from 'lucide-react';

interface EmergencyModalProps {
  type: 'response' | 'contacts';
  state: string;
  onClose: () => void;
}

const emergencyContacts = {
  'Tamil Nadu': {
    state: 'Tamil Nadu',
    contacts: [
      { type: 'Water Board', phone: '044-2450-0000', email: 'tnwb@tn.gov.in' },
      { type: 'Disaster Management', phone: '044-2341-0400', email: 'disaster@tn.gov.in' },
      { type: 'Municipal Corporation', phone: '044-2560-3000', email: 'chennai@tn.gov.in' }
    ]
  },
  'Karnataka': {
    state: 'Karnataka',
    contacts: [
      { type: 'Water Resources', phone: '080-2235-2828', email: 'water@karnataka.gov.in' },
      { type: 'BWSSB', phone: '080-2294-2294', email: 'bwssb@karnataka.gov.in' },
      { type: 'Emergency Services', phone: '080-2222-0000', email: 'emergency@karnataka.gov.in' }
    ]
  },
  'Maharashtra': {
    state: 'Maharashtra',
    contacts: [
      { type: 'Water Supply', phone: '022-2202-6666', email: 'water@maharashtra.gov.in' },
      { type: 'BMC Water Dept', phone: '022-2266-8888', email: 'bmc@mumbai.gov.in' },
      { type: 'Drought Cell', phone: '022-2202-5555', email: 'drought@maharashtra.gov.in' }
    ]
  },
  'Delhi': {
    state: 'Delhi',
    contacts: [
      { type: 'Delhi Jal Board', phone: '011-2436-7000', email: 'djb@delhi.gov.in' },
      { type: 'Water Crisis Cell', phone: '011-2336-3000', email: 'crisis@delhi.gov.in' },
      { type: 'Emergency Services', phone: '011-1916', email: 'emergency@delhi.gov.in' }
    ]
  },
  'Gujarat': {
    state: 'Gujarat',
    contacts: [
      { type: 'Gujarat Water Board', phone: '079-2325-4000', email: 'gwb@gujarat.gov.in' },
      { type: 'Disaster Management', phone: '079-2324-9000', email: 'disaster@gujarat.gov.in' },
      { type: 'Water Supply Dept', phone: '079-2325-6000', email: 'water@gujarat.gov.in' }
    ]
  },
  'Rajasthan': {
    state: 'Rajasthan',
    contacts: [
      { type: 'Rajasthan Water Board', phone: '0141-222-1000', email: 'rwb@rajasthan.gov.in' },
      { type: 'Drought Relief', phone: '0141-222-2000', email: 'drought@rajasthan.gov.in' },
      { type: 'Emergency Water Supply', phone: '0141-222-3000', email: 'emergency@rajasthan.gov.in' }
    ]
  },
  'Punjab': {
    state: 'Punjab',
    contacts: [
      { type: 'Punjab Water Board', phone: '0172-221-4000', email: 'pwb@punjab.gov.in' },
      { type: 'Agricultural Water', phone: '0172-221-5000', email: 'agri@punjab.gov.in' },
      { type: 'Crisis Management', phone: '0172-221-6000', email: 'crisis@punjab.gov.in' }
    ]
  },
  'Uttar Pradesh': {
    state: 'Uttar Pradesh',
    contacts: [
      { type: 'UP Jal Nigam', phone: '0522-228-4000', email: 'upjn@up.gov.in' },
      { type: 'Water Resources', phone: '0522-228-5000', email: 'water@up.gov.in' },
      { type: 'Emergency Response', phone: '0522-228-6000', email: 'emergency@up.gov.in' }
    ]
  },
  'West Bengal': {
    state: 'West Bengal',
    contacts: [
      { type: 'WB Water Board', phone: '033-2214-5000', email: 'wbwb@wb.gov.in' },
      { type: 'Disaster Management', phone: '033-2214-6000', email: 'disaster@wb.gov.in' },
      { type: 'Kolkata Water', phone: '033-2214-7000', email: 'kwb@wb.gov.in' }
    ]
  }
};

const emergencyResponsePlan = {
  immediate: [
    'Activate emergency water supply tankers',
    'Open community water distribution centers',
    'Issue water conservation advisories',
    'Deploy mobile water purification units',
    'Coordinate with NGOs for relief operations'
  ],
  shortTerm: [
    'Implement water rationing schedules',
    'Accelerate groundwater recharge projects',
    'Establish temporary desalination units',
    'Increase inter-state water transfers',
    'Launch public awareness campaigns'
  ],
  longTerm: [
    'Develop drought-resistant infrastructure',
    'Implement comprehensive water management policies',
    'Invest in renewable energy-powered desalination',
    'Create strategic water reserves',
    'Establish early warning systems'
  ]
};

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ type, state, onClose }) => {
  const stateContacts = emergencyContacts[state as keyof typeof emergencyContacts];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-labelledby="emergency-modal-title"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
              <h2 id="emergency-modal-title" className="text-2xl font-bold text-gray-900">
                {type === 'response' ? 'Emergency Response Plan' : `Emergency Contacts - ${state}`}
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

          {type === 'response' ? (
            <div className="space-y-8">
              {/* Immediate Response */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-red-800">Immediate Response (0-24 hours)</h3>
                </div>
                <ul className="space-y-3">
                  {emergencyResponsePlan.immediate.map((action, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-red-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Short-term Response */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Truck className="h-6 w-6 text-orange-600" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-orange-800">Short-term Response (1-4 weeks)</h3>
                </div>
                <ul className="space-y-3">
                  {emergencyResponsePlan.shortTerm.map((action, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-orange-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Long-term Response */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Droplets className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-blue-800">Long-term Recovery (1+ months)</h3>
                </div>
                <ul className="space-y-3">
                  {emergencyResponsePlan.longTerm.map((action, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-blue-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* National Helpline */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">24/7 National Crisis Helpline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-6 w-6 text-green-600" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-gray-900">Emergency Hotline</p>
                      <p className="text-2xl font-bold text-green-600">1800-WATER-911</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-gray-900">Crisis Email</p>
                      <p className="text-lg font-semibold text-blue-600">crisis@aquawatch.gov.in</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {stateContacts ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">
                      {stateContacts.state} Water Crisis Contacts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stateContacts.contacts.map((contact, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-blue-100">
                          <h4 className="font-semibold text-gray-900 mb-3">{contact.type}</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-green-600" aria-hidden="true" />
                              <a 
                                href={`tel:${contact.phone}`}
                                className="text-green-600 hover:text-green-800 font-medium focus:outline-none focus:underline"
                              >
                                {contact.phone}
                              </a>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-blue-600" aria-hidden="true" />
                              <a 
                                href={`mailto:${contact.email}`}
                                className="text-blue-600 hover:text-blue-800 text-sm focus:outline-none focus:underline"
                              >
                                {contact.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-red-800 mb-4">Emergency Water Supply Locations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-red-600 mt-1" aria-hidden="true" />
                        <div>
                          <p className="font-semibold text-red-800">Central Distribution Center</p>
                          <p className="text-red-700 text-sm">Main City Center - 24/7 Operations</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-red-600 mt-1" aria-hidden="true" />
                        <div>
                          <p className="font-semibold text-red-800">Mobile Water Tankers</p>
                          <p className="text-red-700 text-sm">Call helpline for nearest location</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Emergency Contacts for {state}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Specific contact information for {state} is being updated. Please use the national helpline for immediate assistance.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-center space-x-3">
                      <Phone className="h-6 w-6 text-green-600" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-gray-900">National Crisis Helpline</p>
                        <p className="text-2xl font-bold text-green-600">1800-WATER-911</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* National Emergency Contacts */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">National Emergency Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" aria-hidden="true" />
                    <p className="font-semibold text-gray-900">Crisis Hotline</p>
                    <p className="text-lg font-bold text-green-600">1800-WATER-911</p>
                  </div>
                  <div className="text-center">
                    <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" aria-hidden="true" />
                    <p className="font-semibold text-gray-900">Emergency Email</p>
                    <p className="text-sm font-semibold text-blue-600">crisis@aquawatch.gov.in</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" aria-hidden="true" />
                    <p className="font-semibold text-gray-900">WhatsApp Support</p>
                    <p className="text-lg font-bold text-purple-600">+91 9876543210</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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