# Pollygot

Philosophy: 

- This frontend should connect only to services with RESTful APIs or Websockets. It should be as thin as possible. Most of the heavy lifting should be done by the apps that it connects to.
- Each app should do a specific thing well. Preferably Pollygot should connect to existing Opensource applications.
- Each app should be one instance. Eg: don't connect to S3 and GCP Cloud Storage in the same app (Squirrel). Instead, instantiate two Squirel Apps, one with the S3 config and one with the GCP config. 
- Each app should provide core functionality, and each feature should be weighed up as 80/20. If it's outside the 80/20 then the use case is probably too advanced and should be a separate app altogether. Generally speaking, we can't be all things to all people.

## Usage

It's recommended that you fork this repo so that you can pull updates at any time

```bash
# If you downloaded or cloned, you should create an upstream branch with the original repo
git remote add upstream https://github.com/pollygot/restiface

# Keep updated at any time
git fetch upstream # fetch changes from Pollygot
git checkout master # switch to your local master branch
git merge upstream/master # update local master with changes from Pollygot
```

## Development

``` bash
npm install # install dependencies
npm run dev # serve with hot reload at localhost:3000
```

## Deployment

``` bash
# build for production and launch server
npm run build
npm start
```
