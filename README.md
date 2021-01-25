# InvizaShield

## This application will stand as a gift to my father to be used for his business, Invizashield LLC, and serve as a grand gesture of appreciation and gratitude for his support thorugh this transitional period of my life going from 'shop boy' to Software Engineer. The goal of building this application was to create a website that brings Invizashield's online presence into a higher class. It was built with the styling intentions to deliver information to clients that will catch the eye and provide persuasive bits of information to earn business. User account creation allows for streamlined communications between my father and his client's and email components built into the site also allow for quick messaging from clients directly to my father's email.

```
Demo Account Credentials:
email: demo@demo.com
password: P@ssword1234
```

[Live Site](https://invizashield-client.vercel.app/)

[Frontend Repo](https://github.com/wellbrock-john/invizashield-client)

## [Backend Repo](https://github.com/wellbrock-john/invizashield-server)

## API Documentation

---

### Open Endpoints

---

Open endpoints require no Authentication.

### /api/auth
- POST - login a user

- - Inputs 
- - * email
- - * password
- - Outputs
- - * user information
- - * * id
- - * * first_name
- - * * last_name
- - * * phone_num
- - * * email

### /api/users
- POST - create/register a new user
- - Input
- - * first_name
- - * last_name
- - * phone_num
- - * email
- - * password 
- - Output
- - * identicle to the above output for POST to /api/auth

### /api/contact
- POST - send email to business owner
- - Input 
- - * name
- - * email
- - * message
- - Output 
- - * To destination email
- - * * name
- - * * email
- - * * message
- -  returns HTTP Status to user

---

### Endpoints that require Authentication

---

Closed endpoints require a valid Token to be included in the header of the request. A Token can be acquired from POSTing a new user or POSTing a login as an existing user.

### /api/users/:id
- PUT - edit user information
- - Input
- - * first_name
- - * last_name
- - * phone_num 
- - * email 
- - Output
- - * first_name
- - * last_name
- - * phone_num
- - * email

### /api/vehicles
- GET - get vehicles by user
- - Input
- - * id (user)
- - * email
- - * phone_num
- - Output
- - * user's vehicles
- - * * id
- - * * year
- - * * make
- - * * model
- - * * submodel
- - * * color
- - * * paintCondition
- - * * coverage
- POST - save vehicles for a user
- - Input
- - * vehicle information
- - * * id
- - * * year
- - * * make
- - * * model
- - * * submodel
- - * * color
- - * * paintCondition
- - * * coverage
- - * user information
- - * * id (user)
- - * * first_name
- - * * last_name
- - * * email
- - * * phone_num
- - Output
- - * user's vehicles
- - * * id
- - * * year
- - * * make
- - * * model
- - * * submodel
- - * * color
- - * * paintCondition
- - * * coverage
- PUT - edit vehicles for a user
- - Input
- - * vehicle information
- - * * id
- - * * year
- - * * make
- - * * model
- - * * submodel
- - * * color
- - * * paintCondition
- - * * coverage
### /api/vehicles/:id
- - DELETE - delete a vehicle by id
- - Input
- - * user id
- - * vehicle id
- - Output
- - * Status i.e. 204 | 400 | 500

---

```
Created by @wellbrock-john
```