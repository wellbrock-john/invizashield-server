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
- - * phone_num (integer)
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
- - * phone_num (integer)
- - * email 
- - Output
- - * first_name
- - * last_name
- - * phone_num (integer)
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