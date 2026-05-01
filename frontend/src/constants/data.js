// ═══════════════════════════════════════
//  CorpVMS v2.0 — App Data & Constants
// ═══════════════════════════════════════

// ── Demo employee accounts (simulate auth) ──
export const EMPLOYEES = [
  {
    id: "EMP001",
    password: "pass123",
    name: "Meera Krishnan",
    initials: "MK",
    designation: "Senior Executive",
    department: "Administration",
    email: "meera.krishnan@infosys.com",
    mobile: "+91 98765 00042",
    joinDate: "12 March 2021",
    reportingTo: "Rajesh Singhania",
    employeeType: "Full-Time",
    location: "Bangalore HQ",
    status: "Active",
    avatar: null,
  },
  {
    id: "EMP002",
    password: "pass456",
    name: "Arjun Mehta",
    initials: "AM",
    designation: "Software Engineer",
    department: "Information Technology",
    email: "arjun.mehta@infosys.com",
    mobile: "+91 87654 32109",
    joinDate: "05 July 2022",
    reportingTo: "Vikram Joshi",
    employeeType: "Full-Time",
    location: "Pune Office",
    status: "Active",
    avatar: null,
  },
];

// ── Organization details ──
export const ORGANIZATION = {
  name:        "Infosys Technologies Ltd.",
  shortName:   "Infosys",
  type:        "Corporate Company (IT / MNC)",
  founded:     "1981",
  hq:          "Electronics City Phase I, Bangalore — 560100",
  website:     "www.infosys.com",
  phone:       "+91-80-2852-0261",
  email:       "security@infosys.com",
  gstin:       "29AABCI1682H1ZK",
  totalFloors: 8,
  totalGates:  3,
  workingHours:"09:00 AM — 07:00 PM",
  securityHead:"Col. Ramesh Kumar (Retd.)",
  securityDesk:"Ext. 100",
  emergency:   "+91-80-2852-0199",
  branches: [
    { city: "Bangalore", type: "Headquarters", employees: "12,000+" },
    { city: "Pune",      type: "Development Centre", employees: "8,500+" },
    { city: "Hyderabad", type: "Regional Office", employees: "6,200+" },
    { city: "Chennai",   type: "Regional Office", employees: "4,800+" },
    { city: "Mumbai",    type: "Sales Office",    employees: "2,100+" },
  ],
  gates: [
    { id: "G1", name: "Main Gate (North)",  status: "Active",   hours: "24x7" },
    { id: "G2", name: "South Gate",         status: "Active",   hours: "06:00–22:00" },
    { id: "G3", name: "Delivery Gate (East)",status:"Restricted",hours: "09:00–18:00" },
  ],
  amenities: ["Cafeteria","Medical Centre","Gym","Library","Crèche","ATM","Parking — 500 vehicles"],
};

// ── Visitor types ──
export const VISITOR_TYPES = [
  "Business Meeting",
  "Job Interview",
  "Vendor / Supplier",
  "Audit / Inspection",
  "Training / Workshop",
  "Personal Visit",
  "Government / Regulatory",
  "Delivery / Collection",
  "Contractor",
  "Other",
];

// ── Host employees ──
export const HOST_LIST = [
  "Rajesh Singhania — CEO",
  "Vikram Joshi — CTO",
  "Anil Kapoor — CFO",
  "Sunita Rao — COO",
  "Meera Krishnan — Sr. Executive",
  "Deepak Nair — IT Manager",
  "Priya Shah — Admin Head",
  "Ravi Shankar — HR Manager",
];

// ── Seed visitor data ──
export const SEED_VISITORS = [
  {
    id: "VIS-2025-001",
    name: "Rohit Sharma",
    phone: "9876543210",
    purpose: "Business Meeting",
    visitDate: "2025-12-22",
    passcode: "RS22",
    host: "Rajesh Singhania — CEO",
    status: "Approved",
    registeredAt: "2025-12-20 10:30",
    checkedIn: "2025-12-22 09:55",
    checkedOut: "2025-12-22 11:30",
    note: "",
    registeredBy: "EMP001",
  },
  {
    id: "VIS-2025-002",
    name: "Ananya Iyer",
    phone: "9823456789",
    purpose: "Job Interview",
    visitDate: "2025-12-22",
    passcode: "AI22",
    host: "Ravi Shankar — HR Manager",
    status: "Checked In",
    registeredAt: "2025-12-21 14:00",
    checkedIn: "2025-12-22 10:05",
    checkedOut: "",
    note: "Technical round interview",
    registeredBy: "EMP001",
  },
  {
    id: "VIS-2025-003",
    name: "Suresh Babu",
    phone: "9712345678",
    purpose: "Vendor / Supplier",
    visitDate: "2025-12-22",
    passcode: "SB22",
    host: "Vikram Joshi — CTO",
    status: "Pending",
    registeredAt: "2025-12-22 08:45",
    checkedIn: "",
    checkedOut: "",
    note: "Hardware delivery",
    registeredBy: "EMP001",
  },
  {
    id: "VIS-2025-004",
    name: "Preethi Nair",
    phone: "9654321098",
    purpose: "Audit / Inspection",
    visitDate: "2025-12-23",
    passcode: "PN23",
    host: "Anil Kapoor — CFO",
    status: "Approved",
    registeredAt: "2025-12-22 11:00",
    checkedIn: "",
    checkedOut: "",
    note: "Q3 financial audit",
    registeredBy: "EMP001",
  },
  {
    id: "VIS-2025-005",
    name: "Mohammed Raza",
    phone: "9543210987",
    purpose: "Government / Regulatory",
    visitDate: "2025-12-21",
    passcode: "MR21",
    host: "Rajesh Singhania — CEO",
    status: "Completed",
    registeredAt: "2025-12-20 16:00",
    checkedIn: "2025-12-21 14:00",
    checkedOut: "2025-12-21 17:30",
    note: "Labour department inspection",
    registeredBy: "EMP002",
  },
  {
    id: "VIS-2025-006",
    name: "Deepa Kulkarni",
    phone: "9432109876",
    purpose: "Training / Workshop",
    visitDate: "2025-12-23",
    passcode: "DK23",
    host: "Deepak Nair — IT Manager",
    status: "Pending",
    registeredAt: "2025-12-22 09:15",
    checkedIn: "",
    checkedOut: "",
    note: "React training batch",
    registeredBy: "EMP002",
  },
];

// ── NAV items (per role) ──
export const NAV_ITEMS = [
  { key: "dashboard",     icon: "bi-speedometer2",        label: "Dashboard"         },
  { key: "prereg",        icon: "bi-calendar-plus-fill",  label: "Pre-Registration"  },
  { key: "reglist",       icon: "bi-journal-text",        label: "Registration List" },
  { key: "profile",       icon: "bi-person-badge-fill",   label: "My Profile & Org"  },
];

// ── Status config ──
export const STATUS_CONFIG = {
  Pending:    { bg: "#fffbeb", color: "#92400e", border: "#fcd34d", dot: "#d97706" },
  Approved:   { bg: "#f0fdf4", color: "#166534", border: "#86efac", dot: "#16a34a" },
  "Checked In":{ bg:"#eff6ff", color: "#1e40af", border: "#93c5fd", dot: "#2563eb" },
  Completed:  { bg: "#f9fafb", color: "#374151", border: "#d1d5db", dot: "#6b7280" },
  Cancelled:  { bg: "#fef2f2", color: "#991b1b", border: "#fca5a5", dot: "#dc2626" },
  Rejected:   { bg: "#fef2f2", color: "#991b1b", border: "#fca5a5", dot: "#dc2626" },
};

// ── Helpers ──
export const todayStr    = () => new Date().toISOString().split("T")[0];
export const nowTimeStr  = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
export const formatDate  = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
};
export const initials    = (n) => (n||"").split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
export const genPasscode = (name, date) => {
  const initl = (name||"").replace(/\s/g,"").slice(0,2).toUpperCase();
  const day   = (date||"").split("-")[2] || "00";
  return initl + day;
};
export const genVisitorId = (list) => {
  const next = (list.length + 1).toString().padStart(3,"0");
  const yr   = new Date().getFullYear();
  return `VIS-${yr}-${next}`;
};
