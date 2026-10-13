import { scheduleImg } from "../../assets/images/images";
import { ScheduleData } from "../../data/Schedule";
import "../../styles/Home.css"

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
                        {ScheduleData.map((s) => (
                            <div className="card">
                                <h3 className="card-title">{s.period}</h3>
                                <ul className="card-content">
                                    {s.times.map((t) => (
                                        <li>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-2">
                    <img className="block w-full h-auto rounded-[20px]" alt="schedule section image" src={scheduleImg} />
                </div>
            </div>
        </div>
    );
}