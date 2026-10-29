import { PaymentResult } from "@/components/payments/PaymentResult";

export default function PaymentCancelledPage() {
    return (
        <PaymentResult
            title="Checkout cancelled"
            message="Your membership has not been confirmed. You can try again, or close this tab if you do not wish to continue at this time."
            primary={{ href: "/#member-tiers", label: "Try again" }}
            // secondary={{ href: "/", label: "Back to home" }}
        />
    );
}