# Deployment Plan

This application is a React frontend built with `react-scripts` and produces a static production bundle via `npm run build`.

## Containerize the app

1. Use a `Dockerfile` that:
   - uses a Node.js image to install dependencies and build the app
   - uses a lightweight web server image such as `nginx` to serve the production static files

## Azure deployment approach

1. Build the image locally or in CI:
   - `docker build -t frontend-app .`
2. Push the image to Azure Container Registry (ACR).
3. Deploy the image using:
   - **Azure Kubernetes Service (AKS)**: if you need Kubernetes orchestration.
4. Configure TLS using Azure-managed certificates or App Service SSL bindings.
5. Optionally put Azure Front Door or Azure CDN in front to improve performance and global delivery.

## CI/CD and environment notes

- Use GitHub Actions or Azure Pipelines to automate:
  - dependency install
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run security-scan`
  - Docker image build and push
  - deployment to the target container service
- If the frontend needs an API backend, configure CORS and runtime endpoint values through environment variables or a proxy.
- For a static React frontend, the container image is primarily a delivery mechanism; the production assets are the built `build/` folder.

## Summary

Deploying this app with containers means building the React app, packaging the static output into a web server container, and running that container on AWS ECS/Fargate or Azure App Service/ACI. The key steps are image build, registry push, and managed container service deployment with HTTPS in front.
