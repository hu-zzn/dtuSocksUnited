export interface User {
  _id: string
  name: string
  email: string
  role: "Admin" | "User"
  accountVerified: boolean
  cart: string[]
  avatar?: {
    public_id: string
    url: string
  }
  createdAt: string
  updatedAt: string
}
