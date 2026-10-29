import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage, initLocalStorage } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);

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
    const cleanEmail = email.trim().toLowerCase();
    const found = allUsers.find((u) => {
      const matchEmail = u.email.toLowerCase() === cleanEmail;
      const matchAlias =
        ((cleanEmail === 'admin@admin.com' || cleanEmail === 'admin@civic.org') && u.role === 'admin') ||
        ((cleanEmail === 'citizen@civic.org' || cleanEmail === 'user@civic.org') && u.role === 'citizen') ||
        ((cleanEmail === 'vendor@civic.org' || cleanEmail === 'staff@civic.org') && u.role === 'staff');
      return (matchEmail || matchAlias) && u.password === password;
    });

    if (!found) {
      throw new Error('Invalid email or password. Please verify your credentials.');
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

  const addVendorStaff = ({
    name,
    email,
    password = 'vendor123',
    department = 'General Maintenance',
    phone = '',
    contractorCode = '',
    ward = ''
  }) => {
    const allUsers = Storage.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    if (allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const deptPrefix = department ? department.substring(0, 2).toUpperCase() : 'GN';
    const code =
      contractorCode.trim() ||
      `VND-${deptPrefix}-${Math.floor(100 + Math.random() * 900)}`;

    const newVendor = {
      user_id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password || 'vendor123',
      role: 'staff',
      department: department.trim(),
      contractorCode: code,
      phone: phone.trim(),
      ward: ward.trim(),
      avatar: `https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80`,
      created_at: new Date().toISOString()
    };

    const updated = [...allUsers, newVendor];
    setUsers(updated);
    Storage.setUsers(updated);
    return newVendor;
  };

  const updateVendorStaff = (userId, updatedData) => {
    const allUsers = Storage.getUsers();
    const updated = allUsers.map((u) => {
      if (u.user_id === Number(userId)) {
        return { ...u, ...updatedData };
      }
      return u;
    });
    setUsers(updated);
    Storage.setUsers(updated);
  };

  const deleteVendorStaff = (userId) => {
    const allUsers = Storage.getUsers();
    const updated = allUsers.filter((u) => u.user_id !== Number(userId));
    setUsers(updated);
    Storage.setUsers(updated);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return null;
    const allUsers = Storage.getUsers();
    const updatedUser = {
      ...currentUser,
      ...updatedFields
    };

    const updatedUsers = allUsers.map((u) => {
      if (u.user_id === currentUser.user_id) {
        return updatedUser;
      }
      return u;
    });

    setUsers(updatedUsers);
    Storage.setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    Storage.setCurrentUser(updatedUser);
    return updatedUser;
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
        addVendorStaff,
        updateVendorStaff,
        deleteVendorStaff,
        updateProfile,
        profileModalOpen,
        openProfileModal,
        closeProfileModal,
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
