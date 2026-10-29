import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '../utils/storage';
import { useAuth } from './AuthContext';
import { findDuplicateCandidates } from '../utils/duplicateDetector';

const IssueContext = createContext();

export function IssueProvider({ children }) {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [history, setHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dismissedDuplicates, setDismissedDuplicates] = useState([]);

  useEffect(() => {
    setIssues(Storage.getIssues());
    setHistory(Storage.getHistory());
    setCategories(Storage.getCategories());
    setNotifications(Storage.getNotifications());
    setDismissedDuplicates(Storage.getDismissedDuplicates());
  }, []);

  // Sync helpers
  const saveIssuesState = (newIssues) => {
    setIssues(newIssues);
    Storage.setIssues(newIssues);
  };

  const logStatusHistory = (issueId, oldStatus, newStatus, note, actor) => {
    const newEntry = {
      history_id: Date.now() + Math.floor(Math.random() * 1000),
      issue_id: issueId,
      changed_by_id: actor?.user_id || 0,
      changed_by_name: actor?.name || 'System Administrator',
      changed_by_role: actor?.role || 'admin',
      old_status: oldStatus,
      new_status: newStatus,
      note: note || `Status changed from ${oldStatus || 'none'} to ${newStatus}`,
      changed_at: new Date().toISOString()
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    Storage.setHistory(updatedHistory);
    return newEntry;
  };

  const createNotification = (recipientUserId, issueId, title, message) => {
    if (!recipientUserId) return;
    const newNotif = {
      notification_id: Date.now() + Math.floor(Math.random() * 1000),
      recipient_user_id: recipientUserId,
      issue_id: issueId,
      title,
      message,
      read: false,
      created_at: new Date().toISOString()
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    Storage.setNotifications(updated);
  };

  // Citizen: Submit an issue report
  const submitIssue = ({
    title,
    description,
    category_id,
    latitude,
    longitude,
    address,
    priority = 'medium',
    images = []
  }) => {
    const category = categories.find((c) => c.id === Number(category_id)) || categories[0];
    const trackingCode = `TRK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newIssue = {
      issue_id: Date.now(),
      tracking_code: trackingCode,
      user_id: currentUser?.user_id || 1,
      citizen_name: currentUser?.name || 'Anonymous Citizen',
      citizen_phone: currentUser?.phone || 'Not provided',
      category_id: category.id,
      category_name: category.name,
      title,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || 'Location pinned on map',
      priority,
      status: 'reported',
      assigned_to: null,
      assigned_to_name: null,
      assigned_at: null,
      images: images.length > 0 ? images : [
        '/images/issues/broken-road-mud.jpg'
      ],
      completion_image: null,
      work_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null,
      duplicate_of_id: null
    };

    const updated = [newIssue, ...issues];
    saveIssuesState(updated);

    // Record submission in history
    logStatusHistory(
      newIssue.issue_id,
      null,
      'reported',
      'Citizen submitted report with geographical pin and photo.',
      currentUser
    );

    // Notify citizen with tracking code
    createNotification(
      newIssue.user_id,
      newIssue.issue_id,
      'Issue Report Received',
      `Your report "${title}" has been registered with tracking code: ${trackingCode}.`
    );

    return newIssue;
  };

  // Admin / Staff: Update status
  const updateIssueStatus = (issueId, newStatus, note = '') => {
    const target = issues.find((i) => i.issue_id === Number(issueId));
    if (!target) return;

    const oldStatus = target.status;
    const isResolving = newStatus === 'resolved';

    const updated = issues.map((i) => {
      if (i.issue_id === Number(issueId)) {
        return {
          ...i,
          status: newStatus,
          updated_at: new Date().toISOString(),
          resolved_at: isResolving ? new Date().toISOString() : i.resolved_at
        };
      }
      return i;
    });

    saveIssuesState(updated);
    logStatusHistory(issueId, oldStatus, newStatus, note, currentUser);

    // Notify issue owner
    createNotification(
      target.user_id,
      target.issue_id,
      `Status Update: ${target.tracking_code}`,
      `Your reported issue is now marked as "${newStatus.replace('_', ' ').toUpperCase()}". Note: ${note || 'Status updated by administrator.'}`
    );
  };

  // Admin: Assign staff / vendor
  const assignIssueToStaff = (issueId, staffUser, assignmentNote = '') => {
    const target = issues.find((i) => i.issue_id === Number(issueId));
    if (!target) return;

    const oldStatus = target.status;
    const newStatus = 'assigned';

    const updated = issues.map((i) => {
      if (i.issue_id === Number(issueId)) {
        return {
          ...i,
          assigned_to: staffUser.user_id,
          assigned_to_name: staffUser.name,
          assigned_at: new Date().toISOString(),
          status: newStatus,
          updated_at: new Date().toISOString()
        };
      }
      return i;
    });

    saveIssuesState(updated);
    logStatusHistory(
      issueId,
      oldStatus,
      newStatus,
      `Assigned to ${staffUser.name} (${staffUser.department || 'Vendor'}). ${assignmentNote}`,
      currentUser
    );

    // Notify assigned staff/vendor
    createNotification(
      staffUser.user_id,
      issueId,
      `New Task Assigned: ${target.tracking_code}`,
      `You have been assigned to handle "${target.title}" at ${target.address}.`
    );

    // Notify citizen
    createNotification(
      target.user_id,
      issueId,
      `Staff Assigned: ${target.tracking_code}`,
      `Your report has been assigned to ${staffUser.name}. Work will commence shortly.`
    );
  };

  // Staff / Vendor: Update work notes & progress / complete repair
  const submitVendorWorkUpdate = (issueId, { newStatus, workNotes, completionImage }) => {
    const target = issues.find((i) => i.issue_id === Number(issueId));
    if (!target) return;

    const oldStatus = target.status;
    const isResolved = newStatus === 'resolved';

    const updated = issues.map((i) => {
      if (i.issue_id === Number(issueId)) {
        return {
          ...i,
          status: newStatus,
          work_notes: workNotes || i.work_notes,
          completion_image: completionImage || i.completion_image,
          updated_at: new Date().toISOString(),
          resolved_at: isResolved ? new Date().toISOString() : i.resolved_at
        };
      }
      return i;
    });

    saveIssuesState(updated);
    logStatusHistory(
      issueId,
      oldStatus,
      newStatus,
      `Field update by ${currentUser?.name || 'Vendor'}: ${workNotes || 'Status updated'}`,
      currentUser
    );

    // Notify citizen
    createNotification(
      target.user_id,
      issueId,
      `Work Update: ${target.tracking_code}`,
      `${currentUser?.name || 'Maintenance Team'} updated status to "${newStatus.replace('_', ' ')}": ${workNotes}`
    );
  };

  // Citizen / Admin: Reopen an issue
  const reopenIssue = (issueId, reason) => {
    const target = issues.find((i) => i.issue_id === Number(issueId));
    if (!target) return;

    const oldStatus = target.status;
    const newStatus = 'reopened';

    const updated = issues.map((i) => {
      if (i.issue_id === Number(issueId)) {
        return {
          ...i,
          status: newStatus,
          resolved_at: null,
          updated_at: new Date().toISOString()
        };
      }
      return i;
    });

    saveIssuesState(updated);
    logStatusHistory(
      issueId,
      oldStatus,
      newStatus,
      `Issue reopened by ${currentUser?.name}: ${reason}`,
      currentUser
    );

    // Notify assigned staff if present
    if (target.assigned_to) {
      createNotification(
        target.assigned_to,
        issueId,
        `Issue Reopened: ${target.tracking_code}`,
        `Citizen reported that the problem was not fully resolved: "${reason}".`
      );
    }
  };

  // Admin Duplicate Management
  const confirmDuplicate = (duplicateIssueId, masterIssueId) => {
    const duplicate = issues.find((i) => i.issue_id === Number(duplicateIssueId));
    const master = issues.find((i) => i.issue_id === Number(masterIssueId));
    if (!duplicate || !master) return;

    const updated = issues.map((i) => {
      if (i.issue_id === Number(duplicateIssueId)) {
        return {
          ...i,
          status: 'rejected',
          duplicate_of_id: master.issue_id,
          work_notes: `Marked as duplicate of tracking code ${master.tracking_code}`,
          updated_at: new Date().toISOString()
        };
      }
      return i;
    });

    saveIssuesState(updated);
    logStatusHistory(
      duplicate.issue_id,
      duplicate.status,
      'rejected',
      `Identified as duplicate of Master Issue #${master.tracking_code}. Linked for tracking.`,
      currentUser
    );

    createNotification(
      duplicate.user_id,
      duplicate.issue_id,
      `Duplicate Report Linked: ${duplicate.tracking_code}`,
      `Your report matches an existing report (${master.tracking_code}) and has been merged for municipal prioritization.`
    );
  };

  const dismissDuplicateCandidate = (pairKey) => {
    const updated = [...dismissedDuplicates, pairKey];
    setDismissedDuplicates(updated);
    Storage.setDismissedDuplicates(updated);
  };

  // Mark in-app notification read
  const markNotificationRead = (notifId) => {
    const updated = notifications.map((n) =>
      n.notification_id === notifId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    Storage.setNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    Storage.setNotifications(updated);
  };

  // Aggregate Statistics
  const stats = {
    total: issues.length,
    reported: issues.filter((i) => i.status === 'reported').length,
    underReview: issues.filter((i) => i.status === 'under_review').length,
    assigned: issues.filter((i) => i.status === 'assigned').length,
    inProgress: issues.filter((i) => i.status === 'in_progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    rejected: issues.filter((i) => i.status === 'rejected').length,
    reopened: issues.filter((i) => i.status === 'reopened').length,
    urgentCount: issues.filter((i) => i.priority === 'urgent' && i.status !== 'resolved').length,
    unresolvedCount: issues.filter((i) => !['resolved', 'rejected'].includes(i.status)).length,
    resolutionRate: issues.length > 0 ? Math.round((issues.filter((i) => i.status === 'resolved').length / issues.length) * 100) : 0
  };

  // Get status history for a specific issue
  const getIssueHistory = (issueId) => {
    return history
      .filter((h) => h.issue_id === Number(issueId))
      .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
  };

  // Synchronize issues when a user changes their profile name or contact details
  const syncUserIssues = (updatedUser) => {
    if (!updatedUser) return;
    const allIssues = Storage.getIssues();
    const updated = allIssues.map((issue) => {
      let changed = false;
      let newIssue = { ...issue };
      if (issue.user_id === updatedUser.user_id && issue.citizen_name !== updatedUser.name) {
        newIssue.citizen_name = updatedUser.name;
        if (updatedUser.phone) newIssue.citizen_phone = updatedUser.phone;
        changed = true;
      }
      if (issue.assigned_to === updatedUser.user_id && issue.assigned_to_name !== updatedUser.name) {
        newIssue.assigned_to_name = updatedUser.name;
        changed = true;
      }
      return changed ? newIssue : issue;
    });
    setIssues(updated);
    Storage.setIssues(updated);
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        categories,
        history,
        notifications,
        stats,
        dismissedDuplicates,
        submitIssue,
        updateIssueStatus,
        assignIssueToStaff,
        submitVendorWorkUpdate,
        reopenIssue,
        confirmDuplicate,
        dismissDuplicateCandidate,
        markNotificationRead,
        markAllNotificationsRead,
        getIssueHistory,
        syncUserIssues
      }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const ctx = useContext(IssueContext);
  if (!ctx) throw new Error('useIssues must be used within an IssueProvider');
  return ctx;
}
