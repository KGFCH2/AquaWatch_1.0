import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  Droplets,
  Recycle,
  Zap,
  Users,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface Solution {
  id: string;
  title: string;
  description: string;
  category: "immediate" | "short-term" | "long-term";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  impact: string;
  cost: string;
  timeline: string;
  steps: string[];
  examples: string[];
}

const solutions: Solution[] = [
  {
    id: "rainwater-harvesting",
    title: "Rainwater Harvesting Systems",
    description:
      "Implement rooftop and community-level rainwater collection and storage systems",
    category: "immediate",
    icon: Droplets,
    impact: "High",
    cost: "₹10,000 - ₹50,000 per household",
    timeline: "1-3 months",
    steps: [
      "Assess roof area and annual rainfall",
      "Install gutters and downspouts",
      "Set up filtration system",
      "Install storage tanks",
      "Connect to household water supply",
    ],
    examples: [
      "Chennai successfully increased groundwater levels by 50% through citywide rainwater harvesting",
      "Rajasthan villages using traditional tankas for water security",
    ],
  },
  {
    id: "water-recycling",
    title: "Greywater Recycling",
    description:
      "Treat and reuse household wastewater for irrigation and non-potable uses",
    category: "short-term",
    icon: Recycle,
    impact: "Medium",
    cost: "₹25,000 - ₹1,00,000",
    timeline: "2-6 months",
    steps: [
      "Install greywater collection system",
      "Set up biological treatment unit",
      "Install distribution network",
      "Regular maintenance schedule",
      "Monitor water quality",
    ],
    examples: [
      "Auroville community treating 80% of wastewater for reuse",
      "Bengaluru apartments saving 40% water through greywater recycling",
    ],
  },
  {
    id: "desalination",
    title: "Solar-Powered Desalination",
    description: "Convert seawater to freshwater using renewable solar energy",
    category: "long-term",
    icon: Zap,
    impact: "Very High",
    cost: "₹50 lakhs - ₹10 crores",
    timeline: "1-3 years",
    steps: [
      "Site assessment and feasibility study",
      "Install solar panel arrays",
      "Set up reverse osmosis system",
      "Build distribution infrastructure",
      "Train local operators",
    ],
    examples: [
      "Tamil Nadu operating 50+ desalination plants",
      "Gujarat coastal areas using solar desalination for agriculture",
    ],
  },
  {
    id: "community-management",
    title: "Community Water Management",
    description:
      "Establish local water user associations for sustainable resource management",
    category: "immediate",
    icon: Users,
    impact: "High",
    cost: "₹1,000 - ₹10,000",
    timeline: "1-2 months",
    steps: [
      "Form water user committee",
      "Conduct water audit",
      "Develop usage guidelines",
      "Implement monitoring system",
      "Regular community meetings",
    ],
    examples: [
      "Hiware Bazar village achieving water self-sufficiency through community participation",
      "Rajasthan water cooperatives managing groundwater sustainably",
    ],
  },
  {
    id: "drip-irrigation",
    title: "Efficient Irrigation Systems",
    description:
      "Replace flood irrigation with drip and sprinkler systems to reduce water waste",
    category: "short-term",
    icon: Droplets,
    impact: "High",
    cost: "₹20,000 - ₹2,00,000 per hectare",
    timeline: "3-6 months",
    steps: [
      "Field survey and crop assessment",
      "Design irrigation layout",
      "Install drip/sprinkler system",
      "Train farmers on operation",
      "Monitor water savings",
    ],
    examples: [
      "Maharashtra farmers reducing water usage by 60% with drip irrigation",
      "Punjab shifting from flood to precision irrigation",
    ],
  },
  {
    id: "groundwater-recharge",
    title: "Artificial Groundwater Recharge",
    description:
      "Enhance natural groundwater replenishment through artificial recharge structures",
    category: "long-term",
    icon: Lightbulb,
    impact: "Very High",
    cost: "₹5 lakhs - ₹50 lakhs",
    timeline: "6 months - 2 years",
    steps: [
      "Hydrogeological survey",
      "Identify recharge sites",
      "Construct recharge structures",
      "Establish monitoring network",
      "Regular maintenance",
    ],
    examples: [
      "Gujarat constructing 1 lakh recharge structures",
      "Karnataka check dams raising groundwater levels",
    ],
  },
];

const categories = [
  { id: "all", label: "All Solutions" },
  { id: "immediate", label: "Immediate (1-3 months)" },
  { id: "short-term", label: "Short-term (3-12 months)" },
  { id: "long-term", label: "Long-term (1+ years)" },
];

export const Solutions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredSolutions =
    selectedCategory === "all"
      ? solutions
      : solutions.filter((solution) => solution.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "immediate":
        return "bg-green-100 text-green-800 border-green-200";
      case "short-term":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "long-term":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section aria-labelledby="solutions-title">
      {/* Back Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="mb-8">
        <h2
          id="solutions-title"
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Water Crisis Recovery Solutions
        </h2>
        <p className="text-gray-600 max-w-4xl">
          Comprehensive solutions for addressing India's water crisis at
          individual, community, and state levels. Each solution includes
          implementation steps, cost estimates, and real-world examples.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              aria-label={`Filter by ${category.label}`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredSolutions.map((solution) => {
          const Icon = solution.icon;
          const isExpanded = expandedSolution === solution.id;

          return (
            <div
              key={solution.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Icon
                        className="h-6 w-6 text-blue-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {solution.title}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                          solution.category
                        )} mt-1`}
                      >
                        {solution.category.charAt(0).toUpperCase() +
                          solution.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{solution.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Impact</p>
                    <p className="font-semibold text-gray-900">
                      {solution.impact}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Timeline</p>
                    <p className="font-semibold text-gray-900">
                      {solution.timeline}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cost Range</p>
                    <p className="font-semibold text-gray-900">
                      {solution.cost}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setExpandedSolution(isExpanded ? null : solution.id)
                  }
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-expanded={isExpanded}
                  aria-label={`${
                    isExpanded ? "Collapse" : "Expand"
                  } details for ${solution.title}`}
                >
                  <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                  <ArrowRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Implementation Steps
                      </h4>
                      <ol className="space-y-2">
                        {solution.steps.map((step, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Success Examples
                      </h4>
                      <ul className="space-y-2">
                        {solution.examples.map((example, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Emergency Helpline */}
      <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-red-800 mb-4">
          Need Immediate Help?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-red-700 mb-2">
              <strong>National Water Crisis Helpline:</strong>
            </p>
            <p className="text-2xl font-bold text-red-800">1800-11-WATER</p>
          </div>
          <div>
            <p className="text-red-700 mb-2">
              <strong>Emergency Services:</strong>
            </p>
            <p className="text-lg font-semibold text-red-800">Available 24/7</p>
          </div>
        </div>
      </div>
    </section>
  );
};
