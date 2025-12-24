export interface Report {
  id: string;
  name: string;
  date: string;
  url: string; // In a real app, this would be a blob URL or S3 link
}

const STORAGE_KEY = 'cootransures_reports';

export const reportService = {
  fetchReports: (): Report[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  uploadReport: (file: File): Promise<Report> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const newReport: Report = {
          id: crypto.randomUUID(),
          name: file.name,
          date: new Date().toLocaleDateString(),
          url: '#' // Mock URL
        };

        const existing = reportService.fetchReports();
        const updated = [newReport, ...existing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
        resolve(newReport);
      }, 1000);
    });
  }
};
