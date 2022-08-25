
## Description

Transactions API 

## Installation

```bash
$ npm install
```

## DB Configuration
- Create emty MySQL DB
- Update your .env file
- run migrations
  ```bash
  $ npm run db:migrate
  ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints
### Registration
POST /sign-up

Request body:
```bash
{
    "user": {
        "username": "user",
        "email": "email@sample.com",
        "password": "your_password"
    }
}
```

### Login
POST /sign-in

Request body:
```bash
{
    "user": {
        "username": "user",
        "password": "your_password"
    }
}
```

### Import transactions CSV
POST /transactions/import

Headers: 
```bash
Authorization: Token <tokendata>
```
Body: 
```bash
files: <file>
```

### Get report by months and sources
GET /transactions/report

Headers: 
```bash
Authorization: Token <tokendata>
```

Response example: 
```bash
[
    {
        "source": "income",
        "data": [
            {
                "date": "01-2021",
                "total": "1000"
            },
            {
                "date": "01-2022",
                "total": "1400"
            },
           ....
        ]
    },
    {
        "source": "other",
        "data": [
            {
                "date": "04-2022",
                "total": "4220"
            },
            ...
        ]
    }
    ...
 ]
```

### Get transactions by user

GET /transactions

Headers: 
```bash
Authorization: Token <tokendata>
```

Res: 
```bash
[
    {
        "id": 103,
        "date": "2020-12-31T22:00:00.000Z",
        "sum": 500,
        "description": "",
        "source": "income",
        "user": {
            "id": 1,
            "username": "alex",
            "email": "ddd@ddd.ccc"
        }
    }
 ...  
]
```









