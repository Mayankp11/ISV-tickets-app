export interface Ticket {
  name: string
  email: string
  phone?: string
  books: string[]
  bookPrices: {
    [book: string]: number
  }
  date: string
  time: string
}
