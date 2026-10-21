"use client"

import { useEffect, useState } from "react";
import { RegistrationModal } from "@/components/shared/modals/Registration";
import { PromoBadge01 } from "@/components/shared/Badges";
import { formatCurrency } from "@/lib/formatters";

export const Pricing = () => {
    const [membershipPlans, setMembershipPlans] = useState([]);
    const [selectedTier, setSelectedTier] = useState(null);
    const [openRegForm, setOpenRegForm] = useState(false);
    const [ageGroups, setAgeGroups] = useState([]);
    const [branchLocations, setBranchLocations] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadPlans() {
            try {
                const response = await fetch(
                    "/api/membership-plans",
                    {
                        signal: controller.signal,
                        cache: "no-store",
                    }
                )
                const result = await response.json()

                if (!response.ok) throw new Error(result.error || "Failed to load membership plans");
                setMembershipPlans(result);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(error);
                    setError(error.message || "Could not load membership plans");
                }
            } finally {
                if (!controller.signal.aborted) setLoadingPlans(false);
            }
        };
        loadPlans();
        return () => controller.abort();
    }, []);

    const handleClickReg = async (tier) => {
        try {
            const [ageResponse, branchResponse] = await Promise.all([
                fetch("/api/base/age-groups", { cache: "no-store" }),
                fetch("/api/base/branch-locations", { cache: "no-store" }),
            ]);

            const [ages, branches] = await Promise.all([
                ageResponse.json(),
                branchResponse.json(),
            ]);

            if (!ageResponse.ok) throw new Error(ages.error || "Could not load age groups");
            if (!branchResponse.ok) throw new Error(branches.error || "Could not load branch locations");
            if (!Array.isArray(ages)) throw new Error("Age groups request returned an invalid response");
            if (!Array.isArray(branches)) throw new Error("Branch locations request returned an invalid response");

            setAgeGroups(ages);
            setBranchLocations(branches);
            setSelectedTier(tier);
            setOpenRegForm(true);
        } catch (error) {
            console.error(error);
            setError(error?.message || "Failed to prepare registration form.");
        }
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

    if (loadingPlans) return <p>Loading membership plans...</p>

    return (
        <>
            <section id="member-tiers" className="w-full flex justify-center mt-(--section-gap)">
                <div className="w-full flex flex-col items-start gap-4 max-w-(--max-w) px-(--gutter)">
                    <h2 className="font-bold text-[34px] sm:text-[5vw] xl:text-12 text-(--ink)">Membership Pricing</h2>
                    <p className="max-w-[62ch] text-[18px] text-(--ink-soft)">Our membership tiers are structured to ensure you get the most value for trusting us to guide you to your
                        dream physique</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-3 items-stretch">
                        {membershipPlans.map((plan) => (
                            <article
                                key={plan.id}
                                className={`
                                    relative rounded-(--card-radius) flex flex-col gap-4 py-7 px-6.5 bg-white transition-all duration-150 ease-in-out hover:border-(--blue) hover:shadow-[0_0_0_1px_var(--blue)]
                                    ${plan.popular
                                        ? 'border-2 border-(--violet)'
                                        : 'border border-(--line)'
                                    }
                                `}
                            >
                                <PromoBadge01
                                    text="Most Popular"
                                    design="pill"
                                    xPosition="right"
                                    yPosition="border-float"
                                    txtSize="medium"
                                    theme="secondary"
                                    display={plan.popular}
                                />
                                <h3 className="text-[30px] font-bold text-(--violet)">{plan.name}</h3>
                                <div className="h-px w-full bg-(--line)"></div>
                                <ul className="flex-1 list-none flex flex-col gap-2 text-(--ink-soft)">
                                    {plan.perks.map((p) => (
                                        <li key={p.id}>- {p.name}</li>
                                    ))}
                                </ul>
                                <div className="h-px w-full bg-(--line)"></div>
                                <span className="w-full flex justify-between items-center flex-wrap gap-3">
                                    <span className="font-display text-[32px] font-bold text-(--ink)">
                                        {formatCurrency(plan.currency, plan.price)}/month
                                    </span>
                                    <button
                                        type="button"
                                        onClick={async () => handleClickReg(plan)}
                                        className="py-2.5 px-5.5 bg-(--blue) text-white font-semibold no-underline rounded-(--btn-radius) transition-colors duration-200 ease-in-out hover:bg-(--blue-dark)"
                                    >
                                        Register
                                    </button>
                                </span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
            <RegistrationModal
                open={openRegForm}
                onClose={handleCloseReg}
                membershipPlan={selectedTier}
                memberAges={ageGroups}
                branchLocations={branchLocations}
                onSubmit={handleSubmit}
            />
        </>
    );
}