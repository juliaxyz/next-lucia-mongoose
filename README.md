This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

Next.js 14 & Lucia auth template using MongoDB & MongodbAdapter with Mongoose. Includes middleware for protected routes and nodemailer for mailing otp verification codes. User registers, receives an email verification code, can enter the code into an OTP form and is then redirected to the login page. Session attributes include data from "profile" model.ie. name, profile avatar, etc. After logging in, the user is redirected to their profile.

Note: When a user registers in this app it automatically creates a unique username based on the first and last name.

## Getting Started

- Clone or download the package
- From inside the root folder of the application, install the package
- ie: using npm or yarn

```bash
npm install
# or
yarn
```

### Database Setup:

- Install MongoDB on your server or use MongoDB Atlas:
  - [Manual Installation](https://www.mongodb.com/docs/manual/installation/)
  - [MongoDB Documentation](https://www.mongodb.com/docs/) - MongoDB Atlas is a hosted MongoDB service option in the cloud which requires no installation overhead and offers a free tier to get started.
- Rename .env.sample and add the correct connection string for your database. For more information on the .env files take a look at [Configuring Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

  - local server example, where "database" is the name of the database you want to connect to and 27017 is the port.

    ```
    mongodb://localhost:27017/<database>
    ```

  - MongoDB Atlas example string will be something like this:

    ```
    mongodb+srv://myDatabaseUser:myPassword@cluster0.example.mongodb.net/?retryWrites=true&w=majority
    ```

### Nodemailer Setup:

- Add your email credentials to the .env file, similar to this example:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<MyCredentails>
SMTP_PASSWORD=<Password>
SMTP_FROM=<me@mydomain>
```

### Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Lucia

Lucia is an open source auth library that abstracts away the complexity of handling sessions. It works alongside your database to provide an API that's easy to use, understand, and extend.

- [Lucia Documentation](http://lucia-auth.com) - learn about Lucia.

## To Do:

- Finish "resend verification code request" feature
- Add "forgot password" feature
- Add "onboarding/settings page

## Dependencies

- Next.js 14
  - Tailwind Css
  - middleware
- MongoDB
- Mongoose
- Lucia
  - oslo
  - MongodbAdapter
- shadcn/ui
  - React Hook Form
  - Zod
- Nodemailer
