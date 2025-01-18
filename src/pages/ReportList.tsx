import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api';
import { UserData } from '../models/UserData';

const ReportList = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

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
        <h1 className="text-4xl font-bold">Report List</h1>
      </div>
    </div>
  );
};

export default ReportList;
