const RegistrationModal = ({
    open,
    onClose,
    regData
}) => {
    if (!open || !regData) return null;
    return (
        <div className="fixed top-0 left-0 bottom-0 w-full z-(--z-modal-backdrop) bg-(--ink) opacity-75 flex justify-center items-center">
            <div className="z-(--z-modal) bg-(--bg) sm:rounded-(--card-radius) shadow-sm overflow-hidden flex flex-col justify-between w-full sm:w-[90vw] xl:w-150 h-screen sm:h-[80vh] xl:h-150">
                {/* Header */}
                <div className="flex justify-between p-4 text-2xl">
                    <span>{regData.type}</span>
                    <button
                        className="w-2 h-2 bg-(--bg) hover:shadow-xl rounded-full cursor-pointer font-extrabold"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>
                {/* Fields */}
                {/* Footer */}
            </div>
        </div>
    );
};

export { RegistrationModal }