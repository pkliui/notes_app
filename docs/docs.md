# TypeScript React Node.js application for making daily notes

NB: **AWS EC2 is not running at present. Hence inability to launch the program. **


The following can be seen as some kind of a tutorial one can follow to make a [daily notes application](http://16.171.226.39:8000/). The application allows users to add, modify and delete daily notes through a web interface. 

> **Frontend**: Built with TypeScript and React, providing an interactive UI.

> **Backend**: Developed with TypeScript and Node.js. Prisma acts as the ORM to interact with the database, and the Express library is used to set up the API endpoints.

> **Database**: Notes are stored in a PostgreSQL database hosted by Neon.tech.

> **Deployment**: The application is deployed on an AWS EC2 Ubuntu instance using Docker containers. 

> **Nginx** is set up both to route traffic to the appropriate services and to serve the static files for the React app.

> **CI/CD**: Managed via GitHub Actions
> 


- [TypeScript React Node.js application for making daily notes](#typescript-react-nodejs-application-for-making-daily-notes)
- [Development ](#development-)
  - [Create a new React project and install frontend dependencies ](#create-a-new-react-project-and-install-frontend-dependencies-)
  - [Write frontend code and start your app locally ](#write-frontend-code-and-start-your-app-locally-)
  - [Create a new Node.js project and install backend dependencies ](#create-a-new-nodejs-project-and-install-backend-dependencies-)
  - [Write backend code ](#write-backend-code-)
  - [Setup Prisma and start your server locally ](#setup-prisma-and-start-your-server-locally-)
  - [Prototyping and Prisma ](#prototyping-and-prisma-)
- [Dockerise the project for development ](#dockerise-the-project-for-development-)
  - [Frontend Dockerfile.dev for development ](#frontend-dockerfiledev-for-development-)
  - [Backend Dockerfile.dev for development ](#backend-dockerfiledev-for-development-)
  - [Configure Nginx as a reverse proxy ](#configure-nginx-as-a-reverse-proxy-)
    - [Create a specific default.conf configuration](#create-a-specific-defaultconf-configuration)
    - [Create Nginx Dockerfile](#create-nginx-dockerfile)
  - [Unite everything with Docker Compose  ](#unite-everything-with-docker-compose--)
- [Production ](#production-)
  - [Modifications to the frontend Dockerfile ](#modifications-to-the-frontend-dockerfile-)
  - [Modifications to the backend  ](#modifications-to-the-backend--)
    - [Modify config files](#modify-config-files)
    - [Modify backend Dockerfile](#modify-backend-dockerfile)
  - [Configure Nginx for serving ](#configure-nginx-for-serving-)
- [Deployment ](#deployment-)
  - [Setup AWS ](#setup-aws-)
    - [Create a new EC2 instance and connect to it](#create-a-new-ec2-instance-and-connect-to-it)
    - [Install docker on EC2](#install-docker-on-ec2)
  - [Setup CI/CD with GitHub Actions ](#setup-cicd-with-github-actions-)
    - [Install runner on EC2](#install-runner-on-ec2)
    - [Add environment variables to Github Secrets](#add-environment-variables-to-github-secrets)
    - [Github Actions CI/CD workflow](#github-actions-cicd-workflow)
    - [Workflow - version 1](#workflow---version-1)
    - [Workflow - version 2 - rolling update with containers' scaling](#workflow---version-2---rolling-update-with-containers-scaling)



<br />
<br />

# Development <a name="development"></a>

- Lets start from developing our application on a local machine. The description below follows the steps I followed on MacOS 11.7.10.


## Create a new React project and install frontend dependencies <a name="frontend1"></a>

- Install *Node.js* and its *npm* package manager, e.g. using the *nvm* version manager as described here https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

- Make a new project directory, e.g. "notes_app", cd to there and run

```bash
npx create-react-app notesapp-ui --template typescript
```

- This will create a new *React* project in *TypeScript* under "notes_app/notesapp-ui". package.json file will list all dependencies used by the project. 
- We keep default dependencies and in addition to them install *axios*. This is a library we will use to make API requests to our *PostgreSQL* database:

```bash
npm install axios
```

- You should have the following dependencies in you package.json file:

```json
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.115",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "axios": "^1.7.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  }
```


## Write frontend code and start your app locally <a name="frontend2"></a>

- Write code...
(EXPLANATION PENDING)

- Once done, start the front-end development server:

```bash
npm start
```

- All being well, your browser will automatically open and display your new React app at http://localhost:3000



## Create a new Node.js project and install backend dependencies <a name="backend1"></a>

- Make a new directory, e.g. "notes_app/notesapp-server", cd to it and run

```bash
npm init
```
- This will walk you through creating a package.json file. Keep the defaults, for entry point (the file containing your backend code) specify "./src/index.ts" (or whatever is applicable in your case).
- Next, install the backend dependencies with "--save-dev" flag as they will be used only for development:

```bash
npm i ts-node typescript nodemon @types/cors @types/express @types/node --save-dev,
```

  - where *ts-node* is a TypeScript execution engine for Node.js, allowing us to run .ts files, *typescript* enables TypeScript support for type-checking and .ts file usage *nodemon* will automatically restart the server when files change, and  *@types/express*, *@types/cors* and *@types/node* are TypeScript type definitions for Express, CORS and  Node.js providing TypeScript support.


- Once done, install the rest of dependencies (used both in dev and production)

- We will install *Prisma CLI* (which is an ORM tool we will use to communicate with the database from Typescript), *Express* (is the framework we will use to create our API endpoints that will handle the requests to the database) and *CORS* (cross-origin resource sharing, to be able to handle HTTP requests between the client and the server):

```bash
npm i @prisma/client cors express prisma
```

- Now the list of dependencies in your "notes_app/notesapp-server/package.json" file should look like that:
```json
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/node": "^22.7.9",
    "nodemon": "^3.1.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  },
  "dependencies": {
    "@prisma/client": "^5.21.1",
    "cors": "^2.8.5",
    "express": "^4.21.1",
    "prisma": "^5.21.1"
  }
```

- Initialize TypesScript:

```bash
npx tsc --init
```

- This will create a "notes_app/notesapp-server/tsconfig.json" file. I have initially got this tsconfig file (we will need to somewhat modify it for production):
```json
{
  "compilerOptions": {
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "module": "commonjs",                                /* Specify what module code is generated. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}
```

-  Next, jump into package.json file and add a new script that lets us start our server. We will use *nodemon* that continuously monitors changes in our code and restarts the application automatically if there any changes.

```bash
"scripts": {
  "dev": "npx nodemon"
}
```

## Write backend code <a name="backend2"></a>

- Write your backend code in "notes_app/notesapp-server/src/index.ts" file. 

(EXPLANATION ABOUT BACKEND CODE PENDING)

- We specify that our Express application will listen on port 5000 for backend requests:

```typescript
app.listen(5000, () =>{
        console.log("server running on localhost:5000")
});
```

## Setup Prisma and start your server locally <a name="backend3"></a>

- Initialise Prisma. This will create a "prisma" directory under "notes_app/notesapp-server/" and a "schema.prisma" file in it as well as an .env file in the project's root, which is used to define environment variables:

```bash
npx prisma init
```

As per instructions,

1. Set the ```DATABASE_URL``` in the .env file to point to your existing database
2. Set the provider in "schema.prisma". In here, we specify "postgresql" and set the "url" field to  ```"DATABASE_URL"``` specified in the ".env" file.

    - Make sure to add .env to .gitignore!

    - You may also want to add an appropriate binary target for your operating system (I have "native" for MacOS where I develop, and I have added "linux-musl-openssl-3.0.x" for Ubuntu where I will be testing my development docker containers and deploying the application)

      ```typescript
      generator client {
        provider = "prisma-client-js"
        binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
      }

        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        model Note{
          id      Int @id @default(autoincrement())
          title   String
          content String
        }
        ```

  3. Run ```prisma db pull``` to turn your database schema into a Prisma schema.
  4. Run ```prisma generate``` to generate the Prisma Client. You can then start querying your database.


```

📝  In production, we will not be using .env file created here, but instead we will recreate it in Docker by reading out the ```DATABASE_URL``` value from GitHub secrets (see the part about production below).

```



 
 To start the server on the port we specified in ```app.listen```, run:

```bash
npx nodemon
```

- Express is now running on port 5000. If you go to http://localhost:5000/notes/api you will see the notes available in the database.


- Switch back to the UI window you previously opened http://localhost:3000, refresh and you should be able to see it has been updated with notes from the database. 



## Prototyping and Prisma <a name="backend4"></a>


- To inspect an already existing database, you can run ```npx prisma studio```

- During the development stage, you may want to make changes to your "prisma.schema" file, e.g.  adding another model. 

- For prototyping such kind of changes, Prisma recommends using ```npx prisma generate``` to generate a new Prisma Client (typically is generated into "./node_modules/.prisma/client" by default), followed by  ```npx prisma db push``` to push the changes to the database. The latter command, however, does not keep the history of changes, which could be beneficial to have.

- To keep the changes, one should use  ```npx prisma migrate dev``` in development. This would create a history of them under "prisma/migrations". For production (see later, one should use ```npx prisma migrate deploy``` instead).

<br />
<br />
<br />

# Dockerise the project for development <a name="dockerise"></a>

- We have made our application to work locally and need to move forward and be able to deploy it somewhere where it could be available for users. For example, on an AWS EC2 machine.  We could go ahead and directly repeat all steps there. 

- However, to make the whole process more robust and eliminate a manual setup, we will utilize Docker containers. 

- Docker containers provide a consistent and isolated environment, ensuring reproducibility across different machines and stages of the application's lifecycle (development, test and production).

- In production, Docker containers will provide means for scalability. For example, by increasing the number of running containers, we will be able to do the application's update with an almost zero downtime. 

- To start with the local development, install Docker and Docker Desktop application on your computer. 
  
<br />

## Frontend Dockerfile.dev for development <a name="dockerise1"></a>

  
> [!WARNING]  **Create new .dockerignore and .gitignore files and add "node_modules" to it as we do not want them to be copied from the local machine**
> 
- Go to your frontend folder "notes_app/notesapp-ui/" and make the following Dockerfile.dev there:

<br />

```docker
FROM node:lts-alpine

WORKDIR /app
COPY ./package*.json ./
RUN npm i

COPY . .

CMD ["npm", "run",  "start"]
```

<br />

- We use node:lts-alpine distribution because of its small size and do the following:
- Set the work directory inside Docker to "/app" and copy package.json files into there
- Install all dependencies  specified in these json files by running ```RUN npm i``` and copy the rest of the content in your local folder "notes_app/notesapp-ui" to the work folder in Docker 
- Run ```CMD ["npm", "run",  "start"]``` that will run our "start" script defined in package.json (```"start": "react-scripts start"```).

- In the following, we will use docker compose to run our application, but one can test the  dockerfile already now:
  
    ```bash
    docker build -t notesapp-ui -f Dockerfile.dev .
    
    docker run -t notesapp-ui -p 3000:3000
    ```

    - Head to http://localhost:3000 to see the UI running inside of our docker container. At this point it has no access to the database yet.


<br />

## Backend Dockerfile.dev for development <a name="dockerise2"></a>

- Similarly, we make a Dockerfile.dev for the backend in "notes_app/notesapp-server" directory. 

> [!WARNING]  **Remember to add "node_modules" to a .dockerignore and .gitignore files as we do not want them to be copied from the local machine.**

```docker
FROM node:lts-alpine

WORKDIR /app
COPY ./package*.json ./
RUN npm i

COPY . .

RUN npx prisma migrate dev
RUN npx prisma migrate status

CMD ["npm", "run",  "dev"]

```

- We use node:lts-alpine distribution because of its small size
- Set the work work directory inside the Docker to "/app" and copy package.json files to there
- Install all dependencies  specified in these json files by running ```RUN npm i``` 
- Copy the content of your local directory "notes_app/notesapp-server" to "/app" in docker (it will ignore "node_modules" whilst copying and hence will keep the dependencies installed in the container)

- Run ```npx prisma migrate dev``` to migrate any changes that could have happened to the prisma.schema file. 
 
- Finally, run ```CMD ["npm", "run",  "dev"]``` that will run nodemon, as defined in package.json (``` "dev": "npx nodemon"```).

- In the following, we will use docker compose, but one can test the dockerfile already now:

    ```bash
    docker build -t notesapp-server -f Dockerfile.dev .
    docker run -t notesapp-server -p 5000:5000
    ```
  - Head to http://localhost:5000/api/notes to see the database content 

<br />

## Configure Nginx as a reverse proxy <a name="dockerise3"></a>

- Up to this moment, we have managed to containerise both the frontend and the backend of our application. Now lets make them talk with each other by means of *docker-compose* and *Nginx*.


### Create a specific default.conf configuration 

- To configure Nginx as a reverse proxy, navigate to the project's root directory and create an "nginx" folder. Inside this folder ("notes_app/nginx"), create a file named default.conf with the following content:

```nginx
upstream frontend {
    server frontend:3000; # frontend service in docker compose
}

upstream backend {
    server backend:5000; # backend service in docker compose
}

server {
    listen 80; # nginx listens on port 80

    location / {
        proxy_pass http://frontend;
    }

    location /api {
        proxy_pass http://backend;
    }
}
```

- "upstream" defines the groups of frontend and backend servers so that they can be referenced by "proxy_pass" in the "server" block below
- we know that our frontend and backend are available on ports 3000 and 5000 and will be referenced as "frontend" and "backend" services in our docker-compose.yml file (see below), hence "server frontend:3000" and "server backend:5000", respectively
- the "server" block defines our main configuration for Nginx, where it will listen on port 80 and route traffic to our backend server for "/api" location and to our frontend server for "/" location 


### Create Nginx Dockerfile

- Create a new Dockerfile.dev for Nginx, where we use an Nginx' image and replace its default settings file with the file that we have just created on local

```docker
FROM nginx
ADD ./default.conf /etc/nginx/conf.d/default.conf
```

- We will use the same Nginx Dockerfile both for development and production

<br />

## Unite everything with Docker Compose  <a name="dockerise4"></a>

- Now make a "docker-compose-dev.yml" file in your main project directory ("notes_app").
- We specify three services: one for Nginx and the other two for our frontend and backend. 
- We map the folders on our local machine into the respective Docker containers, excluding "node_modules" 
- We also point to the local .env file containing DATABASE_URL environment variable (for production we will recreate it using GitHub Actions' Secrets)
  
<br />

```docker
version: '3.8'

services:

  nginx:
    depends_on:
      - frontend
      - backend
    restart: always
    build:
      dockerfile: Dockerfile.dev
      context: ./nginx
    ports:
      - "8000:80"


  frontend:
    build:
      dockerfile: Dockerfile.dev
      context: "./notesapp-ui"
    volumes:
      - /app/node_modules
      - ./notesapp-ui:/app
    ports:
      - "3000:3000"

      
  backend:
    build:
      dockerfile: Dockerfile.dev
      context: "./notesapp-server"
    volumes:
      - /app/node_modules
      - ./notesapp-server:/app
    ports:
      - "5000:5000"
    environment:
      - .env
```

- Run the docker compose file

```bash
docker compose -f docker-compose-dev.yml up --build
```

- We should be able to see our application fully functional under http://localhost:8000.


<br />
<br />
<br />

# Production <a name="production"></a>


## Modifications to the frontend Dockerfile <a name="production1"></a>

- We need to slightly modify our Dockerfile for production. The first lines up to "COPY" are equivalent to what we have in our development Dockerfile.dev
- "npm run build", as defined in "package.json", is ```"build": "react-scripts build"``` and will put all the build files under the "app/build" folder

- In the second part we use an Nginx image and copy the content of the "app/build" folder into the  "/usr/share/nginx/html" directory, where nginx will serve the frontend (see the next step below)
- Then we remove the default Nginx' conf file and replace it with ours
- Port 3000 is exposed for frontend and ``` CMD ["nginx", "-g", "daemon off;"]``` starts Nginx
- 

```docker
FROM node:lts-alpine as build

WORKDIR /app
COPY ./package*.json ./
RUN npm i

COPY . .

RUN npm run build

# second part with nginx
FROM nginx:1.21.4-alpine

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```
<br />

## Modifications to the backend  <a name="production2"></a>

### Modify config files

- Ensure that we modified the tsconfig.json so that we specified an output folder for the JavaScript files generated by TypeScript compiler


```json
{
  "compilerOptions": {
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "module": "commonjs",                                /* Specify what module code is generated. */
    "moduleResolution": "node",                     /* Specify how TypeScript looks up a file from a given module specifier. */
    "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    "outDir": "dist",                                   /* Specify an output folder for all emitted files. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJSmodules. 
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}
```

- Modify package.json to have these scripts for production:
```json
"scripts": {
  "dev": "npx nodemon",
  "build": "NODE_ENV=production npx tsc",
  "start": "NODE_ENV=production node --trace-deprecation dist/index.js"
},
```
- In the above, npx tsc runs the TypeScript compiler (tsc) to transpile our TypeScript code into JavaScript (and put it into "dist" folder) and node runs the compiled index.js file


### Modify backend Dockerfile


- The first lines up to "COPY" are equivalent to what we have in our development Dockerfile.dev
- ```RUN npx prisma generate``` generates a new Prisma Client for us and ``` RUN npx prisma migrate deploy``` migrates any changes in the prisma.schema file

- The following "build" and "start" commands are defined in the package.json file and port 5000 is exposed for the backend 

```docker
FROM node:lts-alpine

WORKDIR /app
COPY ./package*.json ./
RUN npm i

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 5000
RUN npm run build
CMD ["npm", "run",  "start"]
```


<br />

## Configure Nginx for serving <a name="production3"></a>

- We will serve our built React application with Nginx. Make a new folder "nginx" under "notes_app/notesapp-ui/" and a new default.conf file in it:

```nginx
server {
    listen 3000;

    location / {
        root /usr/share/nginx/html;
        index index.html index htm;
        try_files $uri $uri/ /index.html;

    }
}
```

- We listen on port 3000 and we are serving index.html file from folder "/usr/share/nginx/html"

- We should be able to see our application fully functional under http://localhost:8000.





<br />
<br />
<br />

# Deployment <a name="deploy"></a>

## Setup AWS <a name="deploy1"></a>

### Create a new EC2 instance and connect to it


- Under "Instances/Launch instance" select the base image (I have picked Ubuntu 22.04)

- Generate an SSH key pair so that we can connect to the machine over the internet. Save the generated .pem file to .ssh folder on your PC, by moving it from, e.g. Downloads folder

```bash
cd ~/Downloads
mv ec2-docker.pem ~/.ssh
```

- Setup the firewall policy (security groups) to allow HTTP and HTTPS traffic so that our app is available for external users and allow SSH access to the machine only from my own IP address 

![alt text](firewall-settings.png)

- Also, specify the ports you would like to set free for the traffic (e.g. 8000 will be used for nginx in our case)

- Click on "Launch instance" and connect to it in order to proceed with the configuration. One can do this either via "EC2 instance connect" or "SSH client", e.g. from the VSC terminal. Ensure your key is not publicly viewable


```bash
cd ~/.ssh
chmod 400 "ec2-docker.pem"
```

- Connect
```bash
ssh -i "~/.ssh/ec2-docker.pem" ubuntu@ec2-16-170-246-89.eu-north-1.compute.amazonaws.com
```
<br />

### Install docker on EC2

- Once logged in, update and upgrade

```bash
sudo apt update && sudo apt upgrade
```

- Install from the official docker repository as installing through Ubuntu may not yield the latest version

-  Retrieve Docker's GPG key (a security key to verify the authenticity of docker) and add it to the system. For that, install curl to be able to download the key via HTTPS and ca-certificates to verify an authenticity of the sites. Make a directory under "/etc/apt/keyrings"  to keep that key. Download the key and modify the permissions to allow apt to access it. Finally, add the docker repository to apt sources and update the list:

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

- Install docker packages
```bash
sudo apt-get install docker-ce docker-ce-cli docker-compose-plugin
```

- Verify with hello world
```bash
sudo docker run hello-world
```


- Add current user to docker group
```bash
sudo usermod -aG docker $USER
```
- Change the permissions of docker socket to be able to connect to the docker daemon
```bash
sudo chmod 660 /var/run/docker.sock
```
<br />


 ## Setup CI/CD with GitHub Actions <a name="deploy2"></a>


 We will use GitHub Actions to automatically deploy our application whenever any changes occur in the main branch. 

 The runner will be listening and waiting for you to push the code into the  main branch and once you do, it will trigger a set commands that will update the code on EC2 instance, re-build dockerfiles and push them into the registry as well as smoothly update the running containers. 


### Install runner on EC2
  
- To install a runner, follow the instructions here https://github.com/pkliui/notes_app/settings/actions/runners/new up until # Create the runner and start the configuration experience:
  

```bash
# Create a folder
mkdir actions-runner && cd actions-runner
# Download the latest runner package
curl -o actions-runner-linux-x64-2.320.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.320.0/actions-runner-linux-x64-2.320.0.tar.gz
# Optional: Validate the hash
echo "93ac1b7ce743ee85b5d386f5c1787385ef07b3d7c728ff66ce0d3813d5f46900  actions-runner-linux-x64-2.320.0.tar.gz" | shasum -a 256 -c
# Extract the installer
tar xzf ./actions-runner-linux-x64-2.320.0.tar.gz
```

- Upon extracting the installer, you should see a bunch of files under actions-runner. Create a runner and configure it:

```bash
# Create the runner and start the configuration experience
./config.sh --url https://github.com/pkliui/notes_app --token YOURGITHUBTOKENHERE
```

- Now you can configure the self-hosted runner application as a service to automatically start the runner application when the machine starts. On the runner machine, open the shell in a directory where you installed the self-hosted runner application. To install the service run:

```bash
sudo ./svc.sh install
```

- Start the service with the following command:
```bash
sudo ./svc.sh start
```

- Now the service should be enabled and active (running):
![alt text](runner.png)

- Whenever needed, check the status of the service with the following command:
```bash
sudo ./svc.sh status
```

<br />
 
 ### Add environment variables to Github Secrets

- In development, we used .env file where we stored our ```DATABASE_URL``` variable. In  production, we will store this and other variables in GitHub secrets and recreate this file insode the docker container.
- In your Github repository, go to Settings -> Secrets and variables -> Actions. And under "Repository secrets", add the following new secrets:

DATABASE_URL: Set the ```DATABASE_URL``` to point to your existing database. For local development, we saved it in the .env file locally. For deployment, we will use an environment variable in GitHub secrets instead.

DOCKER_USERNAME: Your DockerHub username.

DOCKER_TOKEN: Will be used instead of a password for docker CLI authentication. You can create one under https://app.docker.com/settings/personal-access-tokens

<br />


### Github Actions CI/CD workflow

The last step that needs to be done is to setup the CI/CD workflow that will be executed once there are any changes in the main branch. In the following, I present two versions that worked or me. I have eventually opted or the second workflow as it is more robust and results in a shorter downtime for the application.


### Workflow - version 1

- With this approach, you will have a longer downtime because you stop the old and then start the new containers 
- In short, checkout the code from the repo, build and push the updated images for frontend, backend and nginx to Docker Hub.
- Use the GitHub secrets to login to Docker Hub and connect to the database.
- Nginx keeps routing to the old containers at the moment. Stop them with "docker compose down --volumes".
- Pull the images you have just pushed to Docker Hub and launch the respective containers with "docker compose up -d --build"

<details>
<summary>Click to expand workflow 1</summary>

```{r echo=FALSE}
name: notes_app CI

on:
  push:
    branches: [ main ]

jobs:
  check-out-and-update-docker-images:
      runs-on: [self-hosted]
      steps:
        - name: Checkout code from the github repo
          uses: actions/checkout@v2

        - name: Log in to Docker Hub
          uses: docker/login-action@v2
          with:
            username: ${{secrets.DOCKER_USERNAME}}
            password: ${{secrets.DOCKER_TOKEN}}
  
        - name: Build and push Docker images for frontend, backend and nginx
          run: |
          
            cd ~/actions-runner/_work/notes_app/notes_app/notesapp-server
            echo "DATABASE_URL=${{secrets.DATABASE_URL}}" > .env
            
            cd ~/actions-runner/_work/notes_app/notes_app/notesapp-ui
            docker build -t pkliui/notes_app:notes_app-frontend .
            docker push pkliui/notes_app:notes_app-frontend
            cd ..
            
            cd ~/actions-runner/_work/notes_app/notes_app/notesapp-server
            docker build -t pkliui/notes_app:notes_app-backend .
            docker push pkliui/notes_app:notes_app-backend
            cd ..
            
            cd ~/actions-runner/_work/notes_app/notes_app/nginx
            docker build -t pkliui/notes_app:notes_app-nginx .
            docker push pkliui/notes_app:notes_app-nginx
            cd ..

  deploy-updated-containers:
        runs-on: [self-hosted]
        needs: check-out-and-make-docker-builds
        steps:
          - name: Checkout code
            uses: actions/checkout@v2
  
          - name: Log in to Docker Hub
            uses: docker/login-action@v2
            with:
              username: ${{secrets.DOCKER_USERNAME}}
              password: ${{secrets.DOCKER_TOKEN}}
            
          - name: Pull Docker images and deploy
            run: |
            
                cd ~/actions-runner/_work/notes_app/notes_app/notesapp-server
                echo "DATABASE_URL=${{secrets.DATABASE_URL}}" > .env
                
                cd ~/actions-runner/_work/notes_app/notes_app/notesapp-ui
                docker pull pkliui/notes_app:notes_app-frontend
                cd ..
                cd ~/actions-runner/_work/notes_app/notes_app/notesapp-server
                docker pull pkliui/notes_app:notes_app-backend
                cd ..
                cd ~/actions-runner/_work/notes_app/notes_app/nginx
                docker pull pkliui/notes_app:notes_app-nginx
                cd ..
  
                docker compose down --volumes
                docker compose up -d --build
```

</details>
<br />

- In docker-compose.yml file, we can keep the port mappings equivalent to those used in development, i.e. explicitly mapping 3000:3000 and 5000:5000



<br />

### Workflow - version 2 - rolling update with containers' scaling

- The downtime can be reduced by scaling the number of containers with "docker-compose --scale" and performing a rolling update as described below.


- Initiate the workflow at a push on the main branch

```yaml
 on:
  push:
    branches: [ main ]
```

- We will have a single job running on our self-hosted EC2 instance with a multiple steps. First, checkout the code from the repository:

```yaml
jobs:
  perform-rolling-update:
    runs-on: self-hosted
    steps:
      - name: Checkout code from the github repo
        uses: actions/checkout@v2
```

- Create an environment file containing the database URL
```yaml
- name: Create an environment file
        run: |
        
          cd ~/actions-runner/_work/notes_app/notes_app/notesapp-server
          echo "DATABASE_URL=${{secrets.DATABASE_URL}}" > .env
```


- Login to docker hub, build new images and push them to docker hub
```yaml
- name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{secrets.DOCKER_USERNAME}}
          password: ${{secrets.DOCKER_TOKEN}}
  
      - name: Build and push updated Docker images for frontend, backend and nginx
        run: |

          cd ~/actions-runner/_work/notes_app/notes_app/notesapp-ui
          docker build -t pkliui/notes_app:notes_app-frontend .
          docker push pkliui/notes_app:notes_app-frontend
          cd ..
          
          cd ~/actions-runner/_work/notes_app/notes_app/notesapp-server
          docker build -t pkliui/notes_app:notes_app-backend .
          docker push pkliui/notes_app:notes_app-backend
          cd ..
          
          cd ~/actions-runner/_work/notes_app/notes_app/nginx
          docker build -t pkliui/notes_app:notes_app-nginx .
          docker push pkliui/notes_app:notes_app-nginx
          cd ..
```

- At this point, docker should still be running containers with the previous version of the code 

```yaml
- name: Containers before scaling up
  run: docker ps -a
```

- Now, given the newly built images, scale up the number of containers (frontend and backend)
```yaml
- name: Scale up containers, nginx keeps routing to the old ones
  run: docker compose up -d --scale frontend=2 --scale backend=2 --wait
```

- Reload Nginx without rescaling or restarting its container
```yaml
- name: Reload nginx without restarting its container
  # in the following, $(sudo docker ps -q | xargs sudo docker inspect --format='{{.Name}}' | grep notes_app-nginx) command gets the containers' name (most probably notes_app-nginx-1), 
  # given the nginx image is notes_app-nginx
  run: docker exec $(sudo docker ps -q | xargs sudo docker inspect --format='{{.Name}}' | grep notes_app-nginx) nginx -s reload 
```

- You should be able to see the newly added containers. Nginx is still routing to the old frontend and backend containers at this point.
```yaml
- name: Containers after scaling up
  run: docker ps -a
```

- Replace the old frontend container with the new one. Get the old container's ID by using timestamp, stop and remove it. Scale the number of frontend containers back to 1 and reload Nginx so that it now routes the traffic through the new container.

```yaml
- name: Update the frontend
        run: |
        
          # get the "old" container ID (this is the currently running container)
          old_frontend_id=$(docker ps -f name=notes_app-frontend --format '{{.ID}} {{.CreatedAt}}' | sort -k2,3 | head -n 1 | awk '{print $1}')
          # take the old container offline  
          docker stop $old_frontend_id
          docker rm $old_frontend_id
          # put the new container into use and reload nginx
          docker compose up -d --scale frontend=1 --wait
          docker exec $(sudo docker ps -q | xargs sudo docker inspect --format='{{.Name}}' | grep notes_app-nginx) nginx -s reload
```

- Do the same with the backend
```yaml
- name: Update the backend
  run: |
  
    # get the "old" container ID (this is the currently running container)
    old_backend_id=$(docker ps -f name=notes_app-backend --format '{{.ID}} {{.CreatedAt}}' | sort -k2,3 | head -n 1 | awk '{print $1}')
    # take the old container offline  
    docker stop $old_backend_id
    docker rm $old_backend_id
    # put the new container into use and reload nginx
    docker compose up -d --scale backend=1 --wait
    docker exec $(sudo docker ps -q | xargs sudo docker inspect --format='{{.Name}}' | grep notes_app-nginx) nginx -s reload
```

- Now all new containers should be up and running 
```yaml
- name: Containers after updating frontend and backend
  run: docker ps -a
```


- Whilst using this workflow, you need to exclude the port mapping in your docker-compose.yml file. This is because after scaling two different containers cannot run on the same port. Upon excluding the port mapping, but specifying just the ports' number for backend and front end, the ports routing to nginx will be picked automatically


<details>
<summary>Click to see docker-compose.yml</summary>


```yaml
version: '3.8'

services:

  nginx:
    depends_on:
      - frontend
      - backend
    restart: always
    build:
      dockerfile: Dockerfile
      context: ./nginx
    ports:
      - "8000:80"


  frontend:
    build:
      dockerfile: Dockerfile
      context: ./notesapp-ui
    volumes:
      - /app/node_modules
    ports:
      - "3000"

      
  backend:
    build:
      dockerfile: Dockerfile
      context: ./notesapp-server
    volumes:
      - /app/node_modules
    ports:
      - "5000"
    environment:
      - .env
```

</details>

<br />

Well done! Congratulations! Now you have a fully functional daily notes application running inside Docker on an AWS EC2 instance!
