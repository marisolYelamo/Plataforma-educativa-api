export interface IBCForm {
  [key: string]: string;
  bc_motivation: string;
  current_study: string;
  current_work: string;
  current_work_modality: string;
  current_work_role: string;
  group_working_situation: string;
  highest_study_level: string;
  is_studying: string;
  is_working: string;
  p5_previous_course: string;
  payment_plan: "contado" | "diferido" | "full_diferido";
  problem_solving_case: string;
  studies: string;
  english_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  has_experience: "ninguno" | "0-2 años" | "2-5 años" | "mas de 5 años";
  last_job: string;
  last_industry: string;
}

export const revenueByPaymentPlan: {
  [key in IBCForm["payment_plan"]]: number;
} = {
  contado: 2900,
  diferido: 600,
  full_diferido: 0
};

export const QuestionKeys: { [key in keyof IBCForm]: string } = {
  english_level: "¿Qué nivel de ingles tenés?",
  has_experience: "Años de experiencia laboral",
  last_job: "¿Cual fue tu último puesto de trabajo?",
  last_industry: "¿En qué rubro?",
  payment_plan: "¿A qué Plan de Pagos estás aplicando?",
  highest_study_level: "Máximo nivel de estudio alcanzado",
  studies: "¿Qué estudiaste?",
  p5_previous_course: "¿Hiciste algún curso con nosotros?",
  is_studying: "¿Estás estudiando actualmente?",
  current_study: "¿Que estás estudiando?",
  is_working: "¿Estás trabajando actualmente?",
  current_work_modality: "¿Qué modalidad de trabajo?",
  current_work: "¿En qué rubro estás trabajando actualmente?",
  current_work_role: "¿Cuál es tu rol actual en tu empresa/organización?",
  bc_motivation: "¿Qué te motiva a hacer el Coding Bootcamp?",
  problem_solving_case:
    "Contanos alguna situación real en la que hayas logrado resolver un problema o desafío y cómo lo hiciste.",
  group_working_situation:
    "Contanos una situación real de trabajo grupal y cómo resultó.",
  reference: "¿Cómo conociste a Plataforma 5?",
  reference_desc: "Referencia (otro)"
};
