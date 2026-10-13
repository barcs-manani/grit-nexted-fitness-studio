import { scheduleImg } from "../../assets/images/images";

export const Schedule = () => {
    return (
        <div id="schedule" className="w-full flex flex-col items-start gap-4 mt-(--section-gap) max-w-(--max-w) px-(--gutter) schedule-cntr">
            <h2 className="font-bold text-[clamp(34px, 5vw, 48px)] text-(--ink)">Scheduled For Greatness</h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-[clamp(24px, 5vw, 64px)]">
                <div className="col-span-3 flex flex-col gap-6">
                    <p className="max-w-[52ch] text-[18px] text-(--ink-soft)">
                        Our training times are customized to fit your 9-to-5 work schedule, with weekends designated for intense-level training
                    </p>
                    <div className="w-full flex flex-col gap-3.5 schedule-cards">
                        <div className="card">
                            <h3 className="card-title">Weekdays</h3>
                            <ul className="card-content">
                                <li>6:00 AM to 8:00 AM</li>
                                <li>5:00 PM to 7:00 PM</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h3 className="card-title">Weekends & Public Holidays</h3>
                            <ul className="card-content">
                                <li>6:00 AM to 8:00 AM</li>
                                <li>10:00 AM to 12:00 PM</li>
                                <li>3:00 AM to 7:00 PM</li>
                            </ul>
                        </div>
                        <div className="card">
                            <h3 className="card-title">Custom</h3>
                            <ul className="card-content">
                                <li>Get a personalized schedule just for you</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <img className="block w-full h-auto rounded-[20px]" alt="schedule section image" src={scheduleImg} />
                </div>
            </div>
        </div>
    );
}