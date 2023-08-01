// Combine date and time 
const combineDateTime = (dateObj: Date, timeStr: string): Date => {
    // Extract time components from timeStr
    const [hours, minutes] = timeStr.split(":").map(Number);

    // Create a new Date object with the combined date and time
    const newDateObj = new Date(dateObj);
    newDateObj.setHours(hours);
    newDateObj.setMinutes(minutes);

    return newDateObj;
};

export default combineDateTime;
