const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const checkSlotOverlap = (newStart, newEnd, existingSlots) => {
  const newStartMin = timeToMinutes(newStart);
  const newEndMin = timeToMinutes(newEnd);

  return existingSlots.some((slot) => {
    const existingStartMin = timeToMinutes(slot.startTime);
    const existingEndMin = timeToMinutes(slot.endTime);
    return newStartMin < existingEndMin && newEndMin > existingStartMin;
  });
};

const isPastTime = (date, time) => {
  const now = new Date();
  const slotDateTime = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime < now;
};

const getEndTime = (startTime) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endMinutes = minutes + 15;
  if (endMinutes >= 60) {
    return `${String(hours + 1).padStart(2, "0")}:${String(endMinutes - 60).padStart(2, "0")}`;
  }
  return `${String(hours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
};

module.exports = {
  checkSlotOverlap,
  isPastTime,
  getEndTime,
  timeToMinutes,
};
