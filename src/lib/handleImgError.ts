export const handleImgError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallback = "https://placehold.net/building.svg"
) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
};