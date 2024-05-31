---
title: 'Nginx Reverse proxy with docker and node services'
description: 'Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro. sas'
pubDate: 'may 31 2024'
heroImage: '/blog-placeholder-4.jpg'
---

### Nginx

Nginx (engine X) is open-source web server software used for reverse proxy, load balancing, caching and many others.
In this post I will show how to handle reverse proxy with 2 examples. 

### Reverse proxy
A reverse proxy is a server positioned in front of web servers that directs client requests (such as those from web browsers) to the appropriate web servers. Reverse proxies are commonly used to enhance security, performance, and reliability.

![reverse proxy diagram1](/blog/nginx-reverse-proxy/1.png)

When you enter a URL in a web browser  `http://example.com`,  the browser assumes the request should be sent to port 80 unless another port is specified `http://example.com:3000`.

On the server, we need to expose our application on the default port 80 because we generally don't want users to have to type a port number in the URL. This is where a reverse proxy comes into play.

An Nginx reverse proxy will catch all requests on port 80 and redirect them as needed. This way, we can have our application running on localhost:3000, and the reverse proxy will redirect requests to that address.

```markdown
> Why can't I expose the application on port 80 so that internet calls go directly to my server?
```

That's a great question.

While exposing your web server directly on port 80 allows the internet to access it directly and may seem simpler, it introduces several potential issues. Nginx is a very powerful tool with many important features, including:

```markdown
- Security
- SSL connections
- Caching
- Load balancing
- And many others...
```

Using Nginx as a reverse proxy helps address these issues effectively.


So, we now understand that using a reverse proxy is important even if we have just one web server.

```markdown
> But what if we have several web servers?
```

In this case, using a reverse proxy becomes even more important.

![reverse proxy diagram2](/blog/nginx-reverse-proxy/2.png)


We can control which routes go to which application. This is very useful when we have multiple services in Docker. One of these services can be Nginx, which is in charge of routing.

### Example Nginx with one node server

#### Structure of our files

```
📦nginx_docker  
 ┣ 📂nginx  
 ┃ ┣ 📜Dockerfile  
 ┃ ┗ 📜nginx.conf  
 ┣ 📂node_service1  
 ┃ ┣ 📜Dockerfile  
 ┃ ┣ 📜index.js  
 ┃ ┗ 📜package.json  
 ┗ 📜docker-compose.yml
```

#### Nginx

Dockerfile
 
Here we copy official image of Nginx and replace default config with our config.

```
FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
```

##### nginx.conf
Here, we take requests listening on the default port 80 at the root (/) and redirect them to `proxy_pass http://node:3000;`. This configuration redirects calls to the Node.js server defined in the `docker-compose.yml` file on port 3000, where our app is listening inside the Docker container.

```nginx
events {
  worker_connections 1024;
}

http {
  server {
    listen 80;

    location / {
      proxy_pass http://node:3000;
	  # other options...
    }
  }
}
```

#### Node service1 

Dockerfile
Here we install and run node instance

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]
```

index.js
```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world! from /');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:3000`);
});
```

#### Docker compose
This is the most important file that connects our services. In the `docker-compose.yml`, we define which services need to be run, their relationships, and expose them to be reachable from the outside.

By default, when we have services in `docker-compose` and run them with `docker-compose up`, there is a connection between them, allowing them to communicate.

```yml
version: '3'
services:
  node:
    build:
      context: ./node_service1
      
  nginx:
    build:
      context: ./nginx
    ports:
      - "80:80"
    depends_on:
      - node
```

Note that we don't set a port for the Node service. The browser can't access the service directly; it has to be done using a reverse proxy. This ensures that we have one layer controlling access. If we were to set ports for the Node service as 3000:3000, we could access the server by calling example.com:3000, but that's not our intention. We want all requests to go through Nginx, which will handle them accordingly.

We only expose one access point to the world.

![reverse proxy diagram3](/blog/nginx-reverse-proxy/3.png)

### Example with multiple node servers

Structure of our file
```
📦nginx_docker  
 ┣ 📂nginx  
 ┃ ┣ 📜Dockerfile  
 ┃ ┗ 📜nginx.conf  
 ┣ 📂node_service1  
 ┃ ┣ 📜Dockerfile  
 ┃ ┣ 📜index.js  
 ┃ ┗ 📜package.json  
 ┣ 📂node_service2  
 ┃ ┣ 📜Dockerfile  
 ┃ ┣ 📜index.js  
 ┃ ┗ 📜package.json  
 ┣ 📂node_service3  
 ┃ ┣ 📜Dockerfile  
 ┃ ┣ 📜index.js  
 ┃ ┗ 📜package.json
 ┗ 📜docker-compose.yml
```

#### Nginx

Dockerfile
 
Here we copy official image of Nginx and replace default config with our config.

```
FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
```

nginx.conf

Currently, we have defined three services, and based on the slug, we redirect them to their respective dedicated Docker containers. For instance, if we attempt to access /node1, Nginx will redirect us to the node1 container and handle the rest of the process.
```nginx
events {
    worker_connections 1024;
}

http {
    upstream node1_backend {
        server node1:3000;
    }

    upstream node2_backend {
        server node2:4000;
    }

    upstream node3_backend {
        server node3:5000;
    }

    server {
        listen 80;

        location /node1 {
            proxy_pass http://node1_backend;
			# other options...
        }

        location /node2 {
            proxy_pass http://node2_backend;
			# other options...
        }

        location /node3 {
            proxy_pass http://node3_backend;
			# other options...
        }
    }
}

```

#### Node services

Dockerfile (the same for all of them)
```Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]
```

node1 index.js
```js
const express = require('express');

const app = express();
const port = 3000;

app.get('/node1', (req, res) => {
  res.send('node1');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
```


node2 index.js
```js
const express = require('express');

const app = express();
const port = 4000;

app.get('/node2', (req, res) => {
  res.send('node2');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
```

node3 index.js
```js
const express = require('express');

const app = express();
const port = 5000;

app.get('/node3', (req, res) => {
  res.send('node3');
});

app.get('/node3/getFromNode1', async (req, res) => {
    try {
      const response = await fetch('http://node1:3000/node1');
      if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      res.send(`data from node1: ${data}`);
      
    } catch (error) {

      console.error('There was a problem with the fetch operation:', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```


#### Docker compose

```yml
version: '3'
services:
  node1:
    build:
      context: ./node_service1
  node2:
    build:
      context: ./node_service2
  node3:
    build:
      context: ./node_service3

  nginx:
    build:
      context: ./nginx
    ports:
      - "80:80"
    depends_on:
      - node1
      - node2
      - node3
```

### Internal and external communication

Currently, we can access different services based on the slug we use. For example, typing `example.com/node1` will call the node1 service, and the same applies to node2 and node3. This means we can communicate with services from the internet using the appropriate slug. However, there is no direct access from the internet to call these services (unless we expose ports to the outside).

```markdown
> But what if we want the services to communicate with each other?
```

Fortunately, Docker Compose enables this functionality by default. Simply starting our project with a `docker-compose.yml` file allows our services to have connections and communicate within their internal network.

In the `index.js` of node3, I've created an endpoint that directly calls node1 and returns the response there.
```js
app.get('/node3/getFromNode1', async (req, res) => {
    try {
      const response = await fetch('http://node1:3000/node1');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.text();
      res.send(`data from node1: ${data}`);
      
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
```

#### Conclusion
Nginx is an important part of modern web development. It's important to remember that reverse proxy is just one of its many useful features. 








