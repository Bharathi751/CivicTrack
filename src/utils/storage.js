import {
  INITIAL_USERS,
  INITIAL_ISSUES,
  INITIAL_STATUS_HISTORY,
  INITIAL_NOTIFICATIONS
} from '../data/seedData';
import { ISSUE_CATEGORIES } from '../data/categories';

const KEYS = {
  USERS: 'civic_users',
  CURRENT_USER: 'civic_auth_user',
  ISSUES: 'civic_issues',
  HISTORY: 'civic_status_history',
  NOTIFICATIONS: 'civic_notifications',
  CATEGORIES: 'civic_categories',
  DISMISSED_DUPLICATES: 'civic_dismissed_duplicates'
};

function safeGet(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Initialize storage with seeds if empty, or refresh issues if using legacy external images
export function initLocalStorage() {
  if (!localStorage.getItem(KEYS.USERS)) {
    safeSet(KEYS.USERS, INITIAL_USERS);
  }
  
  const storedIssues = safeGet(KEYS.ISSUES, null);
  // Auto-upgrade stored issues if empty or if legacy Unsplash URLs are detected
  if (!storedIssues || (Array.isArray(storedIssues) && storedIssues.some(i => i.images?.[0]?.includes('unsplash')))) {
    safeSet(KEYS.ISSUES, INITIAL_ISSUES);
  }

  if (!localStorage.getItem(KEYS.HISTORY)) {
    safeSet(KEYS.HISTORY, INITIAL_STATUS_HISTORY);
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    safeSet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    safeSet(KEYS.CATEGORIES, ISSUE_CATEGORIES);
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    // Default logged in user is Citizen Arun Kumar for seamless testing
    safeSet(KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
}

export function resetToSeedData() {
  safeSet(KEYS.USERS, INITIAL_USERS);
  safeSet(KEYS.ISSUES, INITIAL_ISSUES);
  safeSet(KEYS.HISTORY, INITIAL_STATUS_HISTORY);
  safeSet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  safeSet(KEYS.CATEGORIES, ISSUE_CATEGORIES);
  safeSet(KEYS.CURRENT_USER, INITIAL_USERS[0]);
  safeSet(KEYS.DISMISSED_DUPLICATES, []);
  window.location.reload();
}

export const Storage = {
  getUsers: () => safeGet(KEYS.USERS, INITIAL_USERS),
  setUsers: (users) => safeSet(KEYS.USERS, users),

  getCurrentUser: () => safeGet(KEYS.CURRENT_USER, INITIAL_USERS[0]),
  setCurrentUser: (user) => safeSet(KEYS.CURRENT_USER, user),

  getIssues: () => safeGet(KEYS.ISSUES, INITIAL_ISSUES),
  setIssues: (issues) => safeSet(KEYS.ISSUES, issues),

  getHistory: () => safeGet(KEYS.HISTORY, INITIAL_STATUS_HISTORY),
  setHistory: (history) => safeSet(KEYS.HISTORY, history),

  getNotifications: () => safeGet(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  setNotifications: (notifs) => safeSet(KEYS.NOTIFICATIONS, notifs),

  getCategories: () => safeGet(KEYS.CATEGORIES, ISSUE_CATEGORIES),
  setCategories: (cats) => safeSet(KEYS.CATEGORIES, cats),

  getDismissedDuplicates: () => safeGet(KEYS.DISMISSED_DUPLICATES, []),
  setDismissedDuplicates: (arr) => safeSet(KEYS.DISMISSED_DUPLICATES, arr)
};
