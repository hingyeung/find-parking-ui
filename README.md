h1. Melbourne City On-street Parking Finder

This is a web app that helps you find available on-street parking in Melbourne CBD. The real-time parking sensor data is provided by [City of Melbourne's Open Data Platform](https://data.melbourne.vic.gov.au/Transport-Movement/On-street-Parking-Bay-Sensors/vh2v-4nfs).

This React web app is designed to work with a serverless, Node.js [backend](). All deployment-related scripts are designed to work with Amazon Web Services.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy -- <s3_bucket_name>`

Deploys artefacts from `dist` directory to the nominated S3 bucket. This command is useful if you host this web app using [S3 static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html). This command is usually used after `npm run build` to ensure production version of the app is deployed.

### `npm init_infrastructure -- <HOSTED_ZONE> <FQDN> <ACM_CERT_ARN>`

  e.g. `npm run init_infrastructure -- example.com app.example.com arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`

Performs the initial infrastructure setup in AWS. This is the high level outlines of what it does:
1. creates a S3 bucket using `FQDN` as bucket name and enabled static website hosting.
1. deploys a CloudFront distribution with the provided certificate hosted in ACM (`ACM_CERT_ARN`) and points the CloudFront distribute the S3 bucket created in the previous step.
1. in Route53, setup a DNS A record alias in `HOSTED_ZONE` hosted zone and points it to the CloudFront distribution created in the previous step.

See [find-parking-ui-cf.yaml](scripts/find-parking-ui-cf.yaml) for more details.
