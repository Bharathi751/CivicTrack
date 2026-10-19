import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage, initLocalStorage } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initLocalStorage();
    const storedUsers = Storage.getUsers();
    const storedAuth = Storage.getCurrentUser();
    setUsers(storedUsers);
    setCurrentUser(storedAuth);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const allUsers = Storage.getUsers();
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Invalid email or password. Try a demo account or register.');
    }
    setCurrentUser(found);
    Storage.setCurrentUser(found);
    return found;
  };

  const register = ({ name, email, password, role = 'citizen', phone = '', address = '' }) => {
    const allUsers = Storage.getUsers();
    if (allUsers.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      user_id: Date.now(),
      name,
      email: email.trim(),
      password,
      role,
      phone,
      address,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      created_at: new Date().toISOString()
    };
    const updated = [newUser, ...allUsers];
    setUsers(updated);
    Storage.setUsers(updated);
    setCurrentUser(newUser);
    Storage.setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    Storage.setCurrentUser(null);
  };

  // Switch to one of the demo role profiles instantly
  const switchRole = (targetRole) => {
    const allUsers = Storage.getUsers();
    const user = allUsers.find((u) => u.role === targetRole) || allUsers[0];
    setCurrentUser(user);
    Storage.setCurrentUser(user);
  };

  const switchUserById = (userId) => {
    const allUsers = Storage.getUsers();
    const user = allUsers.find((u) => u.user_id === Number(userId));
    if (user) {
      setCurrentUser(user);
      Storage.setCurrentUser(user);
    }
  };

  const staffMembers = users.filter((u) => u.role === 'staff');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        staffMembers,
        login,
        register,
        logout,
        switchRole,
        switchUserById,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
