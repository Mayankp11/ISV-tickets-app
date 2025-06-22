import axios from 'axios'

const api = axios.create({
  baseURL: 'https://your-api-url.com/dev', // Replace this
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
