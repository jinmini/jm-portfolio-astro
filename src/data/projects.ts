import type { Project } from '../types/Project';

export const projectsData: Project[] = [
  {
    id: 1,
    title: "NeuroVerse",
    description: "Immersive VR platform for neurosurgical training using WebXR and Three.js. Experience realistic 3D medical simulations in virtual reality.",
    year: "2024",
    tags: ["React", "Three.js", "WebXR"],
    thumbnail: "/images/projects/project-1-thumb.jpg",
    images: [
      "/images/projects/project-1-01.jpg",
      "/images/projects/project-1-02.jpg",
      "/images/projects/project-1-03.jpg"
    ],
    links: {
      github: "https://github.com/example/neuroverse",
      site: "https://neuroverse-demo.com"
    },
    featured: true,
    details: [
      "PhotoReal 3D brain models with anatomical accuracy",
      "Hand tracking and haptic feedback integration",
      "Multi-user collaborative VR sessions for training",
      "Progress tracking and performance analytics"
    ]
  },
  {
    id: 2,
    title: "AI-Powered Analytics Dashboard",
    description: "Real-time business intelligence dashboard with machine learning insights for predictive analytics and data-driven decision making.",
    year: "2024",
    tags: ["Next.js", "Python", "TensorFlow", "PostgreSQL"],
    thumbnail: "/images/projects/project-2-thumb.jpg",
    images: [
      "/images/projects/project-2-01.jpg",
      "/images/projects/project-2-02.jpg"
    ],
    links: {
      github: "https://github.com/example/ai-dashboard",
      site: "https://ai-analytics-demo.com"
    },
    featured: false,
    details: [
      "Real-time data visualization with custom charts",
      "Machine learning models for predictive insights",
      "Automated report generation and alerts",
      "Multi-tenant architecture with role-based access"
    ]
  },
  {
    id: 3,
    title: "Sustainable Supply Chain",
    description: "Blockchain-based supply chain management system for transparent and sustainable sourcing with smart contract automation.",
    year: "2023",
    tags: ["Solidity", "React", "Node.js", "Web3"],
    thumbnail: "/images/projects/project-3-thumb.jpg",
    images: [
      "/images/projects/project-3-01.jpg",
      "/images/projects/project-3-02.jpg",
      "/images/projects/project-3-03.jpg",
      "/images/projects/project-3-04.jpg"
    ],
    links: {
      github: "https://github.com/example/supply-chain"
    },
    featured: false,
    details: [
      "Transparent supply chain tracking on blockchain",
      "Smart contracts for automated compliance",
      "Carbon footprint calculation and reporting",
      "Integration with IoT sensors for real-time monitoring"
    ]
  }
]; 