require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())


let refreshTokens = []

const ACCESS_TOKEN_SECRET = 'ed8b8ef103069e067c0970af7e1646eeb91700c4da9a6f5476b4a47ab6bd1082c1c39f51d664e165baa15004387c0dc8a6958dc85f09572cde5441bbacb07cb7';
const REFRESH_TOKEN_SECRET = '7785422c96e77bc96c340389361ac04024e3f9dec829769eceb99049ed711fba950375280c3aa019947a02a528f47aeb92b913cf6dbc7cc595f54f80873dd6fd';

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  
  return res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '60m' })
}

app.listen(4000)