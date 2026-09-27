export type ApplicationStatus = "pending" | "approved" | "declined"

export const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const
export type ShirtSize = (typeof shirtSizes)[number]

export type Application = {
  id: string
  name: string
  nickname: string
  place: string
  shirtSize: ShirtSize
  note: string
  status: ApplicationStatus
  createdAt: string
}
