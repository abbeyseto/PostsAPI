# **PostsAPI BACKEND**

This repository presents to you a RESTful API that mimmicks the posts functionality of a social media platform.
### **Features**
This API supports the following functionalities:

- Registration & login with email & password
- Authentication with JWT
- Send an email to a user after registration
- Password reset
- Publish a post
- Fetch a post
- Delete a post
- Edit a post
- Like & undo post like ??
- Reply to a post

> Note: A user is also be able to upload images to posts and replies

## **Documentation**

Documentation for this endpoints can be viewed here:

https://documenter.getpostman.com/view/4874547/TzY3DGLk

This documentation shows how this project can be implenmented on the frontend with examples codes.

## **Installation**

Clone this repository on your local machine by usig the `git clone` command

```
git clone https://github.com/abbeyseto/PostsAPI.git
```
Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Dependencies
Dependencies have been configured in the pakage.json file at the root of the project's folder.

Run `npm i` to install the project dependencies

### **Configurations**
This project uses the following tool and can be configured:
- PostgreSQL Database
- Express
- Strapi Headless CMS
- Mailgun

The only ones you will need to configure are the **PostgreSQL database**  and **Mailgun** Email provider service

> !WARNINGS

You will see this error below if you are using a sandbox mailgun environment.


> **Sandbox domains are for test purposes only. Please add your own domain or add the address to authorized recipients in Account settings.**

To avoid this error, please use a verified domain mailgun environment. 

This ensures that emails are delivered for confirmation of email adresses and for the test cases to pass.
 

### **Keys and Credentials**
After setting up your postgreSQL database and Mailgun, you will need to store the credentials to a place where this apllication can access it.

A quick way is to create a `.env` file at the root directory of the projects folder and add the following keys to the file

```
MAILGUN_API_KEY=XXXXXXXXXXX 
MAILGUN_DOMAIN=XXXXXXXXXXX  
EMAIL_FROM=XXXXXXXXXXX
EMAIL_REPLY_TO=XXXXXXXXXXX
DATABASE_HOST=XXXXXXXXXXX
DATABASE_PORT=XXXXXXXXXXX
DATABASE_NAME=XXXXXXXXXXX
DATABASE_USERNAME=XXXXXXXXXXX
DATABASE_PASSWORD=XXXXXXXXXXX
DATABASE_SSL= false
```


> Note MAILGUN_DOMAIN => Domain in your mailgun accout that routes emails in the format mailgun.domain.com.

> EMAIL_FROM is your mailgun domain email

> EMAIL_REPLY_TO is the email you want users to reply to which could be thesame as your mailgun domain email


## Local Deployment

To deploy the project locally, you will run the following command on your terminal

```bash
npm run develop
```

This command will do a couple of things
- Start bootstrap scripts that configures roles i.e Authenticated and Public
- Set permissions for the autenticated users on each of the required endpoints


## **Endpoint Testing**

To test the endpoints, i have added a postman collection to the root folder of this repository. 

The file name is `PostsAPI.postman_collection.json`

Import it into a postman application and use it to test the application.

You also need to import the environmental variables and set it as your current active environment. 

The file name  is `PostsAPI.postman_environment.json`

Environmental variables will added to the collect for easy testing.

For example, when you call an endpoint and it returns a JWT token, this token is automatically stored in the environmental variables and you can continue to make authenticated request.

## Integration and unit Tests

Test cases has been written to test a few of these endpoints. To run the test cases, simple go to the root of the folder, open your terminal and run:

```
npm run tests
```
This test suites creates a separate database file using sqlite3 and terminates the database anfter the tests are done.

## Author

Adenle Abiodun
