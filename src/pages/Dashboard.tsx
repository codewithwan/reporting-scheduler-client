import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api';
import { UserData } from '../models/UserData'; // Import UserData model

// Component: Dashboard
const Dashboard = () => {
  // State Hooks
  const [userData, setUserData] = useState<UserData | null>(null);

  // Effects
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchUserProfile();
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="pt-16">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome to the Dashboard</h1>
          {userData ? (
            <div className="mb-8">
              <p><strong>ID:</strong> {userData.id}</p>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
              <p><strong>Timezone:</strong> {userData.timezone}</p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
