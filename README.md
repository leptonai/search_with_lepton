<div align="center">
<h1 align="center">Search with Lepton</h1>
Build your own Perplexity/Phind using less than 500 lines of code.
<br/>
<br/>
<img width="645" src="https://github.com/leptonai/search_with_lepton/assets/1506722/845d7057-02cd-404e-bbc7-60f4bae89680" height="500">
</div>


## Features
- Built-in support for LLM
- Built-in support for search engine
- Customizable pretty UI interface
- Shareable, cached search results

## Setup Search Engine API

> [!NOTE]
> Visit [here](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api) to get your Bing subscription key.

## Setup LLM and KV

> [!NOTE]
> We recommend using the built-in llm and kv functions with Lepton. 
> Running the following commands to set up them automatically.

```shell
pip install -U leptonai && lep login
```


## Development / Build

1. Set Bing subscription key
```shell
export BING_SEARCH_V7_SUBSCRIPTION_KEY=YOUR_BING_SUBSCRIPTION_KEY
```
2. Run server
```shell
python search_with_lepton.py
```
3. Run web
```shell
cd web && npm install && npm run dev # dev web
```

```shell
cd web && npm install && npm run build # build web
```


## Deploy

You can deploy this to Lepton AI with one click:

[![Deploy with Lepton AI](https://github.com/leptonai/search_with_lepton/assets/1506722/bbd40afa-69ee-4acb-8974-d060880a183a)](https://dashboard.lepton.ai/workspace-redirect/explore/detail/search)

You can also deploy your own version via

```shell
lep photon run -n search-with-lepton-modified -m search_with_lepton.py
```

Learn more about `lep photon` [here](https://www.lepton.ai/docs).