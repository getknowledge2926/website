# Course Management & Fee Updating Guide

This guide explains how to manage the **AI Development** course, adjust batch dates, modify fees, or add new courses to **Get Knowledge** using **[`js/config.js`](../js/config.js)**.

---

## 1. Current Available Course: AI Development

In `js/config.js`, the course is configured as follows:

```javascript
{
  id: "ai-development",
  title: "AI Development",
  badge: "20-Day Live Cohort",
  category: "development",
  categoryName: "Artificial Intelligence",
  shortDescription: "Master production AI engineering in 20 days. Build backend APIs, integrate LLMs, create document ingestion pipelines, search with vector databases, build RAG systems, and deploy autonomous agentic AI workflows for ₹199.",
  fee: 199, // All-inclusive fee in INR
  duration: "20 Days (Intensive Live Program)",
  level: "Beginner to Intermediate",
  classFormat: "Live Online on Google Meet",
  schedule: "Daily Live Sessions (Mon – Fri), 7:30 PM – 9:00 PM IST",
  nextBatchDate: "Starting Next Cohort",
  language: "English & Hindi (Bilingual)",
  featured: true,
  instructor: {
    name: "Nandha Prakash",
    role: "Software Developer, Slate AI",
    bio: "Software Developer at Slate AI specializing in backend systems, LLM orchestration, vector databases, RAG architecture, and production agentic AI workflows.",
    avatar: "assets/images/instructor-nandha.svg"
  },
  // ...
}
```

---

## 2. Updating Batch Schedule or Fee

To update the batch start date or timing:
1. Open `js/config.js`.
2. Locate `schedule` or `nextBatchDate` and update the string:
   ```javascript
   schedule: "Daily Live Sessions, 7:00 PM – 8:30 PM IST",
   nextBatchDate: "Starting 1st of Next Month",
   ```
3. To change the course fee (e.g. from ₹199):
   ```javascript
   fee: 199,
   ```
4. Save the file. All pages and payment calculators update immediately!

---

## 3. Adding New Courses in the Future

If you want to offer additional courses later, simply append a new course object to the `courses` array in `js/config.js`. The search filters, catalog, course detail routing, and payment calculators will automatically accommodate the new courses.
