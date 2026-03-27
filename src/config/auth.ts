export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "5d" as const,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: "15d" as const,
  },
};
