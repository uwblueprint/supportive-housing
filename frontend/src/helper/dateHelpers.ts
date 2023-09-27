// Combine date and time
export const combineDateTime = (dateObj: Date, timeStr: string): Date => {
  // Extract time components from timeStr
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Create a new Date object with the combined date and time
  const newDateObj = new Date(dateObj);
  newDateObj.setHours(hours);
  newDateObj.setMinutes(minutes);

  return newDateObj;
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
