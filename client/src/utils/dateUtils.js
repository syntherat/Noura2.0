// Format: June 14, 2025
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get weekday name: Saturday
export const getDayName = (dateString) => {
  const options = { weekday: 'long' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Number of days between two dates
export const daysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Add days to a date string (ISO format)
export const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Get today's date as a Date object
export const getToday = () => {
  return new Date();
}; 

// Get the number of days in the month of a given date
export const daysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

// Convert year, month, day into ISO yyyy-mm-dd format
export const getDateISO = (year, month, day) => {
  return new Date(year, month, day).toISOString().split('T')[0];
};

// Returns a list of all dates in a calendar grid for the given month
export const getCalendarGridDates = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstWeekDay = firstDay.getDay(); // Sunday = 0
  const totalDays = lastDay.getDate();

  const dates = [];

  // Add previous month's trailing days
  for (let i = firstWeekDay - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    dates.push({ date: prevDate, isCurrentMonth: false });
  }

  // Add current month's days
  for (let i = 1; i <= totalDays; i++) {
    dates.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }

  // Fill remaining to complete 6 weeks (6 rows × 7 columns = 42)
  while (dates.length < 42) {
    const last = dates[dates.length - 1].date;
    const nextDate = new Date(last);
    nextDate.setDate(last.getDate() + 1);
    dates.push({ date: nextDate, isCurrentMonth: false });
  }

  return dates;
};

export const formatMonthYear = (date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
