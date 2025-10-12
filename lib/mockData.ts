import { Conference } from '@/types/conference';

// Mock data for development - simulates a database of tech conferences
export const mockConferences: Conference[] = [
  {
    id: '1',
    name: 'React Summit 2024',
    description: 'The biggest React conference of the year featuring the latest in React 19, Server Components, and modern web development practices. Join us for 3 days of talks, workshops, and networking with the React community.',
    date: '2024-11-15',
    location: 'San Francisco, CA',
    price: 599,
    category: ['React', 'Web Development', 'JavaScript'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    speakers: [
      {
        id: 's1',
        name: 'Sarah Chen',
        title: 'Senior Frontend Engineer',
        company: 'Meta',
        bio: 'React core team member and advocate for modern web development.',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: 's2',
        name: 'Michael Rodriguez',
        title: 'Tech Lead',
        company: 'Vercel',
        bio: 'Specializing in Next.js and server-side rendering.',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
      },
    ],
    maxAttendees: 500,
    currentAttendees: 342,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'TechMeet December Special',
    description: 'End the year with the ultimate tech gathering! TechMeet 2024 brings together developers, designers, and tech enthusiasts for an unforgettable December event featuring AI, cloud computing, and emerging technologies.',
    date: '2024-12-10',
    location: 'Austin, TX',
    price: 399,
    category: ['AI/ML', 'Cloud', 'General Tech'],
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    speakers: [
      {
        id: 's3',
        name: 'Dr. Emily Watson',
        title: 'AI Research Lead',
        company: 'OpenAI',
        bio: 'Leading research in large language models and AI safety.',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
      },
    ],
    maxAttendees: 300,
    currentAttendees: 178,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'DevOps World 2024',
    description: 'Master the art of DevOps with hands-on workshops covering Kubernetes, CI/CD pipelines, infrastructure as code, and cloud-native development. Perfect for engineers looking to level up their deployment game.',
    date: '2024-10-20',
    location: 'Seattle, WA',
    price: 449,
    category: ['DevOps', 'Cloud', 'Infrastructure'],
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
    speakers: [
      {
        id: 's4',
        name: 'James Park',
        title: 'DevOps Architect',
        company: 'AWS',
        bio: 'Expert in cloud infrastructure and container orchestration.',
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
      },
      {
        id: 's5',
        name: 'Lisa Thompson',
        title: 'Platform Engineer',
        company: 'Google Cloud',
        bio: 'Building scalable platforms for enterprise applications.',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
      },
    ],
    maxAttendees: 400,
    currentAttendees: 400,
    isFeatured: false,
  },
  {
    id: '4',
    name: 'Python Data Science Summit',
    description: 'Explore the latest in data science, machine learning, and AI with Python. From pandas to PyTorch, learn from industry experts about building production-ready ML systems.',
    date: '2025-01-25',
    location: 'Boston, MA',
    price: 549,
    category: ['Python', 'AI/ML', 'Data Science'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    speakers: [
      {
        id: 's6',
        name: 'Dr. Aisha Patel',
        title: 'Lead Data Scientist',
        company: 'Netflix',
        bio: 'Specializing in recommendation systems and deep learning.',
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
      },
    ],
    maxAttendees: 250,
    currentAttendees: 89,
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Mobile Dev Fest 2024',
    description: 'The premier conference for mobile developers covering iOS, Android, React Native, and Flutter. Build better apps with the latest tools and techniques from mobile development experts.',
    date: '2024-11-08',
    location: 'Los Angeles, CA',
    price: 499,
    category: ['Mobile', 'iOS', 'Android', 'React Native'],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    speakers: [
      {
        id: 's7',
        name: 'Kevin Wu',
        title: 'Senior iOS Engineer',
        company: 'Apple',
        bio: 'Working on SwiftUI and iOS frameworks.',
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
      },
      {
        id: 's8',
        name: 'Maria Garcia',
        title: 'Android Team Lead',
        company: 'Google',
        bio: 'Building the future of Android development with Jetpack Compose.',
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
      },
    ],
    maxAttendees: 350,
    currentAttendees: 298,
    isFeatured: false,
  },
  {
    id: '6',
    name: 'Cybersecurity Excellence 2024',
    description: 'Stay ahead of threats with the latest in cybersecurity. Learn about zero-trust architecture, penetration testing, and securing modern cloud applications from industry-leading security experts.',
    date: '2024-12-05',
    location: 'Washington, DC',
    price: 699,
    category: ['Security', 'Cloud', 'Infrastructure'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    speakers: [
      {
        id: 's9',
        name: 'Robert Kim',
        title: 'Chief Security Officer',
        company: 'Cloudflare',
        bio: 'Expert in web security and DDoS protection.',
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
      },
    ],
    maxAttendees: 200,
    currentAttendees: 145,
    isFeatured: true,
  },
  {
    id: '7',
    name: 'Web3 & Blockchain Conference',
    description: 'Dive into the decentralized future with Web3, blockchain, and cryptocurrency technologies. Learn about smart contracts, DeFi, NFTs, and building on Ethereum and other platforms.',
    date: '2025-02-14',
    location: 'Miami, FL',
    price: 799,
    category: ['Blockchain', 'Web3', 'Cryptocurrency'],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    speakers: [
      {
        id: 's10',
        name: 'Alex Turner',
        title: 'Blockchain Architect',
        company: 'Ethereum Foundation',
        bio: 'Building decentralized applications and smart contract systems.',
        avatarUrl: 'https://i.pravatar.cc/150?img=10',
      },
    ],
    maxAttendees: 300,
    currentAttendees: 67,
    isFeatured: false,
  },
  {
    id: '8',
    name: 'UX/UI Design Summit',
    description: 'Elevate your design skills with insights from top designers at leading tech companies. Cover design systems, accessibility, user research, and creating delightful user experiences.',
    date: '2024-11-22',
    location: 'New York, NY',
    price: 449,
    category: ['Design', 'UX', 'UI'],
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    speakers: [
      {
        id: 's11',
        name: 'Sophie Anderson',
        title: 'Design Director',
        company: 'Airbnb',
        bio: 'Leading design systems and accessibility initiatives.',
        avatarUrl: 'https://i.pravatar.cc/150?img=11',
      },
      {
        id: 's12',
        name: 'David Lee',
        title: 'Principal Designer',
        company: 'Figma',
        bio: 'Designing the future of collaborative design tools.',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
      },
    ],
    maxAttendees: 400,
    currentAttendees: 367,
    isFeatured: true,
  },
];

// Helper to get all unique categories
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  mockConferences.forEach((conf) => {
    conf.category.forEach((cat) => categories.add(cat));
  });
  return Array.from(categories).sort();
}

// Helper to get price range
export function getPriceRange(): { min: number; max: number } {
  const prices = mockConferences.map((c) => c.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
