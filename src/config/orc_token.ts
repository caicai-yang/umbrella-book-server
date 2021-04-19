import axios from 'axios'
import https from 'https'
const API_KEY = 'phyR6e5GBhzGqFNvRmsOtl13'
const SECRET_KEY = 'szzgLxAorDGOUcvXetAKV0pOgk2H3n8m'
async function getOrcToken() {
  const res = await axios.post('https://aip.baidubce.com/oauth/2.0/token', {
    grant_type: 'client_credentials',
    client_id: `${API_KEY}`,
    client_secret: `${SECRET_KEY}`
  })
  return res
}

export default getOrcToken