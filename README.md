## Next Auth Boilerplate

![Next.js Logo](https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg)

It is a Next JS boilerplate which contains authentication using MongoDB database, redux-toolkit, middleware, API routes and more.

It also has a custom theme included by modifying tailwind CSS variables.

This is available for demo at https://next15-auth-boilerplate.vercel.app/

## Why Next JS?

Next.js streamlines web development by offering a full-stack framework. It allows me to build robust front-end UIs and backend APIs within the same project. This simplifies development, reduces complexity, and enhances collaboration. Features like server-side rendering (SSR) and static site generation (SSG) improve performance and SEO. Next.js also simplifies database connections, making data management seamless. Its developer-friendly features, such as API routes and built-in routing, accelerate development. Ultimately, Next.js empowers me to create efficient, scalable, and high-performance web applications with a unified codebase.

## Technologies used 

![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-green?style=flat&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)
![Mongoose](https://img.shields.io/badge/Mongoose-red?style=flat&logo=mongoose)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat&logo=vercel)
![React-Redux](https://img.shields.io/badge/React--Redux-764ABC?style=flat&logo=redux)

- Next.js
- MongoDB
- Tailwind CSS
- Mongoose
- Vercel
- React-Redux

## Deployment using Vercel

- Login into Vercel
- Connect Vercel to your Github account
- Make sure your project has been pushed to Github.
- Create a new project on Vercel and select this project from the list of available repositories which must have been fetched from Github after you connected it to Vercel.
- Add environment variables to this Vercel project, this would include database url and jwt secret.

```
DB_URI=mongodb://localhost:27017/next_auth
JWT_SECRET=mysupersecretpassword
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

- It should be deployed on Vercel, Vercel must have given a url for it for accessing.

- If you're using MongoDB Atlas, make sure you've given permissions to access your cluster.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Local Development

- Install npm packages
- Make sure you have MongoDB server and client installed, I'd recommend installation using Docker containers if you don't have it installed on your system.
- Add .env file with database settings.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Contribute

I'd welcome contributions to this project! To ensure a smooth process, please follow these guidelines:

1. **Fork the Repository**: Start by forking the repository to your GitHub account.
2. **Create a Branch**: Create a new branch for your feature or bug fix.
3. **Write Tests**: Ensure that your code changes include tests to cover new functionality or bug fixes.
4. **Follow Coding Standards**: Adhere to the project's coding standards and conventions.
5. **Commit Messages**: Write clear and concise commit messages.
6. **Pull Request**: Submit a pull request with a detailed description of your changes.

Thank you for your contributions!

