export const formatDate = {
  toReadable: (date: string | Date | number, shortMonth = false): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: shortMonth ? "short" : "long",
      year: "numeric",
    });
  },

  toNumeric: (date: string | Date | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  },

  isToday: (date: string | Date | number): boolean => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }
};