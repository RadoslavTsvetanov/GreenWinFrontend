export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  organizationId?: string | null;
  organizationName?: string | null;
  defaultCloudProviders?: string[] | null;
  defaultRegions?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
  organizationName: string;
};

export type AuthSession = {
  token: string; // access token
  refreshToken: string | null; // refresh token
  user: AuthUser;
};
