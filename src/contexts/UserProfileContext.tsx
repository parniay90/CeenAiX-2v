import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  emirates_id: string;
  address: string;
  emirate: string;
  blood_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  avatar_url: string;
}

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateAvatar: (url: string) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  full_name: "Parnia Yazdkhasti",
  email: "parnia@aryaix.com",
  phone: "+971 5X XXX XXXX",
  date_of_birth: "",
  gender: "Female",
  emirates_id: "784-XXXX-XXXXXXX-X",
  address: "",
  emirate: "Dubai",
  blood_type: "A+",
  emergency_contact_name: "Pedram Vaziri",
  emergency_contact_phone: "+971 5X XXX XXXX",
  avatar_url: ""
};

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const updateAvatar = (url: string) => {
    setProfile(prev => ({ ...prev, avatar_url: url }));
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, updateAvatar }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
}
