import { TrainersData } from "../../data/Trainers";

export const Trainers = () => {
    return (
        <div id="trainers" class="w-full flex justify-center py-(--section-gap) bg-(--bg-secondary)">
            <div className="w-full flex flex-col items-start gap-4 mt-(--section-gap) max-w-(--max-w) px-(--gutter) trainers-wrapper">
                <h2 className="font-bold text-[clamp(34px, 5vw, 48px)] text-(--ink)">Trained For Toughness</h2>
                <p className="max-w-[62ch] text-[18px] text-(--ink-soft) mb-4">Our experienced team of trainers are here to ensure your physical growth and safety in the studio, so
                    that
                    you can put as much effort as you can, to be the best you that you can be</p>
                <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5.5 trainer-cards">
                    {TrainersData.map((t) => (
                        <div class="card">
                            <div class="card-img">
                                <img class="trainer-img" alt="trainer image" src={t.img} />
                            </div>
                            <div class="card-content">
                                <span class="trainer-name">{t.name}</span>
                                <span class="trainer-field">{t.fields.join(", ")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}