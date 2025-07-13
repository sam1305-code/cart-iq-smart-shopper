// Store location and inventory data
export const STORE_MAP = {
  aisles: {
    1: { name: "Fresh Produce", items: ["organic apples", "bananas", "lettuce", "carrots"] },
    2: { name: "Dairy & Eggs", items: ["almond milk", "oat milk", "organic milk", "yogurt", "cheese"] },
    3: { name: "Bakery", items: ["organic bread", "whole grain bread", "croissants", "bagels"] },
    4: { name: "Pantry Staples", items: ["pasta", "rice", "quinoa", "canned beans"] },
    5: { name: "Health & Beauty", items: ["sulfate-free shampoo", "natural soap", "toothpaste"] },
    6: { name: "Cleaning Supplies", items: ["eco detergent", "plant-based cleaner", "dish soap"] },
    7: { name: "Frozen Foods", items: ["frozen vegetables", "plant-based meals", "ice cream"] },
    8: { name: "Beverages", items: ["kombucha", "organic juice", "herbal tea"] }
  },
  
  findItemLocation: (itemName: string) => {
    const lowerItem = itemName.toLowerCase();
    for (const [aisleNum, aisle] of Object.entries(STORE_MAP.aisles)) {
      const foundItem = aisle.items.find(item => 
        item.toLowerCase().includes(lowerItem) || lowerItem.includes(item.toLowerCase())
      );
      if (foundItem) {
        return { aisle: parseInt(aisleNum), name: aisle.name, item: foundItem };
      }
    }
    return null;
  }
};

// Enhanced voice command processor
export const processVoiceCommand = (command: string) => {
  const lowerCommand = command.toLowerCase();
  
  // Location queries
  if (lowerCommand.includes('where') || lowerCommand.includes('aisle') || lowerCommand.includes('find')) {
    const keywords = ['milk', 'bread', 'pasta', 'shampoo', 'detergent', 'soap', 'juice', 'vegetables'];
    const foundKeyword = keywords.find(keyword => lowerCommand.includes(keyword));
    
    if (foundKeyword) {
      const location = STORE_MAP.findItemLocation(foundKeyword);
      if (location) {
        return {
          type: 'location',
          response: `${foundKeyword.charAt(0).toUpperCase() + foundKeyword.slice(1)} is in Aisle ${location.aisle} - ${location.name}. Look for ${location.item}!`,
          action: 'show_map',
          data: location
        };
      }
    }
    return {
      type: 'location',
      response: "I can help you find items! Try asking about milk, bread, pasta, shampoo, or other products.",
      action: 'show_help'
    };
  }
  
  // Better alternatives queries
  if (lowerCommand.includes('better') || lowerCommand.includes('alternative') || lowerCommand.includes('healthier')) {
    if (lowerCommand.includes('detergent') || lowerCommand.includes('laundry')) {
      return {
        type: 'alternatives',
        response: "I found 2 eco-friendly detergent alternatives! Plant-based pods and concentrated eco detergent both have 60% less carbon footprint.",
        action: 'show_alternatives',
        data: 'detergent'
      };
    }
    if (lowerCommand.includes('shampoo')) {
      return {
        type: 'alternatives',
        response: "Try our sulfate-free natural shampoo! It's in Aisle 5 and has 50% less environmental impact than regular shampoo.",
        action: 'show_alternatives',
        data: 'shampoo'
      };
    }
    if (lowerCommand.includes('bread')) {
      return {
        type: 'alternatives',
        response: "Our organic whole grain bread has more nutrients and uses sustainable farming. It's in Aisle 3!",
        action: 'show_alternatives',
        data: 'bread'
      };
    }
    return {
      type: 'alternatives',
      response: "I can suggest better alternatives! Scan a product or ask about specific items like detergent, shampoo, or bread.",
      action: 'prompt_scan'
    };
  }
  
  // Availability queries
  if (lowerCommand.includes('do you have') || lowerCommand.includes('available') || lowerCommand.includes('stock')) {
    return {
      type: 'availability',
      response: "Yes! We have that item in stock. Would you like me to show you the location and any eco-friendly alternatives?",
      action: 'show_scanner'
    };
  }
  
  // Eco/sustainability queries
  if (lowerCommand.includes('eco') || lowerCommand.includes('sustainable') || lowerCommand.includes('green')) {
    return {
      type: 'eco',
      response: "Great choice! I'll show you our eco-friendly options with lower carbon footprints and sustainable packaging.",
      action: 'show_eco_products'
    };
  }
  
  // Carbon footprint queries
  if (lowerCommand.includes('carbon') || lowerCommand.includes('environmental') || lowerCommand.includes('impact')) {
    return {
      type: 'carbon',
      response: "Your current cart has a carbon footprint of X kg CO₂. I can suggest alternatives to reduce this by up to 40%!",
      action: 'show_carbon_details'
    };
  }
  
  // General help
  return {
    type: 'general',
    response: "I can help you find items, suggest eco-friendly alternatives, check availability, and reduce your environmental impact. What would you like to know?",
    action: 'show_help'
  };
};