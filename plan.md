Below is a detailed plan in markdown outlining all necessary files, changes, and best practices for building the sustainability-focused browser extension MVP using a mock data approach. This extension will detect product pages (Amazon, Flipkart, Myntra, etc.), inject a floating sustainability badge with a quick impact score (Green/Yellow/Red), and display alternative sustainable offers (with discount/incentive information) in an extension popup.

---

## 1. Project Structure and Dependent Files

Create a new folder at the project root named **extension**. Inside this folder, add the following files:

- **manifest.json** – Defines the extension’s configuration.
- **content.ts** – The content script that runs on product pages.
- **popup.html** – The HTML file for the extension popup UI.
- **popup.ts** – (Optional) Script to add dynamic behavior to the popup.
- **styles.css** – CSS styles for the popup UI and injected badge.
- **mock-data.ts** – Provides static mock data for sustainability scores and alternative suggestions.

*Note: If any of these files or their dependencies are missing in later exploration, re-read and re-plan accordingly.*

---

## 2. Detailed Step-by-Step Outline

### A. manifest.json
- **Purpose:** Configures the extension (using Manifest V3) and registers the content script and popup.
- **Changes:**
  - Define `"manifest_version": 3`, name, version, and permissions (e.g., `"activeTab"`, `"storage"`).
  - Specify the content scripts to run on URLs matching Amazon, Flipkart, and Myntra.
  - Set a `"action"` block to load the popup.
- **Error Handling:** Validate JSON schema and catch missing keys during development.

*Example snippet:*
```json
{
  "manifest_version": 3,
  "name": "Sustainability Badge Extension MVP",
  "version": "0.1",
  "description": "Detects product pages and displays sustainability impact score with alternative offers.",
  "permissions": ["activeTab", "storage"],
  "content_scripts": [
    {
      "matches": ["*://*.amazon.com/*", "*://*.flipkart.com/*", "*://*.myntra.com/*"],
      "js": ["content.js"],
      "run_at": "document_end"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Sustainability Insights"
  }
}
```

---

### B. content.ts
- **Purpose:** Detects when the user navigates to product pages and injects a badge element into the page.
- **Steps:**
  1. Check `window.location.href` for keywords (e.g., "amazon", "flipkart", "myntra").
  2. Use a try/catch to safely create and inject a new div element into the DOM.
  3. Use inline styles or insert a style tag (or load from the extension’s styles.css) to style the badge.
  4. Set the text/content to show the sustainability impact score (mock value) and attach an onclick event to open the popup.
- **Error Handling:** Surround DOM operations with try/catch and log issues gracefully to the console.

*Example pseudo-code:*
```typescript
try {
  const url = window.location.href.toLowerCase();
  if (/(amazon|flipkart|myntra)/.test(url)) {
    const badge = document.createElement("div");
    badge.id = "sustainability-badge";
    badge.textContent = "Sustainability: Green";
    // Basic inline styling (or add a class and load from styles.css)
    badge.style.cssText = "position:fixed; bottom:20px; right:20px; background:#d1e7dd; color:#0f5132; padding:10px 16px; border-radius:8px; font-family:sans-serif; cursor:pointer; z-index:10000;";
    badge.onclick = () => {
      // Open extension popup or send a message to background/popup scripts
      window.open(chrome.runtime.getURL("popup.html"), "_blank", "width=360,height=640");
    };
    document.body.appendChild(badge);
  }
} catch (error) {
  console.error("Error injecting sustainability badge:", error);
}
```

---

### C. popup.html
- **Purpose:** Provides the user interface for detailed sustainability insights.
- **Steps:**
  1. Create a clean HTML structure with semantic elements.
  2. Add sections for:
     - Sustainability badge details (score explanation).
     - Alternative product suggestions (list 1–2 alternatives with mock details).
     - "Get Rewards" section that shows discount or cashback details.
  3. Link to the local stylesheet (styles.css) and the popup script (popup.ts) if needed.
- **UI/UX:** Use modern typography, ample white space, and a responsive flex or grid layout without using any external icon libraries or SVGs.
- **Example snippet:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sustainability Insights</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Sustainability Insights</h1>
    </header>
    <section class="badge-details">
      <h2>Product Impact Score</h2>
      <p>Your product has been rated: <span class="score green">Green</span></p>
    </section>
    <section class="alternatives">
      <h2>Better Options</h2>
      <ul id="alternative-list">
        <!-- Alternative items populated by popup.ts using mock-data -->
      </ul>
    </section>
    <section class="rewards">
      <button id="get-rewards-button">Get Rewards</button>
    </section>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

---

### D. popup.ts
- **Purpose:** Dynamically populate the popup UI with mock data and handle user interactions.
- **Steps:**
  1. Import or include the mock data from `mock-data.ts`.
  2. On DOMContentLoaded, iterate through the alternatives and insert list items into the `#alternative-list` element.
  3. Add click event handlers for the "Get Rewards" button.
- **Error Handling:** Check if the mock data is available; if not, display a friendly message.

*Example pseudo-code:*
```typescript
import { alternatives } from "./mock-data";

document.addEventListener("DOMContentLoaded", () => {
  const listElement = document.getElementById("alternative-list");
  if (listElement && alternatives.length > 0) {
    alternatives.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ESG Score: ${item.score} - Save ${item.discount}%`;
      li.style.marginBottom = "8px";
      listElement.appendChild(li);
    });
  } else {
    listElement.textContent = "No alternative suggestions available.";
  }
  
  const rewardsButton = document.getElementById("get-rewards-button");
  rewardsButton?.addEventListener("click", () => {
    alert("Discount code: SUSTAIN20");
  });
});
```

---

### E. styles.css
- **Purpose:** Provide modern, clean styling for the popup UI.
- **Steps:**
  1. Define typography, spacing, and color variables to maintain a consistent, modern look.
  2. Style the container, headers, buttons, and list items.
  3. Ensure responsiveness using flex or grid layouts.
- **Example snippet:**
```css
body {
  font-family: sans-serif;
  background-color: #f8fafc;
  margin: 0;
  color: #333;
}

.container {
  padding: 16px;
  max-width: 360px;
  margin: auto;
}

header h1 {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.badge-details, .alternatives, .rewards {
  margin-bottom: 16px;
}

.score.green {
  color: #0f5132;
  font-weight: bold;
}

button {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 10px 14px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #0b5ed7;
}
```

---

### F. mock-data.ts
- **Purpose:** Provide static data for sustainability scores and alternative suggestion items.
- **Steps:**
  1. Export an array of objects representing alternative products.
  2. Each object should include fields such as `name`, `score`, and `discount`.
- **Example snippet:**
```typescript
export const alternatives = [
  { name: "Eco-Friendly T-Shirt", score: "Green", discount: 15 },
  { name: "Sustainable Sneakers", score: "Green", discount: 10 }
];
```

---

## 3. Integration and Testing Considerations

- **Integration with Next.js:**  
  The extension code is maintained in a separate folder for clarity. No modifications to the main Next.js app (in src/) are required for the MVP. However, you can reuse shared utilities (from src/lib) if needed.
  
- **Error Handling & Best Practices:**  
  Each script (content, popup) includes try/catch blocks for DOM operations and data retrieval. Validate manifest.json and JSON data formats to avoid runtime errors in production.
  
- **Testing:**  
  Manually load the extension in Chrome/Firefox developer mode. Use the browser’s console to monitor error messages from the content script and verify that the popup correctly shows alternative suggestions based on mock data.

---

## Summary

- Created a dedicated **extension** folder housing manifest.json, content.ts, popup.html, popup.ts, styles.css, and mock-data.ts.  
- The manifest registers content scripts that detect product pages and an action popup for sustainability insights.  
- The content script injects a styled badge with a quick ESG score and click-to-open functionality.  
- The popup provides a modern, responsive UI with a sustainability score explanation, alternative options populated from mock data, and a rewards button.  
- Error handling uses try/catch blocks and checks for missing data for a robust, MVP experience.  
- Integration with the Next.js project is isolated, ensuring reusability and clear separation of concerns.
