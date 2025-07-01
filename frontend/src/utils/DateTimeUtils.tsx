export function formatSecondsToHHMMSS(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Use String.prototype.padStart to ensure two digits (e.g., 05 instead of 5)
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// A simple utility function for formatting
export function formatDateTime(isoString: string) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);

    // Options for readable format
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Use AM/PM
      // timeZoneName: 'short', // e.g., "IST"
    };

    // Use Intl.DateTimeFormat for locale-aware formatting
    // 'en-IN' is for India English locale. Adjust as needed.
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  } catch (error) {
    console.error("Error parsing date:", isoString, error);
    return 'Invalid Date';
  }
}

export function formatDateTimeCustom(isoString: string) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);

    // Options for the time part
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Use AM/PM
    } as const; // as const for TypeScript type safety

    // Options for the date part (short year)
    const dateOptions = {
      day: 'numeric',
      month: 'long', // 'long' for 'July'
      year: '2-digit', // '2-digit' for '25'
    } as const;

    const timePart = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
    // Note: 'en-US' is often good for ensuring 12-hour format with AM/PM for timePart.
    // 'en-IN' might default to 24-hour depending on environment.

    const datePart = new Intl.DateTimeFormat('en-IN', dateOptions).format(date); // Use 'en-IN' or your preferred locale for date part

    // Manually combine them in the desired order
    return `${timePart}, ${datePart}`;

  } catch (error) {
    console.error("Error parsing date:", isoString, error);
    return 'Invalid Date';
  }
}
