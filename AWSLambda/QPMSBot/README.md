# lambda-deploy

## 1.
- Go to: https://console.aws.amazon.com/ecr/repositories
- Click "Create repository" set name and click "Create repository" again
- Open repository
- Click "View push commands"
- Follow these instructions

## 2.
- open deploy.sh
- replace "testing-ljmocic" and "deploy-ecr-ljmocic" with yours container and registry name
- run deploy.sh (You will need to have docker installed)

## 3.
- Go to AWS Lambda page
- Choose "Create function"
- Create from container
- Add previously added container
- Add test event and click test
