# Task Manager Code Challenge

Welcome to the Cashew Research coding challenge!

## About This Challenge

This is a practical coding exercise designed to assess your ability to work with our technology stack. At Cashew Research, our platform is built using the same technologies you'll work with in this challenge: **Next.js**, **TypeScript**, **Prisma**, **ZenStack**, and **Tailwind CSS**.

**Time Expectation:** 1-2 hours for core tasks

**Important Notes:**

- **It's okay if you don't finish everything.** We're more interested in seeing your thought process and code quality than completing every task. Focus on doing a few things well rather than rushing through everything.

- **Fork and commit your work.** Clone or fork this repository, work on it, and commit your changes. We'll review your commit history and discuss your approach during the interview.

- **Be prepared to explain your code.** You'll walk us through your solution and explain the decisions you made. Understanding is more important than completion.

- **AI and tools are welcome.** Feel free to use AI assistants, documentation, Stack Overflow, or any other resources. However, you must understand every line of code you submit and be able to explain and justify your decisions.

---

## Technology Stack

- **Next.js 15** (App Router with Server Components)
- **TypeScript**
- **Tailwind CSS** + Shadcn UI components
- **Prisma** for database access
- **ZenStack** for access control policies
- **SQLite** database

---

## Setup Instructions

Run these commands in order:

```bash
# 1. Copy the environment variables file
cp .env.example .env

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client and ZenStack runtime
pnpm zenstack

# 4. Initialize the database
pnpm db:push

# 5. Seed with test data
pnpm db:seed

# 6. Start the development server
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Essential Resources

**⚠️ Before you start coding, review these resources. They will save you time!**

### 🔑 ZenStack v2 Documentation (REQUIRED READING)

**ZenStack is critical to this challenge and our production stack at Cashew Research.**

Task B is all about ZenStack access policies. We strongly recommend spending 15-20 minutes reading the docs before attempting Task B.

**Start here (in order):**

1. **[ZenStack Access Policy Guide](https://zenstack.dev/docs/2.x/reference/zmodel-language#access-policy)** ⭐ **READ THIS FIRST**
   - Understand `@@allow()` and `@@deny()` rules
   - Learn how `auth()` works
   - See examples of common patterns

2. **[ZenStack ZModel Language Reference](https://zenstack.dev/docs/2.x/reference/zmodel-language)**
   - Complete reference for schema syntax
   - Field types, attributes, and functions

3. **[ZenStack Quick Start (Next.js App Router)](https://zenstack.dev/docs/2.x/quick-start/nextjs-app-router)**
   - Overview of how ZenStack enhances Prisma
   - Step-by-step guide for Next.js App Router projects

**Key concepts you need to understand:**
- ✅ How `@@allow('operation', condition)` rules work
- ✅ Using `auth()` to access the current authenticated user
- ✅ Comparing relationships: `auth() == author`
- ✅ Multiple rules are combined with OR logic
- ✅ Operations: `'create'`, `'read'`, `'update'`, `'delete'`, `'all'`

**Pro tip:** The "ZenStack Quick Reference" section below has examples you can reference while coding.

---

### 📚 Additional Documentation

**Next.js 15 (App Router)**
- [Next.js Documentation](https://nextjs.org/docs) - Server Components, Server Actions, routing
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

**Authentication**
- [NextAuth.js Documentation](https://next-auth.js.org/) - While this challenge uses mock auth, NextAuth is what we use in production

**Database & ORM**
- [Prisma Documentation](https://www.prisma.io/docs) - Database queries, schema, migrations
- [Prisma Client API](https://www.prisma.io/docs/orm/reference/prisma-client-reference)

**UI & Styling**
- [Shadcn UI](https://ui.shadcn.com) - Component library we're using
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

**TypeScript**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

### Troubleshooting

**Issue:** `pnpm: command not found`
- Install pnpm: `npm install -g pnpm`

**Issue:** TypeScript errors after schema changes
- Run `pnpm zenstack` to regenerate types
- Restart your editor's TypeScript server

**Issue:** Database errors
- Reset the database: `rm src/dev.db && pnpm db:push && pnpm db:seed`

---

## Understanding the Starting Point

### What Works ✅

- Task creation, editing, and deletion
- User switching (Alice, Bob, Charlie, Diana)
- Task completion toggling
- Basic UI with Shadcn components

### What's Broken (Intentionally) 🐛

1. **No category field** - Tasks can't be categorized yet
2. **Security bug** - All users can see ALL tasks (should only see their own)
3. **Missing category UI** - No way to display or filter by category

---

## Your Tasks

### Task A: Add Category Field (15-20 minutes)

**Goal:** Add an optional `category` field to the Task model.

**Steps:**

1. Open `src/schema.zmodel`
2. Add a `category` field to the Task model (make it an optional String field)
3. Run `pnpm zenstack` to regenerate types
4. Run `pnpm db:push` to update the database
5. Open `src/prisma/seed.ts` and add categories to the tasks (follow the TODO comments)
6. Run `pnpm db:seed` to populate the database with categorized tasks

**Verify it worked:**
- Check that TypeScript recognizes `task.category` in your editor
- No compilation errors when you run `pnpm build`
- After reseeding, tasks in the UI should have categories

---

### Task B: Fix Access Control (30-40 minutes)

**Goal:** Fix the security bug so users can only see their own tasks.

**The Problem:**

The Task model currently has `@@allow('all', true)` which gives EVERYONE full access to ALL tasks. This means:
- Alice can see Bob's tasks
- Bob can delete Charlie's tasks
- Anyone can do anything to any task

This is a critical security vulnerability!

**What You Need to Do:**

In `src/schema.zmodel`, replace `@@allow('all', true)` with proper access control rules:
- Users can **read** only their own tasks
- Users can **create** tasks (for themselves)
- Users can **update** only their own tasks
- Users can **delete** only their own tasks

**Hints:**
- Use the `auth()` function to get the current user
- Use the `author` relationship to check ownership
- The syntax is: `@@allow('operation', condition)`
- You need separate rules for: `'read'`, `'create'`, `'update'`, `'delete'`

**After implementing:**
1. Run `pnpm zenstack`
2. Restart the dev server
3. Use the user switcher in the header to test different users
4. Each user should only see their own tasks

---

### Task C: Category UI (30-40 minutes)

**Goal:** Display categories and allow users to set them.

**What You Need to Do:**

1. **Pass category to the badge component**
   - In `src/app/(authenticated)/my-tasks/components/task-card.tsx`
   - Find where `<CategoryBadge />` is used (line 74)
   - Pass the `task.category` prop to it

2. **Add category input to create dialog**
   - In `src/app/(authenticated)/my-tasks/components/create-task-dialog.tsx`
   - Add a category input field (similar to title and description)
   - You can use `TASK_CATEGORIES` from `@/lib/categories` for suggestions

3. **Update the createTask action**
   - In `src/app/(authenticated)/my-tasks/actions.ts`
   - Add `category?: string;` to the data parameter
   - It will automatically be saved to the database

**Verify it worked:**
- Create a new task with a category
- The category badge should display the correct color
- Different categories should have different colors

---

## Testing Your Work

### Manual Testing Checklist

**After Task A:**
- [ ] `pnpm build` succeeds without errors
- [ ] TypeScript recognizes `task.category` in your editor

**After Task B:**
- [ ] Switch to Alice - see only Alice's tasks
- [ ] Switch to Bob - see only Bob's tasks
- [ ] Switch to Charlie - see only Charlie's tasks
- [ ] Switch to Diana - see only Diana's tasks
- [ ] Each user can only delete their own tasks

**After Task C:**
- [ ] Create a new task with category "Work"
- [ ] Badge shows "Work" with blue color
- [ ] Create another task with category "Personal"
- [ ] Badge shows "Personal" with green color

### Automated Testing

Run these commands to verify your code quality:

```bash
# Check code quality
pnpm lint

# Verify app builds without errors
pnpm build

# Run end-to-end tests
pnpm test:e2e

# Run tests with UI (useful for debugging)
pnpm test:e2e:ui
```

### Database Reset

If you need to reset the database to a clean state:

**Option 1:** Use the "Reset Database" button in the footer of the app

**Option 2:** Run this command:
```bash
rm src/dev.db && pnpm db:push && pnpm db:seed
```

---

## Mock Authentication

This app uses mock authentication for simplicity. You're logged in as **Alice** by default.

**Testing with different users:**
Use the user switcher dropdown in the header to switch between:
- Alice (id: 1)
- Bob (id: 2)
- Charlie (id: 3)
- Diana (id: 4)

This is essential for testing Task B (access control).

---

## ZenStack Quick Reference

ZenStack extends Prisma with access control policies:

```zmodel
model Task {
  // ... fields
  
  // Allow operation when condition is true
  @@allow('read', auth() == author)
  
  // Multiple rules are OR'd together
  @@allow('read', auth() == author)
  @@allow('read', isPublic)
  
  // Available operations: 'create', 'read', 'update', 'delete', 'all'
  
  // auth() returns the current user (or null if not authenticated)
  // You can reference relationships: auth() == author
}
```

---

## Submission

When you're done:

1. **Commit your changes** with clear, descriptive commit messages
2. Test your implementation using the checklists above
3. Run `pnpm lint` and `pnpm build` to verify code quality
4. **Push your code** to your public forked repository on GitHub
5. **Share the link** to your forked repository as part of your submission
6. **Be ready to discuss** your approach, challenges, and decisions in the interview

**What we're looking for:**

- **Understanding over completion** - We'd rather see 2 tasks done well with clear understanding than all 3 rushed
- **Code quality** - Clean, readable code with proper TypeScript usage (avoid `any` types)
- **Thought process** - Good commit messages and code comments that show your reasoning
- **Problem-solving** - How you approached challenges and what resources you used
- **Communication** - Ability to explain and justify your technical decisions

**Remember:** This challenge uses the same stack as our production platform at Cashew Research. The skills you demonstrate here are the skills you'll use on the job.

Good luck! 🚀
