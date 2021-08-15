import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dogs from './dogs.json'

interface DogsList {
  breedName?: string
  image?: string
  description?: string
  dogInfo?: {
    height?: string
    weight?: string
    life?: string
    breedGroup?: string
  }
  id?: string
}

const app: Application = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const PORT: number = 5000

const skipPage = (page: number, size: number) => {
  return (page - 1) * size
}

const calcTotalPage = (count: number, size: number) => {
  return Math.ceil(count / size)
}

const search = (query: string = '') => {
  const lowQuery = query.toLowerCase()
  const result = dogs.filter((dog: DogsList) => {
    const breedName = dog.breedName?.toLowerCase() || ''
    const breedGroup = dog.dogInfo?.breedGroup?.toLowerCase() || ''
    return breedName.includes(lowQuery) || breedGroup.includes(lowQuery)

  })
  return { data: result, length: result.length }
}
interface RequestWithPageLimit {
  page?: number
  limit?: number
  search?: string
}

app.post('/dogs', (req: Request<RequestWithPageLimit>, res: Response) => {
  const page = req.body.page || 1
  const limit = req.body.limit || 10
  const query = req.body.search
  let data: DogsList[] = dogs
  let totalData = dogs.length
  if (query) {
    const { data: resultSearch, length } = search(query)
    data = resultSearch
    totalData = length
  }
  data = data.slice(skipPage(page, limit), (limit * page))
  res.json({
    currentPage: page,
    totalPage: calcTotalPage(data.length, limit),
    totalData,
    data
  })
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
