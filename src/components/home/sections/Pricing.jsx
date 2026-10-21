"use client"

import { useState } from "react";
import { MembershipPlans } from "@/data/Memberships";
import { RegistrationModal } from "@/components/shared/modals/Registration";
import { PromoBadge01 } from "@/components/shared/Badges";

export const Pricing = () => {
    const [selectedTier, setSelectedTier] = useState(null);
    const [openRegForm, setOpenRegForm] = useState(false);
    const handleClickReg = (tier) => {
        setSelectedTier(tier);
        setOpenRegForm(true);
    };
    const handleCloseReg = () => {
        setOpenRegForm(false);
        setSelectedTier(null);
    };
    const handleSubmit = async (submitData) => {
        const regPayload = {
            ...submitData,
            membershipType: selectedTier?.type
        };
        try {
            // console.log("Registration payload: ", JSON.stringify(regPayload));
            const response = await fetch(
                "/api/registrations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(regPayload),
                }
            );
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Registration failed please try again.")
            }

            return result;
        } catch (error) {
            return error;
        }
    };

    return (
        <>
            <div id="member-tiers" className="w-full flex justify-center mt-(--section-gap)">
                <div className="w-full flex flex-col items-start gap-4 max-w-(--max-w) px-(--gutter)">
                    <h2 className="font-bold text-[34px] sm:text-[5vw] xl:text-12 text-(--ink)">Membership Pricing</h2>
                    <p className="max-w-[62ch] text-[18px] text-(--ink-soft)">Our membership tiers are structured to ensure you get the most value for trusting us to guide you to your
                        dream physique</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-3 items-stretch">
                        {MembershipPlans.map((m) => (
                            <div key={m.type} className={`relative rounded-(--card-radius) flex flex-col gap-4 py-7 px-6.5 bg-white transition-all duration-150 ease-in-out hover:border-(--blue) hover:shadow-[0_0_0_1px_var(--blue)] ${m.popular ? 'border-2 border-(--violet)' : 'border border-(--line)'}`}>
                                <PromoBadge01
                                    text="Most Popular"
                                    design="pill"
                                    xPosition="right"
                                    yPosition="border-float"
                                    txtSize="medium"
                                    theme="secondary"
                                    display={m.popular}
                                />
                                <h3 className="text-[30px] font-bold text-(--violet)">{m.name}</h3>
                                <div className="h-px w-full bg-(--line)"></div>
                                <ul className="flex-1 list-none flex flex-col gap-2 text-(--ink-soft)">
                                    {m.perks.map((p, p_idx) => (
                                        <li key={p_idx}>- {p}</li>
                                    ))}
                                </ul>
                                <div className="h-px w-full bg-(--line)"></div>
                                <span className="w-full flex justify-between items-center flex-wrap gap-3">
                                    <span className="font-display text-[32px] font-bold text-(--ink)">${m.price}/month</span>
                                    <button
                                        type="button"
                                        onClick={() => handleClickReg(m)}
                                        className="py-2.5 px-5.5 bg-(--blue) text-white font-semibold no-underline rounded-(--btn-radius) transition-colors duration-200 ease-in-out hover:bg-(--blue-dark)"
                                    >
                                        Register
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <RegistrationModal
                open={openRegForm}
                onClose={handleCloseReg}
                regData={selectedTier}
                onSubmit={handleSubmit}
            />
        </>
    );
}