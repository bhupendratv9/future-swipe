export type Swipe = {
  id: number;
  step: string;
  title: string;
  asset: "swipe-right" | "swipe-left";
  desc: string;
  type: string;
};