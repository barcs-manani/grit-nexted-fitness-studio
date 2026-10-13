export const Trainers = () => {
    return (
        <div id="trainers" class="trainers-cntr">
            <div className="w-full flex flex-col items-start gap-4 mt-(--section-gap) max-w-(--max-w) px-(--gutter) trainers-wrapper">
                <h2 className="font-bold text-[clamp(34px, 5vw, 48px)] text-(--ink)">Trained For Toughness</h2>
                <p className="max-w-[62ch] text-[18px] text-(--ink-soft)">Our experienced team of trainers are here to ensure your physical growth and safety in the studio, so
                    that
                    you can put as much effort as you can, to be the best you that you can be</p>
                <div class="w-full grid trainer-cards">
                    <div class="card">
                        <div class="card-img">
                            <img class="trainer-img" alt="trainer image" src="./assets/images/gym-man.png" />
                        </div>
                        <div class="card-content">
                            <span class="trainer-name">James Peck</span>
                            <span class="trainer-field">Calisthenics Trainer</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-img">
                            <img class="trainer-img" alt="trainer image" src="./assets/images/gym-man-02.png" />
                        </div>
                        <div class="card-content">
                            <span class="trainer-name">Winnie Bend</span>
                            <span class="trainer-field">Strength and Endurance Coach</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-img">
                            <img class="trainer-img" alt="trainer image" src="./assets/images/gym-man-03.png" />
                        </div>
                        <div class="card-content">
                            <span class="trainer-name">John Strong</span>
                            <span class="trainer-field">Boxing Coach</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-img">
                            <img class="trainer-img" alt="trainer image" src="./assets/images/gym-man-04.png" />
                        </div>
                        <div class="card-content">
                            <span class="trainer-name">Andrew Fit</span>
                            <span class="trainer-field">Dance & Yoga Instructor</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}