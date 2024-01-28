# Bobtail.DEV

Poor-man's oss perplexity.ai/phind.com implementation

Originally for [AGI Hackathon on Vector Search 01/27](https://partiful.com/e/FiSdgG2vIKCCp2PW0g36), see [hackathon-01-27](https://github.com/wsxiaoys/bobtail.dev/tree/hackathon-01-27) branch for the version built in hackathon.

* LLM: [MistralAI/Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1)
* Embedding: [TogetherComputer/m2-bert-80M-32k-retrieval](https://huggingface.co/togethercomputer/m2-bert-80M-32k-retrieval)

1. The UI is adapted from https://github.com/leptonai/search_with_lepton
2. Language model inference is implemented using Together.AI.
3. A vector embedding-based cache is implemented for query embeddings, utilizing Together.AI as well.
4. Vector search is conducted via Convex.dev.