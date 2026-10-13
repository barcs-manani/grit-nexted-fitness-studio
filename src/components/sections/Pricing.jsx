import { MembershipPlans } from "../../data/Memberships";

export const Pricing = () => {
    return (
        <div id="member-tiers" className="w-full flex flex-col items-start gap-4 mt-(--section-gap) max-w-(--max-w) px-(--gutter)">
            <h2>Membership Pricing</h2>
            <p className="max-w-[62ch] text-[18px] text-(--ink-soft)">Our membership tiers are structured to ensure you get the most value for trusting us to guide you to your
                dream physique</p>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-3 items-stretch membership-cards">
                {MembershipPlans.map((m) => (
                    <div className="card">
                        <h3 className="card-title">{m.type}</h3>
                        <div className="divider"></div>
                        <ul className="card-content">
                            {m.perks.map((p) => (
                                <li>- {p}</li>
                            ))}
                        </ul>
                        <div className="divider"></div>
                        <span className="card-footer">
                            <span className="card-price">${m.price}/month</span>
                            <a href="#" className="card-btn">Register</a>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}