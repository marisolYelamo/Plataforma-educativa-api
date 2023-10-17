export interface IPayment {
  id?: number;
  userId?: number;
  amount: number;
  currency: string;
  discount?: number;
  course: "Intro" | "ATR";
}
