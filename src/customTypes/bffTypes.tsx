export interface Athlete {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  gender: string;
  total_medal: MedalType;
  swimming_certificate: boolean;
}

export enum MedalType {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
}

export enum UserType {
  ADMIN = "ADMIN",
  TRAINER = "TRAINER",
  ATHLETE = "ATHLETE",
}

export interface UserEntity {
  id: number;
  first_name: string;
  last_name: string;
  type: UserType;
}

export interface JwtTokenBody {
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  users: UserEntity[] | null;
  tokenType: "IDENTITY_TOKEN" | "REFRESH_TOKEN";
}
