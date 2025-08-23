import axios from "axios"

function getToken() {
  const cname = "token"
  if (typeof window !== "undefined") {
    const name = cname + "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == " ") {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  }
  return ""
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BASE_URL
console.log(baseURL)
const http = axios.create({
  baseURL: baseURL + `/api`,
  timeout: 30000
})

http.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default http
