---
mode: agent
description: "Manually test a site and create a report"
tools: ['changes', 'search/codebase', 'edit/editFiles', 'fetch', 'openSimpleBrowser', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'search/searchResults', 'runCommands/terminalLastCommand', 'runCommands/terminalSelection', 'testFailure', 'microsoft/playwright-mcp/*']
model: 'Claude Sonnet 4.5'
---

# Manual Testing Instructions

1. Use the Playwright MCP Server to navigate to the website, take a page snapshot and analyze the key functionalities. Then manually test the scenario provided by the user. If no scenario is provided, ask the user to provide one. Do not generate any code until you have explored the website and identified the key user flows as a user would.

2. Navigate to the url provided by the user and perform the described interactions. If no url is provided, ask the user to provide one.

3. Observe and verify the expected behavior, focusing on accessibility, UI structure, and user experience.

4. Report back in clear, natural language:
   - What steps you performed (navigation, interactions, assertions).
   - What you observed (outcomes, UI changes, accessibility results).
   - Any issues, unexpected behaviors, or accessibility concerns found.

5. Reference URLs, element roles, and relevant details to support your findings.

Example report format:

- **Scenario:** [Brief description]
- **Steps Taken:** [List of actions performed]
- **Outcome:** [What happened, including any assertions or accessibility checks]
- **Issues Found:** [List any problems or unexpected results]

Generate a .md file with the report in the `manual-tests` directory and include any relevant screenshots or snapshots.

Take screenshots or snapshots of the page if necessary to illustrate issues or confirm expected behavior.

Close the browser after completing the manual test.

---

# Generating Automated Tests (Any Agent)

These instructions apply regardless of which AI agent is used — Claude Code, GitHub Copilot Chat, or any other coding assistant connected to the Playwright MCP Server. This ensures that test output is consistent no matter who on the team generates it, or which tool they used to do it.

1. **Explore before writing code.** As with manual testing above, use the Playwright MCP Server to navigate to the site and observe real behavior first. Do not generate test code based on assumptions about element names, classes, or IDs — verify them against the live DOM via the MCP snapshot/inspection tools.

2. **Write tests in TypeScript only.** All generated test files must use the `.spec.ts` extension — never `.spec.js` or plain `.js`. This project standardizes on TypeScript for type safety and consistency across the suite.

3. **Save all generated tests to `tests/e2e/`.** Do not create test files in the project root, in `tests/` directly, or in any other directory.

4. **Name files descriptively, based on the feature under test**, following the existing pattern in this repo:
   - `homepage.spec.ts`
   - `product-search.spec.ts`
   - `auth.spec.ts`
   
   Use lowercase, hyphen-separated names that describe the feature, not the agent or the date.

5. **Tag every agent-generated test with `@agentic`.** Add the tag to the test title itself, following Playwright's tag convention:

   ```typescript
   test('should display the search bar @agentic', async ({ page }) => {
     // ...
   });
   ```

   This allows anyone on the team to filter and run only agent-generated tests locally, without needing to know which tests came from an AI assistant versus those written by hand:

   ```bash
   npx playwright test --grep @agentic
   ```

   Or filter for it directly inside the Playwright UI (`npx playwright test --ui`) using the tag filter field.

6. **Do not overwrite existing test files.** If a test for the described scenario already exists in `tests/e2e/`, add a new `test()` block inside the relevant `test.describe()` group rather than replacing the file. If no matching file exists, create a new one following the naming convention above.

7. **Every generated test must be runnable independently.** Avoid relying on state left behind by other tests (e.g. assuming a previous test already added a product to the cart). Each test should set up what it needs via `page.goto()` and its own actions.

8. **Comment any non-obvious locator choice.** If a selector exists because of a site-specific quirk (e.g. a button that's technically visible but reports as hidden due to a `disabled` attribute, or a class name shared by multiple unrelated elements), leave a one-line comment explaining why — future readers (human or agent) shouldn't have to rediscover the same site behavior from scratch.

9. **If a feature appears broken on the live site** (e.g. a button that doesn't respond to clicks, a counter that doesn't update), do not write a test that asserts the broken behavior as if it were correct, and do not silently skip it either. Report this back to the user in the chat and ask whether they want the test written to reflect current (possibly buggy) behavior, skipped with a comment, or left out entirely.

10. **Log every prompt used to generate a test in `test_prompts.md`** (at the project root). This gives the team a single, readable record of exactly what was described to the agent for each test, so anyone can review, reuse, or re-run the same prompt with a different agent.

    For each test generated, append an entry in this format:

    ```markdown
    ## [Test file name] — [Test title]

    **Date:** YYYY-MM-DD
    **Agent used:** [e.g. Claude Code, GitHub Copilot Chat]

    **Prompt:**
    > [The exact prompt text the user gave the agent, copied verbatim]

    ---
    ```

    Rules for this log:
    - Always **append** new entries to the end of the file — never overwrite or remove existing entries.
    - If `test_prompts.md` does not exist yet, create it at the project root with a short header explaining its purpose before adding the first entry.
    - Copy the user's prompt **exactly as given**, without rewriting, summarizing, or correcting it — the goal is an accurate record of what was actually asked, not a cleaned-up version.
    - Each entry should map to one generated test (or one `test.describe()` block if multiple related tests were generated from a single prompt).
