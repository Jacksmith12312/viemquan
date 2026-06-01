export interface AboutData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  major?: string;
  hobbies?: string;
  learningGoals?: string;
  portfolioGoals?: string;
  conclusionExperience?: string;
  conclusionKnowledge?: string;
  conclusionTakeaways?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: string; // e.g. "Beginner", "Intermediate", "Expert"
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string; // e.g. "2023 - Present"
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  tags: string[];
  objective?: string;
  process?: string;
  productLink?: string;
  productType?: string;
}

export interface MessageItem {
  id: string;
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface CVData {
  about: AboutData;
  skills: SkillItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
}

