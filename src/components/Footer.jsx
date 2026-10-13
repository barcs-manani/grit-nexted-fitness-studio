export const Footer = () => {
    return (
        <div id="footer" className="w-full mt-(--section-gap) flex justify-center pt-14 pb-7 px-(--gutter) bg-(--ink) text-white opacity-75">
            <div className="w-full max-w-(--max-w) flex flex-col gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="footer-about-us">
                        <h2 className="mb-3.5 text-[30px] text-white">About GRIT</h2>
                        <p>From the lorem to the ipsum, how do I describe an awesome fitness website. Just super KOOOOL!</p>
                    </div>
                    <div className="footer-branches">
                        <h2 className="mb-3.5 text-[30px] text-white">Where to Find Us</h2>
                        <ul className="list-none flex flex-col gap-1.5">
                            <li>- Berlin, Germany</li>
                            <li>- London, United Kingdom</li>
                            <li>- New York, USA</li>
                        </ul>
                    </div>
                    <div className="footer-contacts">
                        <h2 className="mb-3.5 text-[30px] text-white">Contacts</h2>
                        <ul className="list-none flex flex-col gap-1.5">
                            <li><a href="#" className="text-(--ice) no-underline hover:text-white hover:underline">Facebook</a></li>
                            <li><a href="#" className="text-(--ice) no-underline hover:text-white hover:underline">X</a></li>
                            <li><a href="#" className="text-(--ice) no-underline hover:text-white hover:underline">Pinterest</a></li>
                            <li><a href="#" className="text-(--ice) no-underline hover:text-white hover:underline">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>
                <p className="pt-5.5 border-t border-[rgba(255, 255, 255, 0.14)] text-center text-[15px] text-white opacity-55">&copy; 2026 - GRIT Fitness Studio</p>
            </div>
        </div>
    );
}