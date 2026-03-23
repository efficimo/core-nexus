export interface ArchitectSkill {
  skillId: string;
  level: number;
}

export interface Architect {
  id: string;
  name: string;
  pseudo: string;
  email: string;
  title: string;
  class: string;
  level: number;
  avatar: string;
  skills: ArchitectSkill[];
  quote: string;
  lore: string;
}
