# Pollygot

Pollygot provides a single UI/dashboard for your team to perform various tasks. Wherever possible it plugs into existing opensource solutions.

This is a monorepo that includes:

- A fully customisable CRUD interface for any Postgres database (using [PostgREST](https://postgrest.org/en/v5.0/api.html))
- An interface for managing [Kong](https://github.com/Kong/kong)
- An interface for managing files stored in S3 or GCP Cloud Storage
- An interface for managing [Kue](https://github.com/Automattic/kue)
- An interface for doing common long running tasks (BumbleBee)

Soon/Maybe:

- Mailtrain
- Build ML models on top of Postgres
- Headless CMS / Contentful
- DKron interface
- Possible support for Bull / RabbitMQ

Pollygot allows developers to deploy solutions which are immediately usable for non-tech team members (with little on no additional coding).

Product philosophy:̨

- This frontend should connect only to services with RESTful/Graph APIs or Websockets. It should be as thin as possible. Most of the heavy lifting should be done by the apps that it connects to.
- Support existing opensource solutions where possible (even better if they have an existing web API)
- Each app should do a specific thing well. Each app should provide core functionality, and each feature should be weighed up as 80/20. If it's outside the 80/20 then the use case is probably too advanced and should be a separate app altogether.
- Each app should be one instance but may be configured for different providers. Eg: don't connect to S3 and GCP Cloud Storage in the same app (Squirrel). Instead, instantiate two Squirel Apps, one with the S3 config and one with the GCP config.

## Development

```bash
npm install # install dependencies
npm run dev # serve with hot reload at localhost:3000
```

Development Philosophy:

- Simplicity. The code should be as simple as possible. Remove all crap.
- Thin (functional) components fat (imperitave) pages. Try to keep the components as light as possible so they can be reused everywhere. This will end up with some very heavy pages that are doing lots of things, and also may result in a lot of code duplication at the start. However this is a comfortable trade-off for the confidence that it will bring to make changes to components without having to re-engineer other areas of the site. Also testing is very minimal at this stage, so changes to shared code is probably going to cause changes
- Refactor. Don't prematurely try to create the perfect code base from the start. You think some code will be reused so you put it into a common file or in the store - but what if it's never reused? Then your code is complicated than it needed to be. Refactoring decisions
  - is this slow?
  - is this confusing?
  - is this untestable?
  - is this immutable?
  - am I _currently_ using this code in multiple places? Don't prematurely optimize for this
- Boy scout. See a small improvement to clean up the code, or add comments? Make the change, then commit with `boy scout`. No other commit message is required. Small changes are welcomed.

## Deployment

```bash
# build for production and launch server
npm run build
npm start
```
