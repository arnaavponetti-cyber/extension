// Mock sustainability data for MVP testing

export interface SustainabilityScore {
  overall: 'green' | 'yellow' | 'red';
  score: number;
  factors: {
    environmental: number;
    social: number;
    governance: number;
  };
  reasoning: string;
}

export interface AlternativeProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  sustainabilityScore: SustainabilityScore;
  imageUrl: string;
  productUrl: string;
  certifications: string[];
  impactMetrics: {
    carbonFootprint: string;
    waterSaved: string;
    plasticReduced: string;
  };
}

export interface RewardOffer {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  discountPercent: number;
  validUntil: string;
  brand: string;
}

// Mock product sustainability scores based on URL patterns
export const mockSustainabilityScores: Record<string, SustainabilityScore> = {
  'amazon.com': {
    overall: 'yellow',
    score: 65,
    factors: {
      environmental: 60,
      social: 70,
      governance: 65
    },
    reasoning: 'Mixed sustainability practices. Some eco-friendly initiatives but room for improvement in packaging and supply chain transparency.'
  },
  'flipkart.com': {
    overall: 'yellow',
    score: 58,
    factors: {
      environmental: 55,
      social: 65,
      governance: 55
    },
    reasoning: 'Moderate sustainability efforts. Working on reducing packaging waste but needs better supplier sustainability standards.'
  },
  'myntra.com': {
    overall: 'red',
    score: 45,
    factors: {
      environmental: 40,
      social: 50,
      governance: 45
    },
    reasoning: 'Limited sustainability initiatives in fast fashion. High environmental impact from frequent trend cycles and packaging.'
  },
  'ajio.com': {
    overall: 'red',
    score: 42,
    factors: {
      environmental: 38,
      social: 48,
      governance: 40
    },
    reasoning: 'Fast fashion model with significant environmental concerns. Limited transparency in supply chain practices.'
  },
  'nykaa.com': {
    overall: 'yellow',
    score: 62,
    factors: {
      environmental: 58,
      social: 68,
      governance: 60
    },
    reasoning: 'Growing focus on sustainable beauty products but packaging and ingredient sourcing need improvement.'
  }
};

// Mock alternative sustainable products
export const mockAlternatives: AlternativeProduct[] = [
  {
    id: 'alt-1',
    name: 'Organic Cotton Basic T-Shirt',
    brand: 'EcoWear',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    sustainabilityScore: {
      overall: 'green',
      score: 92,
      factors: {
        environmental: 95,
        social: 90,
        governance: 91
      },
      reasoning: 'Made from 100% organic cotton with fair trade certification. Zero-waste manufacturing process.'
    },
    imageUrl: 'https://placehold.co/300x300?text=Organic+Cotton+T-Shirt',
    productUrl: 'https://ecowear.com/organic-tshirt',
    certifications: ['GOTS Certified', 'Fair Trade', 'Carbon Neutral'],
    impactMetrics: {
      carbonFootprint: '2.1 kg CO₂ saved',
      waterSaved: '2,700L saved',
      plasticReduced: '15g plastic avoided'
    }
  },
  {
    id: 'alt-2',
    name: 'Recycled Polyester Sneakers',
    brand: 'GreenStep',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    sustainabilityScore: {
      overall: 'green',
      score: 88,
      factors: {
        environmental: 92,
        social: 85,
        governance: 87
      },
      reasoning: 'Made from 85% recycled ocean plastic. Ethical manufacturing with living wage guarantee.'
    },
    imageUrl: 'https://placehold.co/300x300?text=Recycled+Sneakers',
    productUrl: 'https://greenstep.com/recycled-sneakers',
    certifications: ['Ocean Positive', 'B-Corp Certified', 'Vegan'],
    impactMetrics: {
      carbonFootprint: '5.2 kg CO₂ saved',
      waterSaved: '1,200L saved',
      plasticReduced: '12 bottles recycled'
    }
  },
  {
    id: 'alt-3',
    name: 'Bamboo Fiber Activewear Set',
    brand: 'NatureFit',
    price: 1799,
    originalPrice: 2299,
    discount: 22,
    sustainabilityScore: {
      overall: 'green',
      score: 90,
      factors: {
        environmental: 94,
        social: 88,
        governance: 88
      },
      reasoning: 'Bamboo fiber is naturally antibacterial and biodegradable. Sustainable farming practices.'
    },
    imageUrl: 'https://placehold.co/300x300?text=Bamboo+Activewear',
    productUrl: 'https://naturefit.com/bamboo-set',
    certifications: ['FSC Certified', 'OEKO-TEX', 'Climate Neutral'],
    impactMetrics: {
      carbonFootprint: '3.8 kg CO₂ saved',
      waterSaved: '4,500L saved',
      plasticReduced: '25g microplastic avoided'
    }
  }
];

// Mock reward offers
export const mockRewards: RewardOffer[] = [
  {
    id: 'reward-1',
    title: '20% Off Sustainable Fashion',
    description: 'Get 20% off your first purchase from verified sustainable fashion brands',
    discountCode: 'SUSTAIN20',
    discountPercent: 20,
    validUntil: '2024-12-31',
    brand: 'EcoWear'
  },
  {
    id: 'reward-2',
    title: 'Free Shipping on Eco Products',
    description: 'Free shipping on all eco-friendly products over ₹999',
    discountCode: 'ECOFREE',
    discountPercent: 0,
    validUntil: '2024-12-31',
    brand: 'GreenStep'
  },
  {
    id: 'reward-3',
    title: '₹500 Cashback',
    description: 'Get ₹500 cashback when you switch to sustainable alternatives',
    discountCode: 'SWITCH500',
    discountPercent: 0,
    validUntil: '2024-12-31',
    brand: 'NatureFit'
  }
];

// Function to get sustainability score based on current URL
export function getSustainabilityScore(url: string): SustainabilityScore {
  const domain = new URL(url).hostname.toLowerCase();
  
  for (const [key, score] of Object.entries(mockSustainabilityScores)) {
    if (domain.includes(key)) {
      return score;
    }
  }
  
  // Default score for unknown domains
  return {
    overall: 'yellow',
    score: 50,
    factors: {
      environmental: 50,
      social: 50,
      governance: 50
    },
    reasoning: 'Limited sustainability information available for this retailer.'
  };
}

// Function to get random alternatives (simulate personalized recommendations)
export function getAlternatives(count: number = 2): AlternativeProduct[] {
  const shuffled = [...mockAlternatives].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to get random reward offer
export function getRewardOffer(): RewardOffer {
  return mockRewards[Math.floor(Math.random() * mockRewards.length)];
}
