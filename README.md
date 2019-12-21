##  Melbourne City On-street Parking Finder

This is a web app that helps you find available on-street parking in Melbourne CBD. The real-time parking sensor data is provided by [City of Melbourne's Open Data Platform](https://data.melbourne.vic.gov.au/Transport-Movement/On-street-Parking-Bay-Sensors/vh2v-4nfs).

This React web app is designed to work with a serverless, Node.js [find-parking](https://github.com/hingyeung/find-parking) API backend. All deployment-related scripts are designed to work with Amazon Web Services.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Development

### Local environment config file
Create .env.local in project root
```
> cat .env.local
REACT_APP_MapboxAccessToken=<MAPBOX_TOKEN>
# url to your find-parking node.js server
REACT_APP_API_URL=http://localhost:8882/findAvailableParkings
```

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm start_stubby`

Start a local [Stubby server](https://github.com/mrak/stubby4node) to serve test data.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Deployment

### Create configuration for the target environment
`> cp .env-infra-template .env.infra-test`
```
CDK_AWS_REGION=ap-southeast-2
CDK_AWS_ACCOUNT=
CDK_AWS_ROUTE53_HOSTED_ZONE_NAME=zone.example.com
CDK_AWS_BUCKET_NAME=app.zone.example.com
CDK_DOMAIN_NAME=app.zone.example.com
```

### Deploy to AWS
Deploys artefacts from `build` directory to the S3 bucket ${CDK_AWS_BUCKET_NAME}, creating SSL certificate for ${CDK_DOMAIN_NAME}, creating CloudFront distribution and Route 56 record for ${CDK_DOMAIN_NAME}. This command is usually used after `npm run build` to ensure production version of the app is deployed.  

`> npm run deploy:ui  --stack-name-suffix=test --env=${aws_environment}`  

### Others
The image sprites used in this web app was created using [TexturePacker](https://www.codeandweb.com/texturepacker).
