const ScheduleData = [
    {
        id: 1,
        period: "Weekdays",
        times: [
            {
                id: 1,
                time: "6:00 AM to 8:00 AM",
                focus: ["Body-Building", "Calisthenics"],
                note: "Early session for people training before work. Lighter crowd, so equipment is easy to get."
            },
            {
                id: 2,
                time: "5:00 PM to 7:00 PM",
                focus: ["Cardio", "Endurance Training", "Boxing"],
                note: "Our busiest window. Group classes run here, so book ahead."
            }
        ]
    },
    {
        id: 2,
        period: "Weekends & Public Holidays",
        times: [
            {
                id: 3,
                time: "6:00 AM to 8:00 AM",
                focus: ["Endurance Training", "Cardio"],
                note: "Long-form conditioning for members who like an early start."
            },
            {
                id: 4,
                time: "10:00 AM to 12:00 PM",
                focus: ["Dance", "Stretching & Flexibility"],
                note: "A slower pace with guided mobility work and movement classes."
            },
            {
                time: "3:00 PM to 7:00 PM",
                focus: ["Boxing", "Body-Building", "Calisthenics"],
                note: "High-intensity training with extended trainer availability."
            }
        ]
    },
    {
        id: 3,
        period: "Custom",
        custom: true,
        description: "Get a personalized schedule just for you",
        times: []
    }
];

export { ScheduleData }