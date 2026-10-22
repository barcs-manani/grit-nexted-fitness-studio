import { BarbellStand } from "@/assets/icons/B/icons";
import { Home } from "@/assets/icons/H/icons";
import { Logout } from "@/assets/icons/L/icons";
import { PriceTag } from "@/assets/icons/P/icons";
import { Schedule, Settings } from "@/assets/icons/S/icons";


const HeroNav = [
    {
        id: 1,
        link: "#hero",
        text: "Home", 
        icon: Home
    },
    {
        id: 2,
        link: "#schedule",
        text: "Schedule",
        icon: Schedule
    },
    {
        id: 3,
        link: "#trainers",
        text: "Trainers",
        icon: BarbellStand
    },
    {
        id: 4,
        link: "#member-tiers",
        text: "Pricing",
        icon: PriceTag
    }
];

const AccountOptions = [
    {
        id: 1,
        type: "link",
        to: "#",
        text: "Account Settings",
        icon: Settings
    },
    {
        id: 2,
        type: "button",
        to: "logout",
        text: "Logout",
        icon: Logout
    }
];

export { HeroNav, AccountOptions }