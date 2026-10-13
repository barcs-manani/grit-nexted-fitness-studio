import { scheduleImg } from "../../assets/images/images";
import { ScheduleData } from "../../data/Schedule";
import "../../styles/Home.css"

export const Schedule = () => {
    return (
        <div id="schedule" className="w-full flex justify-center py-(--section-gap)">
            <div className="w-full flex flex-col items-start gap-4 max-w-(--max-w) px-(--gutter)">
                <h2 className="font-bold text-[34px] sm:text-[5vw] xl:text-12 text-(--ink)">Scheduled For Greatness</h2>
                <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-[5vw] xl:gap-16">
                    <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
                        <p className="max-w-[52ch] text-[18px] text-(--ink-soft)">
                            Our training times are customized to fit your 9-to-5 work schedule, with weekends designated for intense-level training
                        </p>
                        <div className="w-full flex flex-col gap-3.5 schedule-cards">
                            {ScheduleData.map((s) => (
                                <div className="rounded-br-(--card-radius) rounded-tr-(--card-radius) rounded-bl-sm rounded-tl-sm py-4.5 px-5.5 bg-(--bg-secondary) border-l-4 border-l-(--blue)">
                                    <h3 className="mb-2 text-[26px] font-bold text-(--violet)">
                                        {s.period}
                                    </h3>
                                    <ul className="list-none flex flex-wrap gap-y-1.5 gap-x-5.5">
                                        {s.times.map((t) => (
                                            <li className="font-semibold">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <img className="block w-full h-auto rounded-[20px]" alt="schedule section image" src={scheduleImg} />
                    </div>
                </div>
            </div>
        </div>
    );
}