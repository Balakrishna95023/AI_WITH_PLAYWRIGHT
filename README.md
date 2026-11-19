# AI-Assisted UI Locator Discovery with Semantic Search

A Node.js proof of concept that converts a natural-language description of a web UI element into a candidate Playwright-style locator.

The project explores how semantic search and locally generated embeddings can reduce the effort involved in manually inspecting HTML and writing UI selectors.

> **Current scope:** The main locator flow extracts elements from a local HTML file, indexes their descriptions in Chroma, searches the index using an Ollama embedding, and prints the best matching locator. It does **not currently open a browser or execute the returned locator**. Playwright is included in the project dependencies and configuration, but browser interaction is not part of `runLocatorFlow.js` at present.

## Problem this project explores

In UI automation, test authors often spend time inspecting page markup to identify selectors for buttons, inputs, links, and other controls. This prototype explores a natural-language alternative:

- Describe the element you want in ordinary language.
- Convert the page's supported UI elements into searchable documents.
- Generate embeddings locally through Ollama.
- Retrieve the closest matching element from Chroma.
- Return a candidate selector that can be reviewed and used in a Playwright test.

For example:

```text
Find the password button
```

The repository includes an example output in which this query resolves to:

```text
#password
```

The result is a candidate locator, not proof that the element is unique, visible, enabled, or safe to interact with. Always validate it against the target page.

## How it works

```text
page.html
   |
   v
parseHTML.js
   |  Extracts buttons, inputs, textareas, selects and links
   v
change_to_meaning_full_json.js
   |  Builds elements.json with text descriptions and metadata
   v
chromaStore.js
   |  Builds a candidate locator and stores element embeddings
   v
Chroma collection: ui_elements
   ^
   |  Semantic similarity search
searchLocator.js <--- Natural-language query
   |
   v
Candidate locator printed to the console
```

### Main components

| File | Responsibility |
|---|---|
| `parseHTML.js` | Parses the supplied HTML with Cheerio and extracts supported UI elements and attributes. |
| `change_to_meaning_full_json.js` | Converts extracted elements into descriptive JSON documents in `elements.json`. |
| `embed.js` | Calls the local Ollama service using the `nomic-embed-text` embedding model. |
| `chromaStore.js` | Creates candidate selectors and stores embeddings, document text and metadata in the `ui_elements` Chroma collection. |
| `searchLocator.js` | Embeds a natural-language query, searches Chroma and returns the locator from the closest result. |
| `runLocatorFlow.js` | Runs extraction, indexing and locator search in sequence. |
| `page.html` | Local HTML input used by the extraction process. |
| `elements.json` | Generated intermediate data file containing extracted element descriptions and metadata. |
| `playwright.config.js` and `tests/` | Playwright Test configuration and example test scaffolding. The example tests currently use `test.skip`. |

## Technology stack

- **Node.js** – runs the scripts.
- **Cheerio** – parses HTML.
- **Ollama** – generates text embeddings locally.
- **`nomic-embed-text`** – embedding model configured in `embed.js`.
- **ChromaDB** – stores and retrieves vector embeddings.
- **Playwright / Playwright Test** – included as browser automation dependencies and test scaffolding; the current locator flow returns a selector but does not execute it in a browser.

## Prerequisites

Install and configure the following before running the project:

1. Node.js (use a current supported LTS release).
2. npm.
3. Ollama, running locally and exposing its service at `http://localhost:11434`.
4. The `nomic-embed-text` model available in Ollama.
5. A Chroma server reachable at `localhost:8000`.

The service addresses and model name above match the current source configuration in `embed.js`, `chromaStore.js` and `searchLocator.js`. If your services use different addresses, update those configuration values in the source before running the scripts.

### Start the local AI and vector services

Start Ollama using its normal local service startup method, then make sure the configured embedding model is available:

```bash
ollama pull nomic-embed-text
```

Start a Chroma server separately and make sure it is listening on:

```text
localhost:8000
```

Chroma server installation and startup are environment-dependent; use the official Chroma documentation for the method appropriate to your environment.

## Installation

Clone the repository and install the Node.js dependencies:

```bash
git clone https://github.com/Balakrishna95023/AI_WITH_PLAYWRIGHT.git
cd AI_WITH_PLAYWRIGHT
npm install
```

## Run the locator workflow

Build the element index and search for a UI element in one command:

```bash
npm run run-locator-flow -- "Find the password button"
```

The script performs these steps:

1. Reads `page.html`.
2. Extracts supported UI elements.
3. Writes the extracted descriptions and metadata to `elements.json`.
4. Generates embeddings and stores the records in Chroma.
5. Embeds the supplied query and searches the `ui_elements` collection.
6. Prints the locator associated with the closest search result, or a message if no locator is returned.

### Run the individual stages

You can also execute the stages separately:

```bash
# Extract UI elements and create elements.json
npm run extract-elements

# Store element embeddings and metadata in Chroma
npm run store-elements

# Search for a locator
npm run search-locator -- "Find the password button"

# Run extraction, indexing and search as one workflow
npm run run-locator-flow -- "Find the password button"
```

`npm run build-index` runs extraction and storage:

```bash
npm run build-index
```

Run the commands in the order shown when executing individual stages. The Chroma collection must be available before the storage and search stages.

## Example queries

Try natural-language descriptions that correspond to elements present in your own `page.html`, for example:

```text
Find the password input
Find the submit button
Find the search field
Find the navigation link
```

The returned result depends on the actual HTML input and the elements indexed in Chroma. These are illustrative queries; they are not guaranteed to exist in every input page.

## Supported HTML elements and extracted attributes

The current parser scans these tags:

- `button`
- `input`
- `textarea`
- `select`
- `a`

For each supported element, it captures available values such as:

- Tag name and visible text
- `id`, `name`, `type` and `class`
- `placeholder` and `aria-label`
- `value`, `href`, `title` and `role`

The current locator builder prefers an ID, followed by a name attribute, ARIA label, placeholder, text, and finally the tag name. This is a simple prioritisation strategy; it does not verify selector uniqueness or stability.

## Playwright test scaffolding

The repository contains a Playwright Test configuration and example tests:

```bash
npx playwright install
npx playwright test
```

The checked-in example tests are currently skipped, and they exercise the Playwright website rather than the AI locator workflow. They should be treated as starter scaffolding, not as automated validation of semantic locator generation.

## Operational notes and current limitations

This is a proof of concept. Before using it in a production or business workflow, consider the following:

- **No browser execution in the main flow:** the current workflow prints a candidate locator. A separate Playwright step would be needed to open the target page, apply the locator and verify the result.
- **Local HTML input:** extraction reads `page.html` from the repository directory. It does not currently crawl a live website or authenticate into an application.
- **Static element coverage:** only the five tag types listed above are extracted. Elements rendered later by JavaScript, shadow DOM content, frames and custom controls may not be captured.
- **Selector validation:** a returned selector is not checked for uniqueness, visibility, enabled state or correct business meaning.
- **Search ranking:** the current search requests one result (`nResults: 1`). It does not compare several candidates or apply a confidence threshold.
- **Index lifecycle:** the code uses a persistent Chroma collection name, `ui_elements`. Repeated indexing, stale records and duplicate IDs should be reviewed and managed before repeated or scheduled use.
- **Configuration:** service hosts and the embedding model are currently hard-coded. Externalised configuration would make the project easier to maintain.
- **Test coverage:** the sample Playwright tests are skipped and do not validate extraction, indexing, retrieval accuracy or end-to-end browser behaviour.
- **Sensitive data:** use synthetic or approved test HTML. Do not index confidential business data, customer information, credentials, session tokens or production page content unless the relevant data-handling policy explicitly permits it.

## Suggested next improvements

1. Add a Playwright execution stage that opens a controlled test page and validates the candidate locator.
2. Return the top several candidates with similarity distances and introduce a confidence threshold.
3. Add tests for HTML extraction, locator construction, indexing and search behaviour.
4. Make indexing repeatable by defining a clear collection reset/upsert strategy and stable element IDs.
5. Move service URLs and model settings into environment-based configuration.
6. Add structured logs, clear error messages and a sample report showing query, selected locator and validation outcome.
7. Add a short runbook so another team member can install dependencies, start services, run the workflow and troubleshoot common failures.

## Intended use

This repository is an experimental example of combining local AI embeddings, semantic retrieval and UI automation tooling. It is suitable for learning and controlled demonstrations. Validate generated selectors and follow your organisation's security and data-handling rules before adapting the approach to real applications.

## License

No license is currently specified in this repository. Check with the repository owner before reusing or redistributing the code.
