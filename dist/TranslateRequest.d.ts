import { RandomTranslation } from "./types";
declare class TranslateRequest {
  private projectId;
  constructor(projectId: string);
  getRandomTranslation(message: string): Promise<RandomTranslation>;
}
export default TranslateRequest;
