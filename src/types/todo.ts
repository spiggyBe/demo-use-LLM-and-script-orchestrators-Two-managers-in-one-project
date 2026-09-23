export type Priority = "low" | "medium" | "high";

export type Category = "praca" | "dom" | "nauka" | "inne";

export type Filter = "all" | "active" | "completed";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

export type NewTodoInput = Pick<
  Todo,
  "title" | "description" | "priority" | "category" | "dueDate"
>;
