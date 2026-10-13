export const Schedule = () => {
    return (
        <div id="schedule" class="container schedule-cntr">
            <h2>Scheduled For Greatness</h2>
            <div class="schedule-wrapper">
                <div class="schedule-wrap-child-01">
                    <p>Our training times are customized to fit your 9-to-5 work schedule, with weekends designated for
                        intense-level training</p>
                    <div class="cards-cntr schedule-cards">
                        <div class="card">
                            <h3 class="card-title">Weekdays</h3>
                            <ul class="card-content">
                                <li>6:00 AM to 8:00 AM</li>
                                <li>5:00 PM to 7:00 PM</li>
                            </ul>
                        </div>
                        <div class="card">
                            <h3 class="card-title">Weekends & Public Holidays</h3>
                            <ul class="card-content">
                                <li>6:00 AM to 8:00 AM</li>
                                <li>10:00 AM to 12:00 PM</li>
                                <li>3:00 AM to 7:00 PM</li>
                            </ul>
                        </div>
                        <div class="card">
                            <h3 class="card-title">Custom</h3>
                            <ul class="card-content">
                                <li>Get a personalized schedule just for you</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="schedule-wrap-child-02">
                    <img alt="schedule section image" src="./assets/images/schedule-img.png" />
                </div>
            </div>
        </div>
    );
}