import axiosClient from "./axiosClient";

export const getReportsSummary  = () => axiosClient.get("/reports/summary");
export const getVisitorTrend    = () => axiosClient.get("/reports/visitor-trend");
export const getOrgPerformance  = () => axiosClient.get("/reports/org-performance");
export const getVisitorTypes    = () => axiosClient.get("/reports/visitor-types");
