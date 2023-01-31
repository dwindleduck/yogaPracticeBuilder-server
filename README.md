# Yoga Practice Builder

Collect postures that you know and use them to build a yoga sequence.
This app is meant to help students build a home practice and to be used by teachers to construct sequences for class.

## Technologies Used
- JavaScript
- Node.js
- Express
- Mongoose, MongoDb
- Heroku, MongoDb Atlas

## ERD 
![ERD](link to ERD image)

## Routes Table

| NAME    |         PATH         | HTTP VERB |        PURPOSE              |
| :---    |    :----             |   :---:   |        :----                |
| Sign Up | /sign-up             | POST      | Register new account        |
| Sign In | /sign-in             | POST      | Sign in user                |
| Show    | /student             | GET       | Show user info              |
| Index   | /postures            | GET       | List all postures           |
| Show    | /postures/:id        | GET       | Show posture by ID          |
| Show    | /known               | GET       | Show user's known postures  |
| Update  | /student/updateKnown | PATCH     | Update known postures       |
| Index   | /practices           | GET       | List all practices          |
| Show    | /practices/:id       | GET       | Show practice by ID         |
| Index   | /built               | GET       | Show user's built practices |
| Create  | /practices           | POST      | Create new practice         |
| Update  | /practices/:id       | PATCH     | Update practice by ID       |
| Delete  | /practices/:id       | DELETE    | Delete practice by ID       |