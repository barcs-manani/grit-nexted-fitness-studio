
const MembershipPlans = [
    {
        type: "essential",
        name: "Essential",
        description: "Build your fitness foundation.",
        perks: [
            "Body-building and calisthenics",
            "Cardio and endurance training",
            "Standard gym equipment access",
            "Basic trainer guidance",
            "Showers, lockers and changing rooms"
        ],
        price: 5,
        features: {
            disciplines: [
                "Body-Building",
                "Calisthenics",
                "Cardio",
                "Endurance Training"
            ],
            trainerSupport: "Basic guidance",
            personalizedPlan: false,
            personalTrainingSessions: 0,
            amenities: [
                "Gym equipment",
                "Showers",
                "Lockers",
                "Changing rooms"
            ]
        },
        popular: false
    },
    {
        type: "plus",
        name: "Plus",
        description: "Enjoy every regular training discipline.",
        perks: [
            "All Essential benefits",
            "Boxing, dance and flexibility training",
            "Trainer-guided group classes",
            "Sauna access"
        ],
        price: 10,
        features: {
            disciplines: [
                "Body-Building",
                "Calisthenics",
                "Cardio",
                "Endurance Training",
                "Boxing",
                "Dance",
                "Stretching & Flexibility"
            ],
            trainerSupport: "Group guidance",
            personalizedPlan: false,
            personalTrainingSessions: 0,
            amenities: [
                "Gym equipment",
                "Showers",
                "Lockers",
                "Changing rooms",
                "Sauna"
            ]
        },
        popular: true
    },
    {
        type: "premium",
        name: "Premium",
        description: "Get personalized training and complete wellness access.",
        perks: [
            "All Plus benefits",
            "Personalized training plan",
            "Trainer matching by specialization",
            "Two personal training sessions per month",
            "Sauna and swimming pool access"
        ],
        price: 15,
        features: {
            disciplines: [
                "Body-Building",
                "Calisthenics",
                "Cardio",
                "Endurance Training",
                "Boxing",
                "Dance",
                "Stretching & Flexibility"
            ],
            trainerSupport: "Personalized coaching",
            personalizedPlan: true,
            personalTrainingSessions: 2,
            amenities: [
                "Gym equipment",
                "Showers",
                "Lockers",
                "Changing rooms",
                "Sauna",
                "Swimming pool"
            ]
        },
        popular: false
    }
];

export { MembershipPlans };