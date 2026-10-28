"use client"

import { useEffect, useState } from "react";
import { PromoBadge01 } from "@/components/shared/Badges";
import { formatCurrency } from "@/lib/formatters";
import { useBaseData } from "@/contexts/BaseDataContext";
import { AddMembershipModal } from "@/components/shared/modals/AddMembership";
import { AuthParent } from "@/components/shared/modals/auth/Main";

export const Pricing = ({
    accountInfo
}) => {
    const { ageGroups, branchLocations, branchError, ageGroupError } = useBaseData();
    const [membershipPlans, setMembershipPlans] = useState([]);
    const [selectedTier, setSelectedTier] = useState(null);
    const [openAuth, setOpenAuth] = useState(false);
    const [openRegForm, setOpenRegForm] = useState(false);
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
        if (ageGroupError || branchError) {
            setError(ageGroupError + ", " + branchError);
            return;
        }
        if (accountInfo?.id) {
            setSelectedTier(tier);
            setOpenRegForm(true);
            return;
        }
        setSelectedTier(tier);
        setOpenAuth(true);
    };

    const handleAuthSuccess = () => {
        if (selectedTier) {
            setOpenRegForm(true);
        }
    };

    const handleCloseReg = () => {
        setOpenRegForm(false);
        setSelectedTier(null);
    };

    const handleSubmit = async (submitData) => {
        try {
            // console.log("Registration payload: ", JSON.stringify(submitData));
            const response = await fetch(
                "/api/checkout",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    credentials: "same-origin",
                    body: JSON.stringify(submitData),
                }
            );
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Checkout start failed, please try again.");
            
            window.open(result.checkoutURL);
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
                        {error && (
                            <div className="col-span-1 md:col-span-2 w-full flex flex-col items-center justify-center h-40 gap-3 p-2">
                                <span>{error}. Try again later</span>
                            </div>
                        )}
                        {!membershipPlans.length && (
                            <div className="col-span-1 md:col-span-2 w-full flex flex-col items-center justify-center h-40 gap-3 p-2">
                                <span>No plans added yet!</span>
                            </div>
                        )}
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
                                    <span className="font-display text-[30px] font-bold text-(--ink)">
                                        {formatCurrency(plan.pricing[0].currency, plan.pricing[0].amount)}/month
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
            <AddMembershipModal
                open={openRegForm}
                onClose={handleCloseReg}
                membershipPlan={selectedTier}
                memberAges={ageGroups}
                branchLocations={branchLocations}
                accountInfo={accountInfo}
                onSubmit={handleSubmit}
            />
            <AuthParent
                isOpen={openAuth}
                onClose={() => setOpenAuth(false)}
                onAuthSuccess={handleAuthSuccess}
            />
        </>
    );
}