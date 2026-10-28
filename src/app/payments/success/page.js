export default async function PaymentSuccessPage({ searchParams }) {
    const { session_id } = await searchParams;

    return (
        <main>
            <h1>Thank you</h1>
            <p>
                Your payment is being confirmed. You can close this page or return to
                your account.
            </p>
            {/* Do not treat session_id as proof that payment succeeded. */}
        </main>
    );
}