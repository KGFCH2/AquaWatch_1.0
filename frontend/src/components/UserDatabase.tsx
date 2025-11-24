import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";
import { Users, MapPin, Activity, Eye, EyeOff } from "lucide-react";

interface UserInfo {
  uid: string;
  email: string;
  state: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive?: boolean;
}

interface StateInfo {
  state: string;
  users: Array<{
    uid: string;
    email: string;
    joinedAt: Date;
    isActive: boolean;
    lastActivity?: Date;
  }>;
  totalUsers: number;
  lastUserActivity?: Date;
  waterLevel?: number;
  status?: string;
}

export const UserDatabase: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [states, setStates] = useState<StateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"users" | "states">("users");
  const [showDetails, setShowDetails] = useState(false);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList: UserInfo[] = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        usersList.push({
          uid: userData.uid,
          email: userData.email,
          state: userData.state,
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLogin: userData.lastLogin?.toDate(),
          isActive: userData.isActive || false,
        });
      });

      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const statesCollection = collection(db, "DWLR_state");
      const statesSnapshot = await getDocs(statesCollection);
      const statesList: StateInfo[] = [];

      statesSnapshot.forEach((doc) => {
        const stateData = doc.data();
        if (stateData.users && stateData.users.length > 0) {
          statesList.push({
            state: doc.id,
            users: stateData.users.map((user: any) => ({
              ...user,
              joinedAt: user.joinedAt?.toDate() || new Date(),
              lastActivity: user.lastActivity?.toDate(),
            })),
            totalUsers: stateData.totalUsers || 0,
            lastUserActivity: stateData.lastUserActivity?.toDate(),
            waterLevel: stateData.waterLevel,
            status: stateData.status,
          });
        }
      });

      setStates(statesList);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      Promise.all([fetchUsers(), fetchStates()]).finally(() => {
        setLoading(false);
      });
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            Access denied. Admin privileges required.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          User Database Management
        </h1>
        <p className="text-gray-600 dark:text-slate-300">
          View and manage user registrations and state-wise data
        </p>
      </div>

      {/* View Toggle */}
      <div className="mb-6 flex space-x-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setView("users")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            view === "users"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>All Users ({users.length})</span>
        </button>
        <button
          onClick={() => setView("states")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            view === "states"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>States ({states.length})</span>
        </button>
      </div>

      {/* Details Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
        >
          {showDetails ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span>{showDetails ? "Hide" : "Show"} Details</span>
        </button>
      </div>

      {view === "users" ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Registered Users
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Registered
                  </th>
                  {showDetails && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {users.map((user, index) => (
                  <tr
                    key={user.uid}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50 dark:bg-slate-900"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                      {user.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    {showDetails && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                          {user.lastLogin?.toLocaleDateString() || "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => (
            <div
              key={state.state}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {state.state}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Total Users:
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {state.totalUsers}
                  </span>
                </div>
                {state.waterLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-slate-400">
                      Water Level:
                    </span>
                    <span className="font-semibold">{state.waterLevel}%</span>
                  </div>
                )}
                {state.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-slate-400">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        state.status === "critical"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : state.status === "warning"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {state.status}
                    </span>
                  </div>
                )}
                {showDetails && state.lastUserActivity && (
                  <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-slate-400">
                      <Activity className="h-4 w-4" />
                      <span>
                        Last activity:{" "}
                        {state.lastUserActivity.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
