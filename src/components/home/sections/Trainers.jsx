"use client"

import { useState, useEffect, useMemo } from "react";
import { Filters } from "@/components/shared/Filters";
import Image from "next/image";
import { useBaseData } from "@/contexts/BaseDataContext";
import { toTitleCase } from "@/lib/formatters";

const trainerMan = "https://res.cloudinary.com/pnpyoljr/image/upload/v1792782474/fitness-man-noID.png";
const trainerWoman = "https://res.cloudinary.com/pnpyoljr/image/upload/v1792782475/fitness-woman-noID.png";

function TrainerCard({ trainer }) {
    const fallBackImgURL = trainer?.gender === "male" ? trainerMan : trainerWoman;
    const [useFallBackImgURL, setUseFallBackImgURL] = useState(false);
    const imgURL = useFallBackImgURL ? fallBackImgURL : trainer.imageURL || fallBackImgURL;
    const fitnessFields = trainer.fitnessFields.map((field) => toTitleCase(field.name));
    return (
        <div key={trainer.id} className="rounded-(--card-radius) overflow-hidden bg-white border border-(--line) transition-all duration-150 ease-in-out hover:-translate-y-1.5 hover:shadow-xl">
            <div className="bg-(--ice)">
                <Image
                    className="block w-full aspect-4/5 object-cover"
                    alt={`Portrait of ${trainer.fullName}`}
                    src={imgURL}
                    width={500}
                    height={625}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 25vw, 300px"
                    onError={() => {
                        if (!useFallBackImgURL) setUseFallBackImgURL(true);
                    }}
                />
            </div>
            <div className="flex flex-col gap-0.5 pt-4 pb-5 px-4.5">
                <span className="font-display text-[26px] font-bold leading-[1.1]">{trainer.fullName}</span>
                <span className="text-[15px] text-(--ink-soft)">{fitnessFields.join(", ")}</span>
            </div>
        </div>
    );
}

export const Trainers = () => {
    const { branchLocations } = useBaseData();
    const [trainers, setTrainers] = useState([]);
    const [error, setError] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const filterFields = useMemo(() => ((
        Array.isArray(branchLocations)
            ? branchLocations
            : []
    ).map((b) => b.city)
    ), [branchLocations]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadTrainers() {
            try {
                const response = await fetch(
                    "/api/trainers",
                    {
                        signal: controller.signal,
                        cache: "no-store",
                    }
                );
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Could not load trainers.");
                setTrainers(result);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError(err.message || "Could not load trainers.");
                }
            }
        }
        loadTrainers();
        return () => controller.abort();
    }, []);

    const filteredTrainers = useMemo(() => {
        return (trainers || []).filter((t) => (
            selectedFilters.length
                ? selectedFilters.includes(t.branch.city)
                : true
        ));
    }, [trainers, selectedFilters]);

    const hasTrainers = filteredTrainers.length > 0;

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
                    setSelected={setSelectedFilters}
                    xPosition="right"
                />
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5.5">
                    {error && (
                        <div className="col-span-1 sm:col-span-2 md:col-span-4 w-full flex flex-col items-center justify-center h-40 gap-3 p-2">
                            {error}. Try again later.
                        </div>
                    )}
                    {filteredTrainers.map((t) => (
                        <TrainerCard key={t.id} trainer={t} />
                    ))}
                    {!hasTrainers && (
                        <p className="text-(--ink-soft) col-span-1 sm:col-span-2 md:col-span-4 w-full flex justify-center">
                            No trainers match those locations. Clear a filter.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}