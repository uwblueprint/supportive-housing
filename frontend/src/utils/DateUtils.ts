const MONTHS = [
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

type FormattedDateAndTime = {
  date: string;
  time: string;
};

const getFormattedDateAndTime = (
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

export default getFormattedDateAndTime;
