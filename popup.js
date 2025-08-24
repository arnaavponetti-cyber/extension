// Mock data (same as in mock-data.ts)
const mockAlternatives = [
  {
    id: "alt-1",
    name: "Organic Cotton Basic T-Shirt",
    brand: "EcoWear",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    sustainabilityScore: {
      overall: "green",
      score: 92,
      factors: {
        environmental: 95,
        social: 90,
        governance: 91
      },
      reasoning:
        "Made from 100% organic cotton with fair trade certification. Zero-waste manufacturing process."
    },
    imageUrl: "https://placehold.co/300x300?text=Organic+Cotton+T-Shirt",
    productUrl: "https://ecowear.com/organic-tshirt",
    certifications: ["GOTS Certified", "Fair Trade", "Carbon Neutral"],
    impactMetrics: {
      carbonFootprint: "2.1 kg CO₂ saved",
      waterSaved: "2,700L saved",
      plasticReduced: "15g plastic avoided"
    }
  },
  {
    id: "alt-2",
    name: "Recycled Polyester Sneakers",
    brand: "GreenStep",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    sustainabilityScore: {
      overall: "green",
      score: 88,
      factors: {
        environmental: 92,
        social: 85,
        governance: 87
      },
      reasoning:
        "Made from 85% recycled ocean plastic. Ethical manufacturing with living wage guarantee."
    },
    imageUrl: "https://placehold.co/300x300?text=Recycled+Sneakers",
    productUrl: "https://greenstep.com/recycled-sneakers",
    certifications: ["Ocean Positive", "B-Corp Certified", "Vegan"],
    impactMetrics: {
      carbonFootprint: "5.2 kg CO₂ saved",
      waterSaved: "1,200L saved",
      plasticReduced: "12 bottles recycled"
    }
  }
]

const mockRewards = [
  {
    id: "reward-1",
    title: "20% Off Sustainable Fashion",
    description:
      "Get 20% off your first purchase from verified sustainable fashion brands",
    discountCode: "SUSTAIN20",
    discountPercent: 20,
    validUntil: "2024-12-31",
    brand: "EcoWear"
  },
  {
    id: "reward-2",
    title: "Free Shipping on Eco Products",
    description: "Free shipping on all eco-friendly products over ₹999",
    discountCode: "ECOFREE",
    discountPercent: 0,
    validUntil: "2024-12-31",
    brand: "GreenStep"
  }
]

// Get sustainability score based on URL
function getSustainabilityScore(url) {
  const domain = new URL(url).hostname.toLowerCase()

  const mockScores = {
    "amazon.com": {
      overall: "yellow",
      score: 65,
      factors: { environmental: 60, social: 70, governance: 65 },
      reasoning:
        "Mixed sustainability practices. Some eco-friendly initiatives but room for improvement in packaging and supply chain transparency."
    },
    "amazon.in": {
      overall: "yellow",
      score: 65,
      factors: { environmental: 60, social: 70, governance: 65 },
      reasoning:
        "Mixed sustainability practices. Some eco-friendly initiatives but room for improvement in packaging and supply chain transparency."
    },
    "flipkart.com": {
      overall: "yellow",
      score: 58,
      factors: { environmental: 55, social: 65, governance: 55 },
      reasoning:
        "Moderate sustainability efforts. Working on reducing packaging waste but needs better supplier sustainability standards."
    },
    "myntra.com": {
      overall: "red",
      score: 45,
      factors: { environmental: 40, social: 50, governance: 45 },
      reasoning:
        "Limited sustainability initiatives in fast fashion. High environmental impact from frequent trend cycles and packaging."
    }
  }

  for (const [key, score] of Object.entries(mockScores)) {
    if (domain.includes(key)) {
      return score
    }
  }

  return {
    overall: "yellow",
    score: 50,
    factors: { environmental: 50, social: 50, governance: 50 },
    reasoning: "Limited sustainability information available for this retailer."
  }
}

// Get random alternatives
function getAlternatives(count = 2) {
  const shuffled = [...mockAlternatives].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Get random reward
function getRewardOffer() {
  return mockRewards[Math.floor(Math.random() * mockRewards.length)]
}

// Update score display
function updateScoreDisplay(score) {
  const scoreBadge = document.getElementById("score-badge")
  const scoreText = document.getElementById("score-text")
  const scoreReasoning = document.getElementById("score-reasoning")
  const envScore = document.getElementById("env-score")
  const socialScore = document.getElementById("social-score")
  const govScore = document.getElementById("gov-score")

  if (
    scoreBadge &&
    scoreText &&
    scoreReasoning &&
    envScore &&
    socialScore &&
    govScore
  ) {
    scoreBadge.className = `score-badge ${score.overall}`
    scoreText.textContent = `${score.overall.charAt(0).toUpperCase() +
      score.overall.slice(1)} (${score.score}/100)`
    scoreReasoning.textContent = score.reasoning
    envScore.textContent = score.factors.environmental.toString()
    socialScore.textContent = score.factors.social.toString()
    govScore.textContent = score.factors.governance.toString()
  }
}

// Update alternatives display
function updateAlternativesDisplay(alternatives) {
  const alternativesList = document.getElementById("alternatives-list")
  if (!alternativesList) return

  alternativesList.innerHTML = ""

  alternatives.forEach(alt => {
    const altElement = document.createElement("div")
    altElement.className = "alternative-item"
    altElement.innerHTML = `
      <div class="alternative-header">
        <div class="alternative-info">
          <h4>${alt.name}</h4>
          <div class="alternative-brand">${alt.brand}</div>
        </div>
        <div class="alternative-price">
          <div class="price-current">₹${alt.price}</div>
          <div class="price-original">₹${alt.originalPrice}</div>
          <div class="discount-badge">${alt.discount}% OFF</div>
        </div>
      </div>
      <div class="alternative-metrics">
        <div class="metric">${alt.impactMetrics.carbonFootprint}</div>
        <div class="metric">${alt.impactMetrics.waterSaved}</div>
        <div class="metric">${alt.impactMetrics.plasticReduced}</div>
      </div>
      <div class="certifications">
        ${alt.certifications
          .map(cert => `<span class="certification">${cert}</span>`)
          .join("")}
      </div>
    `

    altElement.addEventListener("click", () => {
      window.open(alt.productUrl, "_blank")
    })

    alternativesList.appendChild(altElement)
  })
}

// Update rewards display
function updateRewardsDisplay(reward) {
  const rewardTitle = document.getElementById("reward-title")
  const rewardDescription = document.getElementById("reward-description")
  const rewardCode = document.getElementById("reward-code")

  if (rewardTitle && rewardDescription && rewardCode) {
    rewardTitle.textContent = reward.title
    rewardDescription.textContent = reward.description
    rewardCode.textContent = reward.discountCode
  }
}

// Update impact stats
function updateImpactStats(alternatives) {
  const co2Saved = document.getElementById("co2-saved")
  const waterSaved = document.getElementById("water-saved")
  const plasticReduced = document.getElementById("plastic-reduced")

  if (co2Saved && waterSaved && plasticReduced && alternatives.length > 0) {
    // Calculate total impact from alternatives
    const totalCO2 = alternatives.reduce((sum, alt) => {
      const match = alt.impactMetrics.carbonFootprint.match(/(\d+\.?\d*)/)
      return sum + (match ? parseFloat(match[1]) : 0)
    }, 0)

    const totalWater = alternatives.reduce((sum, alt) => {
      const match = alt.impactMetrics.waterSaved.match(/(\d+,?\d*)/)
      return sum + (match ? parseInt(match[1].replace(",", "")) : 0)
    }, 0)

    const totalPlastic = alternatives.reduce((sum, alt) => {
      const match = alt.impactMetrics.plasticReduced.match(/(\d+)/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)

    co2Saved.textContent = `${totalCO2.toFixed(1)} kg`
    waterSaved.textContent = `${totalWater.toLocaleString()} L`
    plasticReduced.textContent = `${totalPlastic} g`
  }
}

// Copy discount code to clipboard
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const copyBtn = document.getElementById("copy-code-btn")
      if (copyBtn) {
        const originalText = copyBtn.textContent
        copyBtn.textContent = "Copied!"
        copyBtn.style.background = "#48bb78"
        setTimeout(() => {
          copyBtn.textContent = originalText
          copyBtn.style.background = ""
        }, 2000)
      }
    })
    .catch(err => {
      console.error("Failed to copy text: ", err)
    })
}

// Show error state
function showError() {
  const loading = document.getElementById("loading")
  const mainContent = document.getElementById("main-content")
  const errorContent = document.getElementById("error-content")

  if (loading) loading.style.display = "none"
  if (mainContent) mainContent.style.display = "none"
  if (errorContent) errorContent.style.display = "block"
}

// Show main content
function showMainContent() {
  const loading = document.getElementById("loading")
  const mainContent = document.getElementById("main-content")
  const errorContent = document.getElementById("error-content")

  if (loading) loading.style.display = "none"
  if (mainContent) mainContent.style.display = "block"
  if (errorContent) errorContent.style.display = "none"
}

// Initialize popup
async function initializePopup() {
  try {
    // Get current tab URL
    let currentUrl = "https://amazon.com/product/example" // Default for testing

    // Try to get actual current tab URL if chrome APIs are available
    if (typeof chrome !== "undefined" && chrome.tabs) {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        })
        if (tab?.url) {
          currentUrl = tab.url
        }
      } catch (error) {
        console.log("Could not get current tab URL, using default")
      }
    }

    // Get sustainability data
    const score = getSustainabilityScore(currentUrl)
    const alternatives = getAlternatives(2)
    const reward = getRewardOffer()

    // Update UI
    updateScoreDisplay(score)
    updateAlternativesDisplay(alternatives)
    updateRewardsDisplay(reward)
    updateImpactStats(alternatives)

    // Show main content
    showMainContent()
  } catch (error) {
    console.error("Error initializing popup:", error)
    showError()
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initialize popup
  initializePopup()

  // Copy code button
  const copyCodeBtn = document.getElementById("copy-code-btn")
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      const rewardCode = document.getElementById("reward-code")
      if (rewardCode) {
        copyToClipboard(rewardCode.textContent || "")
      }
    })
  }

  // Learn more button
  const learnMoreBtn = document.getElementById("learn-more-btn")
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", () => {
      window.open("https://www.un.org/sustainabledevelopment/", "_blank")
    })
  }

  // Settings button
  const settingsBtn = document.getElementById("settings-btn")
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      // Open extension options page (would be implemented later)
      console.log("Settings clicked - would open options page")
    })
  }

  // Retry button
  const retryBtn = document.getElementById("retry-btn")
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      location.reload()
    })
  }
})

console.log("Sustainability Extension Popup Script Loaded")
