import { DisciplineCategories, Genders, MetricUnits } from "./enums";

export interface Athlete {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  gender?: Genders;
}

export interface UserEntity {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: UserType;
}

export interface JwtTokenBody {
  aud: string; // audience claim
  exp: number; // expiration time claim
  iat: number; // issued at claim
  sub: string; // subject claim
  users: UserEntity[] | null;
  tokenType: "IDENTITY_TOKEN" | "REFRESH_TOKEN";
}

export interface Discipline {
  id: number;
  name: string;
  category: DisciplineCategories;
  description: string | null;
  unit: MetricUnits;
  is_more_better: boolean;
}

export interface RatingMetric {
  bronze_rating: number;
  silver_rating: number;
  gold_rating: number;
}

export interface DisciplineRatingMetric {
  id: number;
  discipline: Discipline;
  start_age: number;
  end_age: number;
  valid_in: number;
  rating_male: RatingMetric;
  rating_female: RatingMetric;
}

export interface Trainer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PerformanceRecording {
  id: number;
  athlete_id: number;
  discipline_rating_metric: DisciplineRatingMetric;
  rating_value: number;
  date_of_performance: string;
  athlete: Athlete;
}

export interface PerformanceRecordingCreationDto {
  athlete_id: number;
  rating_value: number;
  discipline_id: number;
  date_of_performance: number;
}

export interface AgeRange {
  label: string;
  min: number;
  max: number;
}
