import { Relate } from "@/app/interfaces/relate";
import { Source } from "@/app/interfaces/source";

export interface LocalHistory {
  markdown: string;
  relates: Relate[];
  sources: Source[];
  rid: string;
  query: string;
  timestamp: number;
}
