export type Ticket = {
  name: string
  email: string
  phone?: string
  date: string
  time: string
  books: string[]
  bookPrices: Record<string, number>
  totalOverride?: number;
  donation?: number;
}
