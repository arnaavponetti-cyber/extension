// Content script for sustainability extension
// Detects product pages and injects sustainability badge

interface SustainabilityScore {
  overall: 'green' | 'yellow' | 'red';
  score: number;
  factors: {
    environmental: number;
    social: number;
    governance: number;
  };
  reasoning: string;
}

// Mock sustainability scores based on URL patterns
const mockSustainabilityScores: Record<string, SustainabilityScore> = {
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
  'amazon.in': {
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

// Function to get sustainability score based on current URL
function getSustainabilityScore(url: string): SustainabilityScore {
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

// Function to detect if current page is a product page
function isProductPage(url: string): boolean {
  const productPagePatterns = [
    // Amazon patterns
    /amazon\.(com|in).*\/dp\//,
    /amazon\.(com|in).*\/gp\/product\//,
    /amazon\.(com|in).*\/product\//,
    
    // Flipkart patterns
    /flipkart\.com.*\/p\//,
    /flipkart\.com.*\/product\//,
    
    // Myntra patterns
    /myntra\.com.*\/\d+\/buy/,
    /myntra\.com.*\/product\//,
    
    // Ajio patterns
    /ajio\.com.*\/p\//,
    
    // Nykaa patterns
    /nykaa\.com.*\/p\//,
    /nykaa\.com.*\/product\//
  ];

  return productPagePatterns.some(pattern => pattern.test(url));
}

// Function to create and inject sustainability badge
function createSustainabilityBadge(): void {
  try {
    const currentUrl = window.location.href;
    
    // Check if this is a product page
    if (!isProductPage(currentUrl)) {
      console.log('Sustainability Extension: Not a product page, skipping badge injection');
      return;
    }

    // Check if badge already exists
    if (document.getElementById('sustainability-badge')) {
      console.log('Sustainability Extension: Badge already exists');
      return;
    }

    // Get sustainability score for current site
    const score = getSustainabilityScore(currentUrl);
    
    // Create badge element
    const badge = document.createElement('div');
    badge.id = 'sustainability-badge';
    badge.className = `score-${score.overall}`;
    
    // Set badge content
    const scoreText = score.overall.charAt(0).toUpperCase() + score.overall.slice(1);
    badge.innerHTML = `
      <span class="badge-text">Sustainability: ${scoreText}</span>
    `;
    
    // Add click handler to open popup
    badge.addEventListener('click', () => {
      try {
        // Try to open extension popup
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          // Send message to background script to open popup
          chrome.runtime.sendMessage({ action: 'openPopup' });
        } else {
          // Fallback: open popup in new window
          const popupUrl = chrome.runtime.getURL('popup.html');
          window.open(popupUrl, 'sustainability-popup', 'width=400,height=600,scrollbars=yes');
        }
      } catch (error) {
        console.error('Sustainability Extension: Error opening popup:', error);
        // Fallback: show alert with basic info
        alert(`Sustainability Score: ${scoreText} (${score.score}/100)\n\n${score.reasoning}`);
      }
    });

    // Add hover effects
    badge.addEventListener('mouseenter', () => {
      badge.style.transform = 'translateY(-2px)';
    });

    badge.addEventListener('mouseleave', () => {
      badge.style.transform = 'translateY(0px)';
    });

    // Inject badge into page
    document.body.appendChild(badge);
    
    console.log('Sustainability Extension: Badge injected successfully');
    
    // Store score in chrome storage for popup access
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({
        currentScore: score,
        currentUrl: currentUrl,
        timestamp: Date.now()
      });
    }

  } catch (error) {
    console.error('Sustainability Extension: Error creating badge:', error);
  }
}

// Function to remove existing badge (for cleanup)
function removeSustainabilityBadge(): void {
  try {
    const existingBadge = document.getElementById('sustainability-badge');
    if (existingBadge) {
      existingBadge.remove();
      console.log('Sustainability Extension: Badge removed');
    }
  } catch (error) {
    console.error('Sustainability Extension: Error removing badge:', error);
  }
}

// Function to handle URL changes (for SPAs)
function handleUrlChange(): void {
  // Remove existing badge
  removeSustainabilityBadge();
  
  // Wait a bit for page to load, then inject new badge
  setTimeout(() => {
    createSustainabilityBadge();
  }, 1000);
}

// Initialize extension
function initializeExtension(): void {
  try {
    console.log('Sustainability Extension: Initializing...');
    
    // Create badge when page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createSustainabilityBadge);
    } else {
      createSustainabilityBadge();
    }

    // Handle URL changes for Single Page Applications
    let currentUrl = window.location.href;
    
    // Monitor for URL changes
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('Sustainability Extension: URL changed, updating badge');
        handleUrlChange();
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);
    
    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleUrlChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleUrlChange();
    };

    console.log('Sustainability Extension: Initialized successfully');

  } catch (error) {
    console.error('Sustainability Extension: Initialization error:', error);
  }
}

// Start the extension
initializeExtension();

// Extension functions are available globally for testing
(window as any).sustainabilityExtension = {
  getSustainabilityScore,
  isProductPage,
  createSustainabilityBadge,
  removeSustainabilityBadge
};
