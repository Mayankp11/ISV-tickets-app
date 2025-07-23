// types/ticket.ts

export interface Book {
  name: string;
  price: number;
  quantity: number;
}

export interface Ticket {
  name: string;
  phone?: string;
  email?: string;
  books: Book[];
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  books?: string;
}

export interface BookOption {
  label: string;
  value: string;
  price: number;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

export interface Theme {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  input: string;
  inputBorder: string;
  button: string;
  buttonHover: string;
  error: string;
  success: string;
}