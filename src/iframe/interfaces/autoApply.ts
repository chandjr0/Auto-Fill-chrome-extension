export interface IAutoApply {
    auth: string;
    job_url: string;
    form_list: any
}

export interface WorkExperience {
    company: string;
    "role/Job title": string;
    "start date (MM/YY)": string;
    "end date (MM/YY)": string;
    expCity: string;
    expState: string;
  }
  
  export interface EducationExperience {
    "degree achieved": string;
    "school name": string;
    "end date (MM/YY)": string;
    eduCity: string;
    eduState: string;
  }
  
  export interface Certification {
    type: string;
    description: string;
    graduationYear: string;
  }