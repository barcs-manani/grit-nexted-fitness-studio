import Image from "next/image";
import Link from "next/link";
import { gritLogo } from "@/assets/images";

const primaryClass = "inline-flex justify-center py-2.5 px-6 rounded-(--btn-radius) bg-(--blue) text-white font-semibold no-underline hover:bg-(--blue-dark) transition-colors";
const secondaryClass = "inline-flex justify-center py-2.5 px-6 rounded-(--btn-radius) border border-(--line) text-(--ink) font-semibold no-underline hover:bg-(--bg-secondary) transition-colors";

/**
 * Shared layout for the payment result pages.
 *  - title, message: the text shown
 *  - primary:   { href, label } main button
 *  - secondary: { href, label } optional second button
 */
const PaymentResult = ({ title, message, primary, secondary }) => (
    <main className="min-h-dvh flex items-center justify-center bg-(--bg-secondary) px-(--gutter) py-(--section-gap)">
        <section className="w-full max-w-md flex flex-col items-center gap-5 text-center rounded-(--card-radius) border border-(--line) bg-(--bg) p-8 shadow-sm">
            {/* Same logo badge as the membership popup */}
            <div className="flex justify-center items-center w-20 h-20 rounded-full bg-linear-to-b from-(--bg) to-(--violet)">
                <Image alt="Grit logo" src={gritLogo} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="text-(--ink-soft)">{message}</p>
            </div>

            <div className="w-full flex flex-col sm:flex-row justify-center gap-3">
                <Link href={primary.href} className={primaryClass}>{primary.label}</Link>
                {secondary && (
                    <Link href={secondary.href} className={secondaryClass}>{secondary.label}</Link>
                )}
            </div>
        </section>
    </main>
);

export { PaymentResult }