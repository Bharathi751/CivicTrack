# CivicTrack: Complete Role-Based Architecture & System Study Guide
> **Comprehensive Learning Handbook & Code Walkthrough**  
> *Author: Antigravity Pair Programming Assistant*  
> *Target: System Learning, Code Decoding, Presentations, Project Reviews & Viva*

---

## 💡 Quick Real-World Analogy (How to explain to anyone in 30 seconds)

> **The Smart Building Analogy:**
> Imagine a smart municipal headquarters building:
> - **The Entrance (Login Page):** Everyone enters through the exact same entrance door. You scan your digital badge (Email & Password).
> - **The Smart Badge (Role Check):** Once scanned, the building security system reads your role:
>   - **Resident Badge (`citizen`):** Directs you to the Public Citizen Service Desk. You can register issues (potholes, garbage, lights) and track only your own submitted tokens.
>   - **Commissioner Badge (`admin`):** The elevator takes you directly to the 10th Floor Executive Command Center. You see city-wide stats, master triage queue, contractor workload, and assign repair jobs.
>   - **Contractor Badge (`staff`):** Directs you to the Field Maintenance Operations Workshop. You only see work orders assigned to your repair crew, and upload photos once repairs are finished.

---

## 👥 The 3 Roles at a Glance

| Role | Who are they? | Primary Screen | What do they see? | Key Actions |
| :--- | :--- | :--- | :--- | :--- |
| **`citizen`** | Local Residents (Arun, Priya) | `/citizen` | Personal submissions only | Report new issue with GPS map & photo, view tracking timeline, reopen issue if repair is bad. |
| **`admin`** | Municipal Officials (Rajesh V.) | `/admin` | City-wide aggregated data | Master triage, assign maintenance contractors, enroll new vendors, review duplicate complaints, hotspot analytics. |
| **`staff`** | Field Contractors (Apex, CityClean) | `/staff` | Assigned work orders only | View assigned job locations on ward map, update status to `in_progress`, upload **after-repair completion photo proof** & notes to resolve. |

---

## 🔐 How Login Works (Code Decode Step-by-Step)

### Files Involved:
1. UI: `src/pages/public/LoginRegister.jsx`
2. Logic & State: `src/context/AuthContext.jsx`
3. Database/Storage: `src/utils/storage.js` (`window.localStorage`)

### Step-by-Step Execution:
1. **User inputs credentials:** Email and Password into `LoginRegister.jsx`.
2. **Form Interception:** Form submit triggers `handleLoginSubmit(e)`:
   ```javascript
   e.preventDefault();
   const user = login(email, password);
   redirectAfterLogin(user.role);
   ```
3. **Authentication Verification inside `AuthContext.jsx`:**
   ```javascript
   const login = (email, password) => {
     const allUsers = Storage.getUsers(); // Reads array of users from localStorage
     const cleanEmail = email.trim().toLowerCase();

     // Matches exact email or demo aliases
     const found = allUsers.find((u) => {
       const matchEmail = u.email.toLowerCase() === cleanEmail;
       const matchAlias =
         ((cleanEmail === 'admin@admin.com') && u.role === 'admin') ||
         ((cleanEmail === 'citizen@civic.org') && u.role === 'citizen') ||
         ((cleanEmail === 'vendor@civic.org') && u.role === 'staff');
       return (matchEmail || matchAlias) && u.password === password;
     });

     if (!found) {
       throw new Error('Invalid email or password. Please verify your credentials.');
     }

     setCurrentUser(found);              // 1. Sets active user in React State
     Storage.setCurrentUser(found);       // 2. Persists user in LocalStorage
     return found;
   };
   ```
4. **Dynamic Redirection:**
   `redirectAfterLogin(user.role)` immediately routes the user:
   - If `user.role === 'admin'` $\rightarrow$ navigates to `/admin`
   - If `user.role === 'staff'` $\rightarrow$ navigates to `/staff`
   - If `user.role === 'citizen'` $\rightarrow$ navigates to `/citizen`

---

## 📝 How Registration Works (Step-by-Step)

1. User toggles to the **"New Registration"** tab in `LoginRegister.jsx`.
2. **Selects Account Role:** Citizen, Maintenance Contractor, or Municipal Official.
3. **Inputs details:** Name, Email, Password (with eye toggle), Phone, Address/Department.
4. **Email Uniqueness Check:** Checks `allUsers.some(u => u.email === cleanEmail)`. If duplicate, throws an error.
5. **Creates New User Object:**
   ```javascript
   const newUser = {
     user_id: Date.now(), // Unique numeric timestamp ID
     name,
     email: email.trim(),
     password,
     role,
     phone,
     address,
     avatar: 'https://images.unsplash.com/...',
     created_at: new Date().toISOString()
   };
   ```
6. **Saves & Auto-Login:** Appends `newUser` into `users` array, calls `setCurrentUser(newUser)`, saves to `localStorage`, and immediately redirects to the respective dashboard.

---

## 📊 How the Dashboards Work (Role-by-Role)

### 1. Citizen Dashboard (`CitizenDashboard.jsx`)
- **Data Isolation:** `issues.filter(i => i.user_id === currentUser.user_id)`.
- **Dynamic KPI Cards:** Total Submitted, Awaiting Review, In Progress, Resolved. Clicking any card updates URL query parameters (`/citizen/my-reports?status=pending`) and instantly filters the list.
- **Reporting Flow (`/report`):**
  - Pinpoints location on Leaflet interactive map (`latitude`, `longitude`).
  - Evaluates duplicate score against existing reports (`duplicateDetector.js`).
  - Generates unique tracking code (e.g. `TRK-2026-104`).
  - Saves report into `IssueContext`.

### 2. Admin Command Center (`AdminDashboard.jsx`)
- **City-Wide Aggregated Triage:** Reads all submitted tickets across all citizens.
- **Contractor Workload Monitor:** Calculates how many active jobs each vendor currently has (`vendorWorkloads`) to prevent overloading any single contractor.
- **Master Triage (`AllReports.jsx`):**
  - Filter by Status, Category, Priority, Search.
  - "Assign Vendor" modal: Select contractor, add special instructions.
  - "Change Status" modal: Transition complaint between `under_review`, `assigned`, `in_progress`, `resolved`, or `rejected`.
- **AI Deduplication (`DuplicateReview.jsx`):**
  $$\text{Duplicate Score} = 0.4 \times \text{Location} + 0.3 \times \text{Category} + 0.3 \times \text{Text Similarity}$$
- **Geospatial Hotspots (`HotspotAnalytics.jsx`):** Displays cluster density circles within a 450-meter radius to allocate emergency municipal funding.

### 3. Vendor / Staff Dashboard (`StaffDashboard.jsx`)
- **Contractor Job Isolation:** `issues.filter(i => i.assigned_to === currentUser.user_id)`.
- **Field Tools:** Interactive ward job map with pin markers for assigned tasks.
- **The Resolution Workflow:**
  1. Contractor completes physical repair on-site.
  2. Opens **"Update Work Order"** modal.
  3. Changes status to `resolved`.
  4. Uploads **after-repair photographic completion proof**.
  5. Enters repair notes (e.g. *"Pothole asphalt patch completed with cold-mix asphalt"*).
  6. Submits: ticket becomes resolved, citizen is automatically notified, and timestamped audit history is logged!

---

## 🔄 The Complete 5-Stage Issue Lifecycle

```
[reported] (Citizen files via /report)
     ↓
[under_review] (Admin inspects in Master Triage)
     ↓
[assigned] (Admin allocates to Contractor)
     ↓
[in_progress] (Contractor starts work on-site)
     ↓
[resolved] (Contractor uploads completion photo & notes)
     ↓ (Optional: if work is unsatisfactory)
[reopened] (Citizen reopens; sent back to contractor)
```

---

## 🎓 Viva / Interview Quick Answers

1. **How does role-based routing work?**  
   *"We maintain an authenticated `currentUser` in React's Context API. When the user logs in, a redirection helper checks `currentUser.role` and sends them to `/admin`, `/staff`, or `/citizen`. Dedicated layouts (`AdminLayout`, `StaffLayout`) wrap their respective views with tailored side navigation."*

2. **How is data persisted without a server?**  
   *"We use an abstraction wrapper over HTML5 `localStorage` (`src/utils/storage.js`). On initial load, data is seeded from `seedData.js`. Any mutations (submitting an issue, assigning a vendor, updating a status) are simultaneously saved to React state and `localStorage` to keep data synchronized across reloads."*

3. **How did you fix the page scrolling issue?**  
   *"We set `window.history.scrollRestoration = 'manual'` and created a global `<ScrollToTop />` component that runs `window.scrollTo(0, 0)` on every route change, and removed conflicting `overflow-y-auto` from inner layouts, ensuring every page starts cleanly at the top."*
