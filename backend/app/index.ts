import express from 'express'
import {
  menuApi,
  ordersApi,
  productsApi,
  tablesApi,
  userApi
} from "./routes";

const baseApiUrl = '/api/v1'
const app = express();
const port = 8080;

app.use(express.json())

app.use(`${baseApiUrl}/products`, productsApi)
app.use(`${baseApiUrl}/users`, userApi)
app.use(`${baseApiUrl}/menu`, menuApi)
app.use(`${baseApiUrl}/orders`, ordersApi)
app.use(`${baseApiUrl}/tables`, tablesApi)

app.listen(port, () => console.log(`Running on port ${port}`));
