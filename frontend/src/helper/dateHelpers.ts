type FormattedDateAndTime = {
  date: string;
  time: string;
};

/**
 *
 * @returns an ISOstring
 */
export const combineDateTime = (dateObj: Date, timeStr: string): string => {
  // Extract time components from timeStr
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Create a new Date object with the combined date and time
  const newDateObj = new Date(dateObj);
  newDateObj.setHours(hours);
  newDateObj.setMinutes(minutes);

  return newDateObj.toISOString();
};

/**
 *
 * @param dateString yyyy-mm-dd format
 */
export const convertToDate = (dateString: string): Date => {
  // Split the date string into its components
  const dateComponents = dateString.split("-");
  const year = parseInt(dateComponents[0], 10);
  const month = parseInt(dateComponents[1], 10) - 1; // Months are zero-based (0-11)
  const day = parseInt(dateComponents[2], 10);

  // Create a Date object using the components
  return new Date(year, month, day);
};

/**
 *
 * @returns date string in yyyy-mm-dd format
 */
export const convertToString = (date: Date): string => {
  // Get the year, month, and day components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 *
 * @returns date string HH:MM format
 */
export const getFormattedTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getFormattedDateAndTime = (
  dateObj: Date,
  includeYear = false,
): FormattedDateAndTime => {
  const year = dateObj.getFullYear();
  const month = MONTHS[dateObj.getMonth()];
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  const formattedDate = includeYear
    ? `${month} ${day}, ${year}`
    : `${month} ${day}`;
  const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  return { date: formattedDate, time: formattedTime };
};
