export const SCHEDULE_DATA = {
  A: {
    firstShuttle: "07:00 AM",
    lastShuttle: "07:00 PM",
    frequency: 20,
    peakFrequency: 10,
    peakHours: "12:00–01:00 PM, 03:00–06:00 PM",
    notice: null,
    timeSlots: [
      { period: "Morning", icon: "sun", label: "07:00 AM – 12:00 PM", times: ["07:00", "07:20", "07:30", "07:40", "07:50", "08:00", "08:10", "08:30", "08:50", "09:00", "09:20", "09:40", "10:00", "10:20", "10:40", "11:00", "11:20", "11:40"] },
      { period: "Afternoon", icon: "sunset", label: "12:00 PM – 04:00 PM", times: ["12:00", "12:20", "12:40", "13:00", "13:20", "13:40", "14:00", "14:20", "14:40", "15:00", "15:20", "15:40", "16:00"] },
      { period: "Evening", icon: "moon", label: "04:00 PM – 07:00 PM", times: ["16:00", "16:20", "16:40", "17:00", "17:20", "17:40", "18:00", "18:20", "18:40", "19:00"] },
    ],
  },
  B: {
    firstShuttle: "07:00 AM",
    lastShuttle: "07:00 PM",
    frequency: 25,
    peakFrequency: 12,
    peakHours: "07:30–09:30 AM, 04:30–06:30 PM",
    notice: null,
    timeSlots: [
      { period: "Morning", icon: "sun", label: "07:00 AM – 12:00 PM", times: ["07:00", "07:30", "07:42", "07:54", "08:06", "08:18", "08:30", "09:00", "09:25", "09:50", "10:15", "10:40", "11:05", "11:30", "11:55"] },
      { period: "Afternoon", icon: "sunset", label: "12:00 PM – 04:00 PM", times: ["12:20", "12:45", "13:10", "13:35", "14:00", "14:25", "14:50", "15:15", "15:40", "16:00"] },
      { period: "Evening", icon: "moon", label: "06:00 PM – 09:30 PM", times: ["16:00", "16:12", "16:24", "16:36", "16:48", "17:00", "17:25", "17:50","18:15", "18:40", "19:05", "19:30", "19:55", "20:20", "20:45", "21:10", "21:30"] },
    ],
  },
  C: {
    firstShuttle: "07:00 AM",
    lastShuttle: "08:00 PM",
    frequency: 30,
    peakFrequency: 15,
    peakHours: "08:00–10:00 AM, 03:00–05:00 PM",
    notice: "Route C operates reduced service on weekends.",
    timeSlots: [
      { period: "Morning", icon: "sun", label: "07:00 AM – 12:00 PM", times: ["07:00", "07:30", "08:00", "08:15", "08:30", "08:45", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"] },
      { period: "Afternoon", icon: "sunset", label: "12:00 PM – 05:00 PM", times: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:15", "15:30", "15:45", "16:00", "16:30", "17:00"] },
      { period: "Evening", icon: "moon", label: "05:00 PM – 08:00 PM", times: [ "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"] },
    ],
  },
  D: {
    firstShuttle: "07:00 AM",
    lastShuttle: "07:30 PM",
    frequency: 35,
    peakFrequency: 18,
    peakHours: "08:00–10:00 AM, 03:30–05:30 PM",
    notice: "Route D may experience delays near Medical Village during peak hours.",
    timeSlots: [
      { period: "Morning", icon: "sun", label: "07:00 AM – 12:00 PM", times: ["07:00", "07:35", "08:00", "08:18", "08:36", "08:54", "09:12", "09:30", "10:05", "10:40", "11:15", "11:50"] },
      { period: "Afternoon", icon: "sunset", label: "12:00 PM – 04:30 PM", times: ["12:25", "13:00", "13:35", "14:10", "14:45", "15:20", "15:38", "15:56", "16:14", "16:30"] },
      { period: "Evening", icon: "moon", label: "04:30 PM – 07:30 PM", times: ["16:30", "16:50", "17:25", "18:00", "18:35", "19:10"] },
    ],
  },
};