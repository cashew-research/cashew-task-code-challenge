import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {
      avatar: '/avatars/alice.svg',
    },
    create: {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      avatar: '/avatars/alice.svg',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {
      avatar: '/avatars/bob.svg',
    },
    create: {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      avatar: '/avatars/bob.svg',
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {
      avatar: '/avatars/charlie.svg',
    },
    create: {
      id: '3',
      name: 'Charlie',
      email: 'charlie@example.com',
      avatar: '/avatars/charlie.svg',
    },
  });

  const diana = await prisma.user.upsert({
    where: { email: 'diana@example.com' },
    update: {
      avatar: '/avatars/diana.svg',
    },
    create: {
      id: '4',
      name: 'Diana',
      email: 'diana@example.com',
      avatar: '/avatars/diana.svg',
    },
  });

  console.log('Created users:', { alice, bob, charlie, diana });

  // Create tasks for Alice
  // TODO (Task A): After adding the category field to the schema,
  // add category to each task below (e.g., category: 'Work', category: 'Personal', etc.)
  // This will populate the database with categorized tasks for testing
  const aliceTasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Review pull requests',
        description: 'Check the pending PRs in the repository',
        authorId: alice.id,
        completed: false,
        // TODO: Add category: 'Work' here
        category: 'Work'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Update documentation',
        description: 'Add examples to the README',
        authorId: alice.id,
        completed: true,
        // TODO: Add category: 'Work' here
        category: 'Work'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Fix bug in authentication',
        description: 'Users are reporting login issues',
        authorId: alice.id,
        completed: false,
        // TODO: Add category: 'Work' here
        category: 'Work'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Prepare quarterly presentation',
        description: 'Create slides for the Q1 review meeting',
        authorId: alice.id,
        completed: false,
        // TODO: Add category: 'Work' here
        category: 'Work'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Code review for new feature',
        authorId: alice.id,
        completed: true,
        // TODO: Add category: 'Work' here
        category: 'Work'
      },
    }),
  ]);

  // Create tasks for Bob
  // TODO (Task A): Add categories to Bob's tasks too (mix of 'Work' and other categories)
  const bobTasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Design new landing page',
        description: 'Create mockups for the new homepage',
        authorId: bob.id,
        completed: false,
        category: 'Work'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write unit tests',
        description: 'Add tests for the new features',
        authorId: bob.id,
        completed: false,
        category: 'Personal'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Refactor API endpoints',
        description: 'Clean up the REST API structure',
        authorId: bob.id,
        completed: true,
        category: 'Learning'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up CI/CD pipeline',
        authorId: bob.id,
        completed: false,
        category: 'Other'
      },
    }),
  ]);

  // Create tasks for Charlie
  // TODO (Task A): Add categories to Charlie's tasks too
  const charlieTasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Database optimization',
        description: 'Analyze and optimize slow queries',
        authorId: charlie.id,
        completed: false,
        category: 'Work'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Security audit',
        description: 'Review application for security vulnerabilities',
        authorId: charlie.id,
        completed: false,
        category: 'Personal'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Update dependencies',
        authorId: charlie.id,
        completed: true,
        category: 'Learning'
      },
    }),
  ]);

  // Create tasks for Diana
  // TODO (Task A): Add categories to Diana's tasks too
  const dianaTasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'User research interviews',
        description: 'Schedule and conduct 5 user interviews',
        authorId: diana.id,
        completed: false,
        category: 'Work'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create user personas',
        description: 'Document key user types and their needs',
        authorId: diana.id,
        completed: true,
        category: 'Personal'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Accessibility improvements',
        description: 'Implement WCAG 2.1 AA compliance',
        authorId: diana.id,
        completed: false,
        category: 'Learning'
      },
    }),
    prisma.task.create({
      data: {
        title: 'Mobile responsive design',
        authorId: diana.id,
        completed: false,
        category: 'Other'
      },
    }),
  ]);

  console.log('Created tasks for Alice:', aliceTasks.length);
  console.log('Created tasks for Bob:', bobTasks.length);
  console.log('Created tasks for Charlie:', charlieTasks.length);
  console.log('Created tasks for Diana:', dianaTasks.length);
  console.log('Seeding completed!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

