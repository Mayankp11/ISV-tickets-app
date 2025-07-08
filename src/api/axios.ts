import axios from 'axios'

const api = axios.create({
  baseURL: 'https://6xaju8olaf.execute-api.us-west-2.amazonaws.com/dev', // Replace this
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
