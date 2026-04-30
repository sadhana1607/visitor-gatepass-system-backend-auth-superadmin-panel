import { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {

  const [reports, setReports] = useState({
    totalVisitors: 0,
    totalEmployees: 0,
    totalOrganizations: 0,
    activeUsers: 0,
  });

  const [loading, setLoading] = useState(false);

  // 🔥 Update report data globally
  const updateReports = (data) => {
    setReports(prev => ({
      ...prev,
      ...data
    }));
  };

  return (
    <ReportContext.Provider value={{
      reports,
      setReports,
      updateReports,
      loading,
      setLoading
    }}>
      {children}
    </ReportContext.Provider>
  );
};

// ✅ Custom hook (clean usage)
export const useReports = () => useContext(ReportContext);