export type DeliverySlot = {
  date: string; // "2025-07-13"
  time: string; // "12:00 - 13:00"
};

export function generateDeliverySlots(daysAhead = 7): DeliverySlot[] {
  const slots: DeliverySlot[] = [];
  const now = new Date();

  for (let i = 0; i <= daysAhead; i++) {
    const base = new Date();
    base.setDate(base.getDate() + i);

    const dateStr = base.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const slotHours = [
      [12, 14],  // 12PM–2PM
      [19, 22] // 7PM–10PM
    ];

    for (const [startHour, endHour] of slotHours) {
      for (let hour = startHour; hour < endHour; hour++) {
        const start = new Date(base);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(base);
        end.setHours(hour + 1, 0, 0, 0);

        slots.push({
          date: dateStr,
          time: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`
        });
      }
    }
  }

  // Only future time slots
  return slots.filter(slot => {
    const [hourStr] = slot.time.split(':');
    const slotDateTime = new Date(`${slot.date}T${hourStr.padStart(2, '0')}:00:00`);
    return slotDateTime > now;
  });
}