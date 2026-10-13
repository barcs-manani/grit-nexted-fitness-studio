export const Hero = () => {
    return (
        <div id="hero" class="hero-cntr">
            <div class="hero-wrapper">
                <nav id="hero-nav" class="hero-nav">
                    <span class="logo-cntr">
                        <span id="logo" class="logo hero-nav-logo">GR<span class="logo-i">I</span>T</span>
                        <span id="logo-text" class="logo-text">Fitness Studio</span>
                    </span>
                    <ul class="hero-nav-menu">
                        <li><a href="#hero">Home</a></li>
                        <li><a href="#schedule">Schedule</a></li>
                        <li><a href="#trainers">Trainers</a></li>
                        <li><a href="#member-tiers">Pricing</a></li>
                    </ul>
                </nav>
                <div class="hero-content">
                    <h1><span>G</span>reatness <span>R</span>equires <span>I</span>nternal <span>T</span>oughness</h1>
                    <p>Build Strength, Grow Endurance and Enjoy Longevity</p>
                    <a id="hero-btn" href="#schedule" class="hero-btn">Get Started</a>
                </div>
            </div>
        </div>
    );
}