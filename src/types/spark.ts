export interface Spark {
  id: string;
  name: string;
  description: string;
  status: "idea" | "in-progress" | "done";
  tags: string[];
  authors: string[];
}
