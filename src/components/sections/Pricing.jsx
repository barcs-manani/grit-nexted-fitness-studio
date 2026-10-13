export const Pricing = () => {
    return (
        <div id="member-tiers" className="w-full flex flex-col items-start gap-4 mt-(--section-gap) max-w-(--max-w) px-(--gutter) member-tiers-cntr">
            <h2>Membership Pricing</h2>
            <p className="max-w-[62ch] text-[18px] text-(--ink-soft)">Our membership tiers are structured to ensure you get the most value for trusting us to guide you to your
                dream physique</p>
            <div class="w-full grid membership-cards">
                <div class="card">
                    <h3 class="card-title">Kids (Under 17)</h3>
                    <div class="divider"></div>
                    <ul class="card-content">
                        <li>- Cardio and Calisthenics focus</li>
                        <li>- Beginner friendly workouts</li>
                        <li>- Group schedules</li>
                        <li>- Free pool time</li>
                    </ul>
                    <div class="divider"></div>
                    <span class="card-footer">
                        <span class="card-price">$5/month</span>
                        <a href="#" class="card-btn">Register</a>
                    </span>
                </div>
                <div class="card">
                    <h3 class="card-title">Adult</h3>
                    <div class="divider"></div>
                    <ul class="card-content">
                        <li>- Cardio, Calisthenics & Strength training</li>
                        <li>- Beginner & Intermediate workouts</li>
                        <li>- Group schedules</li>
                        <li>- Free amenities exclusive of pool access</li>
                    </ul>
                    <div class="divider"></div>
                    <span class="card-footer">
                        <span class="card-price">$10/month</span>
                        <a href="#" class="card-btn">Register</a>
                    </span>
                </div>
                <div class="card">
                    <h3 class="card-title">Special</h3>
                    <div class="divider"></div>
                    <ul class="card-content">
                        <li>- Cardio, Calisthenics, Strength & Dancing</li>
                        <li>- All levels including expert training</li>
                        <li>- Group schedules and personalized</li>
                        <li>- Free pool time</li>
                    </ul>
                    <div class="divider"></div>
                    <span class="card-footer">
                        <span class="card-price">$15/month</span>
                        <a href="#" class="card-btn">Register</a>
                    </span>
                </div>
            </div>
        </div>
    );
}