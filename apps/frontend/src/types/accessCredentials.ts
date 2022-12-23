export interface AccessCredentials {
  username: string
  accessToken: {
    token: string
    expires: number
  }
  refreshToken: string
}
