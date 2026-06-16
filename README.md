# Playwright with Claude Code

> AI-powered test automation using Playwright MCP Server + Claude Code  
> Test site: [LambdaTest Ecommerce Playground](https://ecommerce-playground.lambdatest.io/)

This project demonstrates how to use **Claude Code** with the **Playwright MCP Server** to describe, generate, and run end-to-end tests — without writing test code manually. It accompanies the TestMu AI blog post: _"Using Playwright with Claude Code: Complete Guide to AI Test Automation."_

---

## Project Structure

```
playwright-with-claude-code/
├── .github/
│   └── prompts/
│       └── playwright-manual-test-report-guide.md  # Claude Code prompt guide
├── .vscode/
│   └── mcp.json                                     # Playwright MCP Server config for VS Code
├── tests/
│   └── e2e/
│       ├── homepage.spec.ts                         # Homepage tests
│       ├── product-search.spec.ts                   # Search & navigation tests
│       ├── cart-checkout.spec.ts                    # Cart & checkout flow tests
│       └── auth.spec.ts                             # Login & registration tests
├── screenshots/                                     # Captured screenshots (on failure)
├── videos/                                          # Recorded videos (on failure)
├── test-results/                                    # Raw test output & JSON results
├── playwright.config.ts                             # Playwright configuration
├── tsconfig.json                                    # TypeScript configuration
├── package.json                                     # Project dependencies & scripts
└── .gitignore
```

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Claude Code** — Install via npm (see below)
- A **Claude.ai account** (Pro plan or API key)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/playwright-with-claude-code.git
cd playwright-with-claude-code
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

This installs Chromium, Firefox, and WebKit browser binaries.

### 4. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Authenticate with your Claude.ai account:

```bash
claude
```

Follow the login prompt in your browser.

---

## Using Claude Code with Playwright MCP

This is the core workflow the blog demonstrates. Instead of writing test code, you **describe** what you want to test and Claude Code handles the rest.

### Step 1: Start Claude Code in the project directory

```bash
cd playwright-with-claude-code
claude
```

### Step 2: Connect the Playwright MCP Server

Claude Code reads `.vscode/mcp.json` automatically in VS Code. To connect via the CLI, add this to your `~/.claude/mcp_servers.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### Step 3: Describe your test scenario

Once Claude Code is running, describe what you want tested in plain English:

```
Navigate to https://ecommerce-playground.lambdatest.io/ and test the 
search functionality. Search for "MacBook", verify results appear, 
click the first product, and confirm the product detail page loads 
with an Add to Cart button.
```

Claude Code will:
1. Use the Playwright MCP tools to navigate and explore the site
2. Identify the relevant DOM elements and page structure
3. Generate a TypeScript test file in `tests/e2e/`
4. Optionally run the test and report results

---

## Running Tests Locally (Traditional Playwright)

If you prefer to run the pre-written TypeScript test files without Claude Code, use these commands:

### Run all tests

```bash
npx playwright test
```

### Run tests with the Playwright UI (interactive mode)

```bash
npx playwright test --ui
```

### Run a specific test file

```bash
npx playwright test tests/e2e/homepage.spec.ts
```

### Run tests in headed mode (visible browser)

```bash
npx playwright test --headed
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

### Run a specific test by name

```bash
npx playwright test -g "should load homepage and display site title"
```

### Run tests for a specific browser only

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run only e2e tests

```bash
npx playwright test tests/e2e/
```

### View the HTML test report

```bash
npx playwright show-report
```

---

## Test Coverage

| File | Description |
|---|---|
| `homepage.spec.ts` | Page title, navigation, search bar |
| `product-search.spec.ts` | Search results, empty states, product navigation |
| `cart-checkout.spec.ts` | Add to cart, quantity update, item removal, checkout redirect |
| `auth.spec.ts` | Login form, invalid credentials, registration validation |

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---|---|
| Base URL | `https://ecommerce-playground.lambdatest.io/` |
| Test directory | `./tests/e2e` |
| Screenshots | On failure only |
| Videos | Retained on failure |
| Trace | On first retry |
| Browsers | Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari |

---

## Manual Testing with Claude Code (Prompt Guide)

The `.github/prompts/playwright-manual-test-report-guide.md` file contains a structured prompt you can use with Claude Code to run exploratory/manual tests and generate markdown reports.

To use it in VS Code with GitHub Copilot or Claude Code:
1. Open the Command Palette (`Cmd/Ctrl + Shift + P`)
2. Select **"Chat: Run Prompt"**
3. Choose `playwright-manual-test-report-guide.md`
4. Provide your target URL and scenario

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
- [TestMu AI Blog](https://www.testmuai.com/blog/)
- [LambdaTest Ecommerce Playground](https://ecommerce-playground.lambdatest.io/)
