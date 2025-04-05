export enum UserType {
  ADMIN = "ADMIN",
  TRAINER = "TRAINER",
  ATHLETE = "ATHLETE",
}

export enum MetricUnits {
  SECONDS = "SECONDS",
  METERS = "METERS",
  POINTS = "POINTS",
}

export enum DisciplineCategories {
  COORDINATION = "COORDINATION",
  ENDURANCE = "ENDURANCE",
  SPEED = "SPEED",
  STRENGTH = "STRENGTH",
}

export enum Medals {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
  NONE = "NONE",
}

export enum Genders {
  d = "DIVERSE",
  w = "FEMALE",
  m = "MALE",
}

export enum AthleteValidityState {
  VALID,
  UPLOADED,
  FAILED,
  LOADING,
}
