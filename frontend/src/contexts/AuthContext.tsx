import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

interface UserData {
  uid: string;
  email: string;
  state: string;
  role: "user" | "admin";
  createdAt: Date;
  lastLogin?: Date;
  isActive?: boolean;
}

interface AdminData {
  id: string;
  password: string;
  role: "admin";
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | AdminData | null;
  loading: boolean;
  signup: (email: string, password: string, state: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (id: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Predefined admin credentials
const ADMIN_CREDENTIALS = {
  admin001: "AquaWatch@2025",
  admin002: "WaterCrisis@Admin",
  admin003: "AquaAdmin@123",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, state: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save user data to Firestore in 'users' collection
      const userDoc = {
        uid: user.uid,
        email: user.email!,
        state: state,
        role: "user" as const,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
      };

      // Save to users collection
      await setDoc(doc(db, "users", user.uid), userDoc);

      // Also save user info to the state-specific document in DWLR_state collection
      try {
        const stateDocRef = doc(db, "DWLR_state", state);
        const stateDoc = await getDoc(stateDocRef);

        if (stateDoc.exists()) {
          // If state document exists, add user to users array
          const stateData = stateDoc.data();
          const existingUsers = stateData.users || [];

          const newUser = {
            uid: user.uid,
            email: user.email!,
            joinedAt: new Date(),
            isActive: true,
          };

          await setDoc(
            stateDocRef,
            {
              ...stateData,
              users: [...existingUsers, newUser],
              totalUsers: (stateData.totalUsers || 0) + 1,
              lastUserActivity: new Date(),
            },
            { merge: true }
          );
        } else {
          // Create new state document if it doesn't exist
          await setDoc(stateDocRef, {
            state: state,
            users: [
              {
                uid: user.uid,
                email: user.email!,
                joinedAt: new Date(),
                isActive: true,
              },
            ],
            totalUsers: 1,
            lastUserActivity: new Date(),
            waterLevel: 50, // Default water level
            status: "normal",
            lastUpdated: new Date(),
          });
        }
      } catch (stateError) {
        console.error("Error updating state document:", stateError);
        // Don't throw error here as user creation was successful
      }

      setUserData(userDoc);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Get user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as UserData;

        // Update last login time
        const updatedUserData = {
          ...userData,
          lastLogin: new Date(),
          isActive: true,
        };

        // Update user document with last login
        await setDoc(userDocRef, updatedUserData, { merge: true });

        // Update user activity in state document
        try {
          const stateDocRef = doc(db, "DWLR_state", userData.state);
          const stateDoc = await getDoc(stateDocRef);

          if (stateDoc.exists()) {
            const stateData = stateDoc.data();
            const users = stateData.users || [];

            // Update user's last activity in the state's users array
            const updatedUsers = users.map((stateUser: any) =>
              stateUser.uid === user.uid
                ? { ...stateUser, lastActivity: new Date(), isActive: true }
                : stateUser
            );

            await setDoc(
              stateDocRef,
              {
                ...stateData,
                users: updatedUsers,
                lastUserActivity: new Date(),
              },
              { merge: true }
            );
          }
        } catch (stateError) {
          console.error("Error updating state user activity:", stateError);
        }

        setUserData(updatedUserData);
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const adminLogin = async (id: string, password: string) => {
    try {
      if (
        ADMIN_CREDENTIALS[id as keyof typeof ADMIN_CREDENTIALS] === password
      ) {
        // Create a mock admin user object
        const adminData: AdminData = {
          id,
          password: "", // Don't store password
          role: "admin",
        };
        setUserData(adminData);

        // Set a mock current user for admin
        setCurrentUser({
          uid: `admin_${id}`,
          email: `${id}@aquawatch.admin`,
          emailVerified: true,
        } as User);
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      throw error;
    }
  };

  const demoLogin = async () => {
    try {
      setLoading(true);
      console.log("Demo login started...");

      // Create a demo user data
      const demoUserData: UserData = {
        uid: "demo_user_123",
        email: "demo@aquawatch.com",
        state: "Maharashtra",
        role: "user",
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
      };

      console.log("Setting demo user data:", demoUserData);
      setUserData(demoUserData);

      // Set a mock current user for demo
      const mockUser = {
        uid: "demo_user_123",
        email: "demo@aquawatch.com",
        emailVerified: true,
      } as User;

      console.log("Setting mock current user:", mockUser);
      setCurrentUser(mockUser);

      // Also store in Firestore for consistency (optional)
      try {
        const userDoc = doc(db, "users", "demo_user_123");
        await setDoc(userDoc, demoUserData);

        // Update the DWLR_state collection for Maharashtra
        const stateDoc = doc(db, "DWLR_state", "Maharashtra");
        await setDoc(
          stateDoc,
          {
            state: "Maharashtra",
            totalUsers: 1,
            activeUsers: 1,
            lastUserActivity: new Date(),
            usersList: ["demo_user_123"],
          },
          { merge: true }
        );
      } catch (firestoreError) {
        console.warn("Demo user Firestore storage failed:", firestoreError);
        // Continue anyway since demo mode doesn't require persistent storage
      }

      console.log("Demo login completed successfully");
      setLoading(false);
    } catch (error) {
      console.error("Demo login error:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (userData?.role === "admin") {
        // Admin logout - just clear state
        setCurrentUser(null);
        setUserData(null);
      } else {
        // User logout - Firebase signOut
        await signOut(auth);
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Skip Firebase auth state changes for demo users and admins
      if (
        userData?.role === "admin" ||
        (userData && "uid" in userData && userData.uid === "demo_user_123")
      ) {
        console.log("Skipping Firebase auth for demo/admin user");
        return;
      }

      if (user) {
        setCurrentUser(user);

        // Get user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        }
      } else {
        // Only clear data if it's not a demo user
        if (!userData || userData.uid !== "demo_user_123") {
          setCurrentUser(null);
          setUserData(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []); // Remove dependency on userData.role to prevent loops

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    adminLogin,
    demoLogin,
    logout,
    isAdmin: userData?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
