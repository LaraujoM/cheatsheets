export interface Command {
  name: string;
  command: string;
  description: string;
  tags?: string[];
}

export interface Category {
  category: string;
  icon: string;
  description: string;
  commands: Command[];
}
