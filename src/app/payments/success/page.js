import { PaymentResult } from "@/components/payments/PaymentResult";

export default function PaymentSuccessPage() {
    return (
        <PaymentResult
            title="Thank you"
            message="Your payment is being confirmed. You can close this tab or return to your account."
            primary={{ href: "/", label: "Back to home" }}
        />
    );
}