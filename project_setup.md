
---
# Setting up the front-end
- Go to frontend
- run `npm install or npm i`
- If still the dependencies don't install run `npm install --force`
- run `npm start` to start the **frontend**
### Things to set-up before
- To run this project, you will need to add a .env file in frontend
```bash 
./frontend/.env
 ```
``.env data``
```bash
REACT_APP_BACKEND_URL = 'http://localhost:4000'
```
----
# Setting up the back-end
- Go to back-end
- run `npm install or npm i`
- If still the dependencies don't install run `npm install --force`
- run `npm run dev` to start the **backend**
  
### Things to set-up before
**MONGO DB FILE**

- Upload `Farmhub/products.json` file in your mongodb Ecommerce section that will be created as you start the project
As there will be produt you can see for better understanding

### Environment Variables
- To run this project, you will need to add a .env file in backend
```bash 
./backend/.env
 ```
`.env data`
```bash
PORT=4000

MONGODB_URL= mongodb://localhost:27017

FRONTEND_URL='http://localhost:3000'


ACCOUNT_SID =ACc1f7afcb67f26ed515dd435abbcf50fb

AUTH_TOKEN =c3876c8b29e8b69264b2d41b553f839c

STRIPE_API_KEY = <YOUR API KEY>

STRIPE_SECRET_KEY = <YOUR API KEY>
```

#### Get all items

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `STRIPE_API_KEY `  | `string` | **Required**.- From Stripe Api Site  for payment processors|
|`STRIPE_SECRET_KEY `| `string` |**Required**.- From Stripe Api Site for payment processors|