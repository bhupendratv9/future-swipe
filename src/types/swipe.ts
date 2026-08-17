export interface SwipePayload {
    lang: string;
}

export interface SwipeCardData {
    id: number;
    photo: string;
    questions: string;

}
export interface SubmitSwipePayload {
    session_id: string;
    swipes: {
        card_id: string;
        action: "like" | "dislike";

    }[];

}