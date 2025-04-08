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
  DIVERSE = "DIVERSE",
  FEMALE = "FEMALE",
  MALE = "MALE",
}

export enum AthleteValidityState {
  VALID,
  UPLOADED,
  FAILED,
  LOADING,
}

export enum SwimmingCertificateType {
  ENDURANCE = "ENDURANCE", // Fully continuous swim (distance & time; bronze time not mandatory)
  SPRINT = "SPRINT", // 25m swim within the bronze-required time (or better)
  JUNIOR = "JUNIOR", // Under 12: 50m continuous without a time limit
  SENIOR = "SENIOR", // 12 or older: 200m in max 11 minutes continuously
  SUSTAINED = "SUSTAINED", // 15-minute continuous swim (open water possible, clear movement required)
  CLOTHED = "CLOTHED", // 100m clothed swim in max 4 minutes with in-water undressing
  BADGES = "BADGES", // Submission of recognized swim badges
}
