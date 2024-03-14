# Install
1. Install Dependencies
```
$ npm install
```
2. Setup Environment Variables
```
$ cp .env.example .env
```

# Usage
```
npm start
```

# API

## Users

**POST** api/v1/users {email, password}
Register a new user.

## Authentication

**POST** api/v1/authenticate {email, password} => {access_token}, Cookie: refresh_token
Login a user

**POST** api/v1/refresh_authentication Cookie: refresh_token => {access_token}
Refresh an access token
