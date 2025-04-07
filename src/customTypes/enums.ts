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

export enum AthleteExportColumn {
  FirstName = "first_name",
  LastName = "last_name",
  Email = "email",
  Birthdate = "birthdate",
  Gender = "gender",
}

export enum AthletePerformanceExportColumn {
  FirstName = "first_name",
  LastName = "last_name",
  Gender = "gender",
  Birthyear = "birthyear",
  Birthday = "birthday",
  Discipline = "discipline",
  Category = "category",
  Date = "date",
  Result = "result",
  Points = "points",
}
