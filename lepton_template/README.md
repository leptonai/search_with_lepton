# Lepton Search
Build your own conversational search engine using less than 500 lines of code.

See a live demo site https://search.lepton.run/

The source code of this project lives [here](https://github.com/leptonai/search_with_lepton/). This README will detail how to set up and deploy this project on Lepton's platform.

## Setup Search Engine API

You have a few options for setting up your search engine API. You can use Bing or Google, or if you just want to very quickly try the demo out, use the lepton demo API directly.

### Bing

If you are using Bing, you can subscribe to the bing search api [here](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api). After that, write down the Bing search api subscription key. We follow the convention and name it `BING_SEARCH_V7_SUBSCRIPTION_KEY`. We recommend you store the key as a secret in Lepton.

### Google

If you choose to use Google, you can follow the instructions [here](https://developers.google.com/custom-search/v1/overview) to get your Google search api key. We follow the convention and name it `GOOGLE_SEARCH_API_KEY`. We recommend you store the key as a secret in Lepton. You will also get a search engine CX id, which you will need as well.

### SearchApi

If you want to use SearchApi, a 3rd party Google Search API, you can retrieve the API key by registering [here](https://www.searchapi.io/). We follow the convention and name it `SEARCHAPI_API_KEY`. We recommend you store the key as a secret in Lepton.

### Lepton Demo API

If you choose to use the lepton demo api, you don't need to do anything - your workspace credential will give you access to the demo api. Note that this does incur an API call cost.


## Deployment Configurations

Here are the configurations you can set for your deployment:
* Name: The name of your deployment, like "my-search"
* Resource Shape: most of heavy lifting will be done by the LLM server and the search engine API, so you can choose a small resource shape. `cpu.small` is usually good enough.

Then, set the following environmental variables.

* `BACKEND`: the search backend to use. If you don't have bing or google set up, simply use `LEPTON` to try the demo. Otherwise, do `BING`, `GOOGLE` or `SEARCHAPI`.
* `LLM_MODEL`: the LLM model to run. We recommend using `mixtral-8x7b`, but if you want to experiment other models, you can try the ones hosted on LeptonAI, for example, `llama2-70b`, `llama2-13b`, `llama2-7b`. Note that small models won't work that well.
* `KV_NAME`: the Lepton KV to use to store the search results. You can use the default `search-with-lepton`.
* `RELATED_QUESTIONS`: whether to generate related questions. If you set this to `true`, the search engine will generate related questions for you. Otherwise, it will not.
* `GOOGLE_SEARCH_CX`: if you are using google, specify the search cx. Otherwise, leave it empty.
* `LEPTON_ENABLE_AUTH_BY_COOKIE`: this is to allow web UI access to the deployment. Set it to `true`.

In addition, you will need to set the following secrets:
* `LEPTON_WORKSPACE_TOKEN`: this is required to call Lepton's LLM and KV apis. You can find your workspace token at [Settings](https://dashboard.lepton.ai/workspace-redirect/settings).
* `BING_SEARCH_V7_SUBSCRIPTION_KEY`: if you are using Bing, you need to specify the subscription key. Otherwise it is not needed.
* `GOOGLE_SEARCH_API_KEY`: if you are using Google, you need to specify the search api key. Note that you should also specify the cx in the env. If you are not using Google, it is not needed.
* `SEARCHAPI_API_KEY`: if you are using SearchApi, a 3rd party Google Search API, you need to specify the api key.

Once these fields are set, click `Deploy` button at the bottom of the page to create the deployment. You can see the deployment has now been created under [Deployments](https://dashboard.lepton.ai/workspace-redirect/deployments). Click on the deployment name to check the details. You’ll be able to see the deployment URL and status on this page.

Once the status is turned into `Ready`, click the URL on the deployment card to access it. Enjoy!
