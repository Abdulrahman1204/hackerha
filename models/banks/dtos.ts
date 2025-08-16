import { Document } from "mongoose";

export interface IBanks extends Document {
  image: string;
  title: string;
  year: number;
  semester: number;
  free: true;
}
