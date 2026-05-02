
# FluentDoc

FluentDoc is a backend project developed with Java 17 and Spring Boot 3, utilizing Maven as the build tool. It is designed to provide a comprehensive solution for [briefly describe what your project does or its primary goal]. With Swagger integrated for API documentation, FluentDoc ensures easy testing and interaction with its APIs.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following software installed on your system:

- Java JDK 17
- Maven
- Any IDE that supports Java (IntelliJ IDEA, Eclipse, VS Code, etc.)
- Docker (optional)

### Installing and running the application

>**IMPORTANT!**
Optional: use `src/main/resources/application-local.yml` (not tracked in Git) for environment-specific overrides such as datasource URLs or API keys.

- Sensitive values can also be supplied via environment variables in CI and production.

Follow these steps to get your development environment running:

1. Clone the repository to your local machine:
   ```sh
   git clone [repository URL]
   ```
2. Navigate to the project directory:
   ```sh
   cd FluentDoc
   ```
3. Use Maven to build the project:
   ```sh
   mvn clean package
   ```
4. Run the application:
   ```sh
   SPRING_PROFILES_ACTIVE=local mvn spring-boot:run
   ```

Alternatively, you can update intelliJ to run the `local` profile by default.

If you need a copy of the current `application-local.yml`, feel free to contact [patrick_gaston@fluentdoc.com](mailto:patrick_gaston@fluentdoc.com).

The application should now be running on `http://localhost:8080`.

## Running with Docker

This application can be easily containerized using Docker. Below are the steps for building a Docker image, running the application in a container, and managing the container.

### Prerequisites

Ensure Docker is installed on your machine. You can download and install Docker from [Docker's official website](https://www.docker.com/get-started).

### Dockerfile

The application is containerized using the provided `Dockerfile`. The `Dockerfile` uses a base image with Java 17 and includes necessary configurations to run the Spring Boot application.

### Building the Docker Image

To build a Docker image from the Dockerfile, run the following command in the root directory of the project (where the `Dockerfile` is located):

> the `-f Dockerfile.dev` flag is used to specify the name of the Dockerfile to use. 
> The default Dockerfile is used for production builds, while the Dockerfile.dev is used for development builds.
```bash
docker build -f Dockerfile.dev -t your-image-name .
```

Replace `your-image-name` with the desired name for your Docker image _(example: fluentdoc-api-test)_.

### Running the Docker Container

After building the Docker image, you can run the application in a Docker container using the following command:

```bash
docker run -p 8080:8080 your-image-name
```

Replace `your-image-name` with the name you provided when building the Docker image.

Optional Flags:
- `-p 8080:8080`: Maps port 8080 on the host machine to port 8080 in the container. This allows you to access the application running in the container at `http://localhost:8080`.
- `-d`: Runs the container in detached mode (background). Omit this flag if you want to see the container logs in the terminal.

### Managing the Docker Container

You can manage the Docker container using the following commands:

- To list all running containers:
  ```bash
  docker ps
  ```
- To stop a running container:
  ```bash
    docker stop container-id
    ```
- To remove a container:
   ```bash
    docker rm container-id
    ```
- To remove an image:
   ```bash
    docker rmi image-id
    ```
- To list all images:
   ```bash
    docker images
    ```
- To remove all containers:
   ```bash
    docker rm $(docker ps -a -q)
    ```
- To remove all images:
   ```bash
    docker rmi $(docker images -q)
    ```
- To remove all images and containers:
   ```bash
    docker system prune -a
    ```
- To remove all images, containers, volumes, and networks:
   ```bash
    docker system prune -a --volumes
    ```
- To remove all stopped containers:
   ```bash
    docker container prune
    ```
- To remove all unused images:
   ```bash
    docker image prune
    ```
- To remove all unused volumes:
   ```bash
    docker volume prune
    ```
- To remove all unused networks:
   ```bash
    docker network prune
    ```

### Optional: Running with Docker Compose

If you prefer using Docker Compose to manage your application and its dependencies, you can create a `docker-compose.yml` file and define your services. Below is an example of a `docker-compose.yml` file for running the FluentDoc application:

```yaml
version: '3.8'

services:
  fluentdoc:
    image: your-image-name
    ports:
      - "8080:8080"
```

Replace `your-image-name` with the name of the Docker image you built earlier. Then, run the following command in the same directory as your `docker-compose.yml` file:

```bash
docker-compose up
```

This command will start the FluentDoc application in a Docker container using the image specified in the `docker-compose.yml` file.

You can bring down the services by running:

```bash
docker-compose down
```


## How to create a jar file

```bash
mvn clean package
```

## Deployment steps:
1. Create a jar file
2. Upload the jar file to AWS Elastic Beanstalk (Elastic Beanstalk > Environments > Fluentdocservice-env > Upload and Deploy)


## Using Swagger UI
FluentDoc's API documentation is accessible through Swagger UI. Once the application is running, visit the following URL to interact with the API:

```
http://localhost:8080/swagger-ui/index.html
```

Here, you can test all available API endpoints, view request/response models, and interact directly with the backend services.


## Authors
* **Patrick Gaston** - [Website](https://www.patrickgaston.com)

## License
No current license.

## Acknowledgments
- Hat tip to anyone whose code was used
- Inspiration
- etc.
