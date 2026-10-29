"use client"

import { useState, useEffect } from "react";
import { DataBadge } from "../shared/Badges";
import Link from "next/link";
import { Spinner } from "../shared/animations/Spinner";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { MainNav } from "../shared/nav/Main";

const buttonClass = "inline-flex justify-center py-2.5 px-6 rounded-(--btn-radius) font-semibold no-underline cursor-pointer transition-colors";


const DashboardClient = ({
    accountInfo
}) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0); // changing this re-runs the fetch (used by "Try again")

    useEffect(() => {
        const controller = new AbortController();
        const loadMembers = async () => {
            try {
                const response = await fetch(
                    "/api/account/members",
                    {
                        method: "GET",
                        signal: controller.signal,
                        cache: "no-store"
                    }
                );

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Failed to load members.");

                setError("");
                setMembers(Array.isArray(result) ? result : []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError(err.message || "Failed to load account members");
                }
            } finally {
                // An aborted request means a newer one is starting, so keep the spinner showing
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        loadMembers().catch(() => {});
        return () => controller.abort();
    }, [reloadKey]);

    const retry = () => {
        setLoading(true);
        setReloadKey((k) => k + 1);
    };

    const activeCount = members.filter((m) => m.isActive).length;
    const firstName = accountInfo?.fullName?.split(" ")[0];

    return (
        <>
            <MainNav
                bgTheme="light"
                accountInfo={accountInfo}
            />
            <main className="w-full max-w-(--max-w) mx-auto px-(--gutter) pt-28 pb-(--section-gap) flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold">Account Dashboard</h1>
                    {firstName && <p className="text-(--ink-soft)">Welcome back, {firstName}.</p>}
                </div>

                <section aria-labelledby="members-title" className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h2 id="members-title" className="text-2xl font-bold">Members</h2>
                        {!loading && !error && members.length > 0 && (
                            <p className="text-sm text-(--ink-soft)">
                                {members.length} total &middot; {activeCount} active
                            </p>
                        )}
                    </div>

                    <div className="rounded-(--card-radius) border border-(--line) bg-(--bg) overflow-hidden">
                        {loading ? (
                            <div className="relative min-h-56">
                                <Spinner position="center" label="Loading members" />
                            </div>
                        ) : error ? (
                            <div role="alert" className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                                <p className="font-semibold text-red-600">{error}</p>
                                <button
                                    type="button"
                                    onClick={retry}
                                    className={`${buttonClass} border border-(--line) text-(--ink) hover:bg-(--bg-secondary)`}
                                >
                                    Try again
                                </button>
                            </div>
                        ) : members.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                                <div>
                                    <p className="font-semibold">No members yet</p>
                                    <p className="text-(--ink-soft)">Choose a membership plan to add your first member.</p>
                                </div>
                                <Link
                                    href="/#member-tiers"
                                    className={`${buttonClass} bg-(--blue) text-white hover:bg-(--blue-dark)`}
                                >
                                    View plans
                                </Link>
                            </div>
                        ) : (
                            // overflow-x-auto + min-w lets the table scroll sideways on small screens
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-176 border-collapse text-left">
                                    <caption className="sr-only">Members on this account</caption>
                                    <thead className="bg-(--bg-secondary) text-sm text-(--ink-soft)">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 font-semibold">Member</th>
                                            <th scope="col" className="px-4 py-3 font-semibold">Phone</th>
                                            <th scope="col" className="px-4 py-3 font-semibold">Age group</th>
                                            <th scope="col" className="px-4 py-3 font-semibold">Branch</th>
                                            <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                                            <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((member) => (
                                            <tr key={member.id} className="border-t border-(--line) hover:bg-(--bg-secondary)/60 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-semibold">{member.fullName}</span>
                                                        {member.primaryAccount && <DataBadge>Primary</DataBadge>}
                                                    </div>
                                                    <div className="text-sm text-(--ink-soft) break-all">{member.emailAddress}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {formatPhoneNumberIntl(member.phoneNumber ?? "") || member.phoneNumber}
                                                </td>
                                                <td className="px-4 py-3">{member.ageGroup?.group}</td>
                                                <td className="px-4 py-3">
                                                    {member.branchLocation
                                                        ? `${member.branchLocation.city}, ${member.branchLocation.country}`
                                                        : ""}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold" title={member.membershipPlan?.description}>
                                                        {member.membershipPlan?.name}
                                                    </div>
                                                    <div className="text-sm text-(--ink-soft) capitalize">{member.membershipPlan?.type}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <DataBadge active={member.isActive}>{member.isActive ? "Active" : "Inactive"}</DataBadge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export { DashboardClient }