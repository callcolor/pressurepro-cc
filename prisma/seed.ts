import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create categories
  const categories = [
    { name: 'React', slug: 'react' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'AI/ML', slug: 'ai-ml' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'General Tech', slug: 'general-tech' },
    { name: 'DevOps', slug: 'devops' },
    { name: 'Infrastructure', slug: 'infrastructure' },
    { name: 'Python', slug: 'python' },
    { name: 'Data Science', slug: 'data-science' },
    { name: 'Mobile', slug: 'mobile' },
    { name: 'iOS', slug: 'ios' },
    { name: 'Android', slug: 'android' },
    { name: 'React Native', slug: 'react-native' },
    { name: 'Security', slug: 'security' },
    { name: 'Blockchain', slug: 'blockchain' },
    { name: 'Web3', slug: 'web3' },
    { name: 'Cryptocurrency', slug: 'cryptocurrency' },
    { name: 'Design', slug: 'design' },
    { name: 'UX', slug: 'ux' },
    { name: 'UI', slug: 'ui' },
  ];

  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Get all categories for later use
  const allCategories = await prisma.category.findMany();
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  console.log('Creating conferences with speakers...');

  // Conference 1: React Summit 2024
  const reactSummit = await prisma.conference.create({
    data: {
      name: 'React Summit 2024',
      description:
        'The biggest React conference of the year featuring the latest in React 19, Server Components, and modern web development practices. Join us for 3 days of talks, workshops, and networking with the React community.',
      date: new Date('2024-11-15'),
      location: 'San Francisco, CA',
      price: 599,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      maxAttendees: 500,
      currentAttendees: 342,
      isFeatured: true,
      speakers: {
        create: [
          {
            name: 'Sarah Chen',
            title: 'Senior Frontend Engineer',
            company: 'Meta',
            bio: 'React core team member and advocate for modern web development.',
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
          },
          {
            name: 'Michael Rodriguez',
            title: 'Tech Lead',
            company: 'Vercel',
            bio: 'Specializing in Next.js and server-side rendering.',
            avatarUrl: 'https://i.pravatar.cc/150?img=2',
          },
        ],
      },
      categories: {
        create: [
          { categoryId: categoryMap.get('react')! },
          { categoryId: categoryMap.get('web-development')! },
          { categoryId: categoryMap.get('javascript')! },
        ],
      },
    },
  });

  // Conference 2: TechMeet December Special
  const techMeet = await prisma.conference.create({
    data: {
      name: 'TechMeet December Special',
      description:
        'End the year with the ultimate tech gathering! TechMeet 2024 brings together developers, designers, and tech enthusiasts for an unforgettable December event featuring AI, cloud computing, and emerging technologies.',
      date: new Date('2024-12-10'),
      location: 'Austin, TX',
      price: 399,
      imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      maxAttendees: 300,
      currentAttendees: 178,
      isFeatured: true,
      speakers: {
        create: [
          {
            name: 'Dr. Emily Watson',
            title: 'AI Research Lead',
            company: 'OpenAI',
            bio: 'Leading research in large language models and AI safety.',
            avatarUrl: 'https://i.pravatar.cc/150?img=3',
          },
        ],
      },
      categories: {
        create: [
          { categoryId: categoryMap.get('ai-ml')! },
          { categoryId: categoryMap.get('cloud')! },
          { categoryId: categoryMap.get('general-tech')! },
        ],
      },
    },
  });

  // Conference 3: DevOps World 2024 (Sold Out)
  const devOpsWorld = await prisma.conference.create({
    data: {
      name: 'DevOps World 2024',
      description:
        'Master the art of DevOps with hands-on workshops covering Kubernetes, CI/CD pipelines, infrastructure as code, and cloud-native development. Perfect for engineers looking to level up their deployment game.',
      date: new Date('2024-10-20'),
      location: 'Seattle, WA',
      price: 449,
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
      maxAttendees: 400,
      currentAttendees: 400,
      isFeatured: false,
      speakers: {
        create: [
          {
            name: 'James Park',
            title: 'DevOps Architect',
            company: 'AWS',
            bio: 'Expert in cloud infrastructure and container orchestration.',
            avatarUrl: 'https://i.pravatar.cc/150?img=4',
          },
          {
            name: 'Lisa Thompson',
            title: 'Platform Engineer',
            company: 'Google Cloud',
            bio: 'Building scalable platforms for enterprise applications.',
            avatarUrl: 'https://i.pravatar.cc/150?img=5',
          },
        ],
      },
      categories: {
        create: [
          { categoryId: categoryMap.get('devops')! },
          { categoryId: categoryMap.get('cloud')! },
          { categoryId: categoryMap.get('infrastructure')! },
        ],
      },
    },
  });

  // Conference 4: Python Data Science Summit
  const pythonDataScience = await prisma.conference.create({
    data: {
      name: 'Python Data Science Summit',
      description:
        'Explore the latest in data science, machine learning, and AI with Python. From pandas to PyTorch, learn from industry experts about building production-ready ML systems.',
      date: new Date('2025-01-25'),
      location: 'Boston, MA',
      price: 549,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      maxAttendees: 250,
      currentAttendees: 89,
      isFeatured: true,
      speakers: {
        create: [
          {
            name: 'Dr. Aisha Patel',
            title: 'Lead Data Scientist',
            company: 'Netflix',
            bio: 'Specializing in recommendation systems and deep learning.',
            avatarUrl: 'https://i.pravatar.cc/150?img=6',
          },
        ],
      },
      categories: {
        create: [
          { categoryId: categoryMap.get('python')! },
          { categoryId: categoryMap.get('ai-ml')! },
          { categoryId: categoryMap.get('data-science')! },
        ],
      },
    },
  });

  // Conference 5: Mobile Dev Fest 2024
  const mobileDevFest = await prisma.conference.create({
    data: {
      name: 'Mobile Dev Fest 2024',
      description:
        'The premier conference for mobile developers covering iOS, Android, React Native, and Flutter. Build better apps with the latest tools and techniques from mobile development experts.',
      date: new Date('2024-11-08'),
      location: 'Los Angeles, CA',
      price: 499,
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      maxAttendees: 350,
      currentAttendees: 298,
      isFeatured: false,
      speakers: {
        create: [
          {
            name: 'Kevin Wu',
            title: 'Senior iOS Engineer',
            company: 'Apple',
            bio: 'Working on SwiftUI and iOS frameworks.',
            avatarUrl: 'https://i.pravatar.cc/150?img=7',
          },
          {
            name: 'Maria Garcia',
            title: 'Android Team Lead',
            company: 'Google',
            bio: 'Building the future of Android development with Jetpack Compose.',
            avatarUrl: 'https://i.pravatar.cc/150?img=8',
          },
        ],
      },
      categories: {
        create: [
          { categoryId: categoryMap.get('mobile')! },
          { categoryId: categoryMap.get('ios')! },
          { categoryId: categoryMap.get('android')! },
          { categoryId: categoryMap.get('react-native')! },
        ],
      },
    },
  });

  // Conference 6: Cybersecurity Excellence 2024
  const cybersecurity = await prisma.conference.create({
    data: {
      name: 'Cybersecurity Excellence 2024',
      description:
        'Stay ahead of threats with the latest in cybersecurity. Learn about zero-trust architecture, penetration testing, and securing modern cloud applications from industry-leading security experts.',
      date: new Date('2024-12-05'),
      location: 'Washington, DC',
      price: 699,
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      maxAttendees: 200,
      currentAttendees: 145,
      isFeatured: true,
      speakers: {
        create: [
          {
            name: 'Robert Kim',
            title: 'Chief Security Officer',
            company: 'Cloudflare',
            bio: 'Expert in web security and DDoS protection.',
            avatarUrl: 'https://i.pravatar.cc/150?img=9',
          },
        ],
      },
      categories: {
        create: [
          { categoryId: categoryMap.get('security')! },
          { categoryId: categoryMap.get('cloud')! },
          { categoryId: categoryMap.get('infrastructure')! },
        ],
      },
    },
  });

  // Conference 7: Web3 & Blockchain Conference
  const web3Blockchain = await prisma.conference.create({
    data: {
      name: 'Web3 & Blockchain Conference',
      description:
        'Dive into the decentralized future with Web3, blockchain, and cryptocurrency technologies. Learn about smart contracts, DeFi, NFTs, and building on Ethereum and other platforms.',
      date: new Date('2025-02-14'),
      location: 'Miami, FL',
      price: 799,
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      maxAttendees: 300,
      currentAttendees: 67,
      isFeatured: false,
      speakers: {
        create: [
          {
            name: 'Alex Turner',
            title: 'Blockchain Architect',
            company: 'Ethereum Foundation',
            bio: 'Building decentralized applications and smart contract systems.',
            avatarUrl: 'https://i.pravatar.cc/150?img=10',
          },
        ],
      },
      categories: {
        create: [
          { categoryId: categoryMap.get('blockchain')! },
          { categoryId: categoryMap.get('web3')! },
          { categoryId: categoryMap.get('cryptocurrency')! },
        ],
      },
    },
  });

  // Conference 8: UX/UI Design Summit
  const uxUiSummit = await prisma.conference.create({
    data: {
      name: 'UX/UI Design Summit',
      description:
        'Elevate your design skills with insights from top designers at leading tech companies. Cover design systems, accessibility, user research, and creating delightful user experiences.',
      date: new Date('2024-11-22'),
      location: 'New York, NY',
      price: 449,
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      maxAttendees: 400,
      currentAttendees: 367,
      isFeatured: true,
      speakers: {
        create: [
          {
            name: 'Sophie Anderson',
            title: 'Design Director',
            company: 'Airbnb',
            bio: 'Leading design systems and accessibility initiatives.',
            avatarUrl: 'https://i.pravatar.cc/150?img=11',
          },
          {
            name: 'David Lee',
            title: 'Principal Designer',
            company: 'Figma',
            bio: 'Designing the future of collaborative design tools.',
            avatarUrl: 'https://i.pravatar.cc/150?img=12',
          },
        ],
      },
      categories: {
        create: [
          { categoryId: categoryMap.get('design')! },
          { categoryId: categoryMap.get('ux')! },
          { categoryId: categoryMap.get('ui')! },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log(`Created ${allCategories.length} categories`);
  console.log('Created 8 conferences with speakers and categories');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
