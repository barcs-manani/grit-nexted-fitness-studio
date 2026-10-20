"use client"

import { useMemo, useState } from "react";
import { Chevron } from "@/assets/icons/Icons";
import { scheduleImg } from "@/assets/images";
import { ScheduleData } from "@/data/Schedule";
import { Filters } from "@/components/shared/Filters";
import Image from "next/image";


const ScheduleCard = ({
    id, period, slots, open, onToggle
}) => (
    <div className="rounded-br-(--card-radius) rounded-tr-(--card-radius) rounded-bl-sm rounded-tl-sm bg-(--bg-secondary) border-l-4 border-l-(--blue)">
        <button
            type="button"
            id={`${id}-trigger`}
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            onClick={onToggle}
            className="w-full flex items-start justify-between gap-4 py-4.5 px-5.5 text-left cursor-pointer rounded-br-(--card-radius) rounded-tr-(--card-radius) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--blue)"
        >
            <div>
                <h3 className="mb-2 text-[26px] font-bold text-(--violet)">{period}</h3>
                <ul className="list-none flex flex-wrap gap-y-1.5 gap-x-5.5">
                    {slots.map((s) => (
                        <li key={s.time} className="font-semibold text-(--ink-soft)">{s.time}</li>
                    ))}
                </ul>
            </div>
            <span className="mt-2"><Chevron rotate={open ? "180" : ""} /></span>
        </button>

        <section
            id={`${id}-panel`}
            aria-labelledby={`${id}-trigger`}
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
            <div className="overflow-hidden">
                <ul className="list-none px-5.5 pb-2">
                    {slots.map((s) => (
                        <li key={s.time} className="py-4 border-t border-(--line)">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-1.5">
                                <span className="font-semibold text-(--ink)">{s.time}</span>
                                <span className="flex flex-wrap gap-1.5">
                                    {s.focus.map((f) => (
                                        <span key={f} className="text-sm font-medium text-(--ink-soft) border border-(--line) bg-(--bg) rounded-(--btn-radius) px-2.5 py-0.5">
                                            {f}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <p className="max-w-[60ch] text-(--ink-soft)">{s.note}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    </div>
);

const Schedule = () => {
    const [selectedFocus, setSelectedFocus] = useState([]);
    const [openPID, setOpenPID] = useState(null);

    const focusAreas = useMemo(() => {
        const all = ScheduleData.flatMap((p) => p.times.flatMap((t) => t.focus || []));
        return [...new Set(all)].sort((a, b) => a.localeCompare(b));
    }, []);

    // Using memoization in this version to compare to trainers.jsx architecture for scalabilty
    const filteredSchedules = useMemo(() => {
        return ScheduleData.map((p) => {
            if (p.custom) return { ...p, slots: [] };
            const slots = selectedFocus.length
                ? p.times.filter((t) => (t.focus || []).some((f) => selectedFocus.includes(f)))
                : p.times;
            return { ...p, slots };
        }).filter((p) => p?.custom || p.slots.length)
    }, [selectedFocus]);

    const hasSessions = filteredSchedules.some((p) => !p.custom);

    return (
        <div id="schedule" className="w-full flex justify-center py-(--section-gap)">
            <div className="w-full flex flex-col items-start gap-4 max-w-(--max-w) px-(--gutter)">
                <h2 className="font-bold text-[34px] sm:text-[5vw] xl:text-12 text-(--ink)">Scheduled For Greatness</h2>
                <p className="text-[18px] text-(--ink-soft)">
                    Our training times are customized to fit your 9-to-5 work schedule, with weekends designated for intense-level training
                </p>
                <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-[5vw] xl:gap-16">
                    <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
                        <div className="w-full flex flex-col gap-2.5">
                            <p className="text-sm font-semibold text-(--ink-soft)">Show sessions for</p>
                            <Filters
                                fields={focusAreas}
                                selected={selectedFocus}
                                setSelected={setSelectedFocus}
                                xPosition="left"
                            />
                        </div>
                        <div className="w-full flex flex-col gap-3.5">
                            {filteredSchedules.map((p) =>
                                p.custom
                                    ? (
                                        <div key={p.id} className="rounded-br-(--card-radius) rounded-tr-(--card-radius) rounded-bl-sm rounded-tl-sm py-4.5 px-5.5 bg-(--bg-secondary) border-l-4 border-l-(--blue)">
                                            <h3 className="mb-2 text-[26px] font-bold text-(--violet)">{p.period}</h3>
                                            <p className="font-semibold text-(--ink-soft)">{p.description}</p>
                                        </div>
                                    )
                                    : (
                                        <ScheduleCard
                                            key={p.id}
                                            id={`schedule-${p.id}`}
                                            period={p.period}
                                            slots={p.slots}
                                            open={openPID === p.id}
                                            onToggle={() => setOpenPID(openPID === p.id ? null : p.id)}
                                        />
                                    ))}
                            {!hasSessions && (
                                <p className="text-(--ink-soft)">
                                    No fixed sessions match those focus areas. Clear a filter, or ask for a custom schedule.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <Image
                            src={scheduleImg}
                            alt="person with phone checking calendar"
                            className="block w-full h-[60vh] sm:h-auto rounded-[20px]"
                            sizes="(max-width: 768px) 100vw, 40vw"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Schedule }