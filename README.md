# Pollygot

Product philosophy:

- This frontend should connect only to services with RESTful/Graph APIs or Websockets. It should be as thin as possible. Most of the heavy lifting should be done by the apps that it connects to.
- Support existing opensource solutions where possible (as long as they have a web API)
- Each app should do a specific thing well. Each app should provide core functionality, and each feature should be weighed up as 80/20. If it's outside the 80/20 then the use case is probably too advanced and should be a separate app altogether. 
- Each app should be one instance but may be configured for different providers. Eg: don't connect to S3 and GCP Cloud Storage in the same app (Squirrel). Instead, instantiate two Squirel Apps, one with the S3 config and one with the GCP config.


## Development

``` bash
npm install # install dependencies
npm run dev # serve with hot reload at localhost:3000
```

Development Philosophy:

- Fat pages and thin components. Try to keep the components as light as possible so they can be reused everywhere. This will end up with some very heavy pages that are doing lots of things, and also may result in a lot of code duplication at the start. However this is a comfortable trade-off for the confidence that it will bring to make changes to components without having to re-engineer other areas of the site. Also testing is very minimal at this stage, so changes to shared code is probably going to cause changes
- Refactor. Don't worry about creating the perfect code base from the start. Move fast, then refactor when we have a better idea of what the codebase is going to look like.
- Boy scout. See a small improvement to clean up the code, or add comments? Make the change, then commit with `boy scout`. No other commit message is required. Small changes are welcomed.

## Deployment

``` bash
# build for production and launch server
npm run build
npm start
```
