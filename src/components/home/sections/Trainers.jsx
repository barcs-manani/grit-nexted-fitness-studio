"use client"

import { useState } from "react";
import { TrainersData } from "@/data/Trainers";
import { Filters } from "@/components/shared/Filters";
import { trainerMan, trainerWoman } from "@/assets/images";
import Image from "next/image";
import { useBaseData } from "@/contexts/BaseDataContext";

function TrainerCard({ trainer }) {
    const fallBackImgSrc = trainer?.gender === "male" ? trainerMan : trainerWoman;
    const [useFallBackImgSrc, setUseFallBackImgSrc] = useState(false);
    const imgSrc = useFallBackImgSrc ? fallBackImgSrc : trainer.img || fallBackImgSrc;
    return (
        <div key={trainer.id} className="rounded-(--card-radius) overflow-hidden bg-white border border-(--line) transition-all duration-150 ease-in-out hover:-translate-y-1.5 hover:shadow-xl">
            <div className="bg-(--ice)">
                <Image
                    className="block w-full aspect-4/5 object-cover"
                    alt={`Portrait of ${trainer.name}`}
                    src={imgSrc}
                    width={500}
                    height={625}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 25vw, 300px"
                    onError={() => {
                        if (!useFallBackImgSrc) setUseFallBackImgSrc(true);
                    }}
                />
            </div>
            <div className="flex flex-col gap-0.5 pt-4 pb-5 px-4.5">
                <span className="font-display text-[26px] font-bold leading-[1.1]">{trainer.name}</span>
                <span className="text-[15px] text-(--ink-soft)">{trainer.fields.join(", ")}</span>
            </div>
        </div>
    );
}

const defField = { city: "all" };

export const Trainers = () => {
    const { branchLocations } = useBaseData();
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filteredTrainers, setFilteredTrainers] = useState(
        Array.isArray(TrainersData)
            ? TrainersData
            : []
    );
    const filterFields = (
        Array.isArray(branchLocations)
            ? [defField, ...branchLocations]
            : []
    ).map((b) => b.city);

    const handleSelectFilterItem = (selected) => {
        const trainers = Array.isArray(TrainersData)
            ? TrainersData
            : [];
        const res = selected.includes(defField.city)
            ? trainers
            : TrainersData.filter((t) => selected.includes(t.location));
        setSelectedFilters(selected);
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
                    selected={selectedFilters}
                    fields={filterFields}
                    setSelected={handleSelectFilterItem}
                    xPosition="right"
                />
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5.5">
                    {filteredTrainers.map((t) => (
                        <TrainerCard key={t.id} trainer={t} />
                    ))}
                </div>
            </div>
        </div>
    );
}