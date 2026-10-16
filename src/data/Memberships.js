const MembershipPlans = [
    {
        type: "child",
        name: "Kids (Under 17)",
        perks: [
            "Cardio and Calisthenics focus",
            "Beginner friendly workouts",
            "Group schedules",
            "Free pool time"
        ],
        price: 5
    },
    {
        type: "adult",
        name: "Adult",
        perks: [
            "Cardio, Calisthenics & Strength training",
            "Beginner & Intermediate workouts",
            "Group schedules",
            "Free amenities exclusive of pool access"
        ],
        price: 10,
        popular: true
    },
    {
        type: "custom",
        name: "Custom",
        perks: [
            "Cardio, Calisthenics, Strength & Dancing",
            "All levels including expert training",
            "Adults & Kids above 10 yrs",
            "Group schedules and personalized",
            "Free pool time"
        ],
        price: 15
    }
];

export { MembershipPlans }