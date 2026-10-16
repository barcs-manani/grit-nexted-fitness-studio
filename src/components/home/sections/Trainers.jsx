import { useState } from "react";
import { BranchLocations } from "../../../data/Locations";
import { TrainersData } from "../../../data/Trainers";
import { Filters } from "../../shared/Filters";
import { trainerMan, trainerWoman } from "../../../assets/images";

export const Trainers = () => {
    const defField = { city: "all" };
    const [filteredTrainers, setFilteredTrainers] = useState(
        Array.isArray(TrainersData)
            ? TrainersData
            : []
    );
    const filterFields = (
        Array.isArray(BranchLocations)
            ? [defField, ...BranchLocations]
            : []
    ).map((b) => b.city);

    const handleSelectFilterItem = (selected) => {
        const res = selected.includes(defField.city) ? TrainersData : TrainersData.filter((t) => selected.includes(t.location));
        setFilteredTrainers([...res]);
    };
    return (
        <div id="trainers" className="w-full flex justify-center py-(--section-gap) bg-(--bg-secondary)">
            <div className="w-full flex flex-col items-start gap-4 max-w-(--max-w) px-(--gutter)">
                <h2 className="font-bold text-[34px] sm:text-[5vw] xl:text-12 text-(--ink)">Trained For Toughness</h2>
                <p className="max-w-[62ch] text-[18px] text-(--ink-soft) mb-4">
                    Our experienced team of trainers are here to ensure your physical growth and safety in the studio, so
                    that you can put as much effort as you can, to be the best you that you can be
                </p>
                <Filters
                    fields={filterFields}
                    setSelected={handleSelectFilterItem}
                    xPosition="right"
                />
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5.5">
                    {filteredTrainers.map((t) => {
                        const imgSrc = t?.gender === "male" ? trainerMan : trainerWoman;
                        return (
                        <div key={t.id} className="rounded-(--card-radius) overflow-hidden bg-white border border-(--line) transition-all duration-150 ease-in-out hover:-translate-y-1.5 hover:shadow-xl">
                            <div className="bg-(--ice)">
                                <img
                                    className="block w-full aspect-4/5 object-cover"
                                    alt={`Portrait of ${t.name}`}
                                    src={t?.img || imgSrc}
                                    onError={(e) => {
                                        e.target.src = imgSrc;
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-0.5 pt-4 pb-5 px-4.5">
                                <span className="font-display text-[26px] font-bold leading-[1.1]">{t.name}</span>
                                <span className="text-[15px] text-(--ink-soft)">{t.fields.join(", ")}</span>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </div>
    );
}