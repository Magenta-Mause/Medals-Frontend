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

export interface Trainer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
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
