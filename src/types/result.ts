export interface ResultPayload {
  session_id: string;
  lang?: string;
}
export interface SessionPayload {
  session_id: string;
  lang?: string;
}

export interface Persona {
  id: number;
  name: string;
  slug: string;
  description: string;
  photo: string;
  industries: string[];
}

export type Scores = Record<string, number>;

export interface Insight {
  id: number;
  name: string;
  title: string;
  image: string;
}
// export interface Course {
//   id: number;
//   fees: number;
//   name: string;
//   avgfees: string;
//   image: string;
//   duration: string;
//   rating: number | null;
//   short_desc: string;
//   university_name: string;
//   university_location: string;
//   eligibility: string,
//   mode: string,
//   why_perfect: string,
//   what_you_learn: string
//   career_path: string
// }

export interface CourseBase {
  id: number;
  fees: number | string;
  name: string;
  avgfees: string;
  image: string;
  duration: string;
  rating: number | null;
  short_desc: string;
  university_name: string;
  university_location: string;
}
export interface ResultCourse extends CourseBase { }

export interface CourseDetail extends CourseBase {
  eligibility: string,
  mode: string,
  what_you_learn: string[];
  why_perfect: string,
  career_path: string[];
  related_universities: CourseBase[]
}

export interface Result {
  personas: Insight[];
  persona: Persona;
  courses: ResultCourse[];
  scores: Scores;
  is_saved?: boolean;
}


export interface ResultResponse {
  data: Result;
}
export interface CourseResponse {
  data: CourseDetail;
}

export interface wishlistPayload {
  persona_id?: string;
  course_id?: string;
}
export interface DegreePayload {
  lang?: string;
  course_id?: string;
  session_id?: string;
}

export interface InsightPayload {
  session_id: string;
  lang?: string;
}
export interface InsightResponse {
  data: {
    insights: Insight[];
    persona: Persona;
    is_saved?: boolean;
    // courses: CourseBase
  };
}

type bestCourse = {
  name: string;
  duration: string;
}

export type InsightData = {
  insights: Insight[];
  persona: Persona;
  bestCourse?: bestCourse[];
};