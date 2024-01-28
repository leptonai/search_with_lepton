# Bobtail.DEV

Poor-man's oss perplexity.ai/phind.com implementation

Originally for [AGI Hackathon on Vector Search 01/27](https://partiful.com/e/FiSdgG2vIKCCp2PW0g36), see [hackathon-01-27](https://github.com/wsxiaoys/bobtail.dev/tree/hackathon-01-27) branch for the version built in hackathon.

1. The UI is adapted from https://github.com/leptonai/search_with_lepton.
2. Language model inference is implemented using an OpenAI-compatible interface.
3. A vector embedding-based cache is implemented for query embeddings; vector search is conducted via convex.dev.