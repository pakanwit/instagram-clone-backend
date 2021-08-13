import express, { Application, Request, Response } from 'express'

const app: Application = express()

const PORT: number = 5000

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
