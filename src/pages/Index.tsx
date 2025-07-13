import { useState, useCallback } from 'react';
import { ShoppingCart, Sparkles, Leaf, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { ProductCard } from '@/components/ProductCard';
import { ScannerInterface } from '@/components/ScannerInterface';
import { CartSummary } from '@/components/CartSummary';
import { useToast } from '@/hooks/use-toast';
import { processVoiceCommand } from '@/utils/voiceCommands';
import heroImage from '@/assets/cart-hero.jpg';

// Mock product database
const PRODUCT_DATABASE = {
  '012345678901': {
    id: '1',
    name: 'Regular Laundry Detergent',
    price: 8.99,
    image: '🧴',
    carbonFootprint: 3.2,
    ecoRating: 'low' as const,
    alternatives: ['2', '3']
  },
  '123456789012': {
    id: '4',
    name: 'Organic Whole Milk',
    price: 4.99,
    image: '🥛',
    carbonFootprint: 1.8,
    ecoRating: 'high' as const,
    alternatives: []
  },
  '234567890123': {
    id: '5',
    name: 'White Bread',
    price: 2.49,
    image: '🍞',
    carbonFootprint: 2.1,
    ecoRating: 'medium' as const,
    alternatives: ['6']
  },
  '345678901234': {
    id: '7',
    name: 'Eco-Friendly Dish Soap',
    price: 6.99,
    image: '🧽',
    carbonFootprint: 0.8,
    ecoRating: 'high' as const,
    alternatives: []
  },
  '456789012345': {
    id: '8',
    name: 'Regular Shampoo',
    price: 7.99,
    image: '🧴',
    carbonFootprint: 2.5,
    ecoRating: 'low' as const,
    alternatives: ['9']
  }
};

const ECO_ALTERNATIVES = {
  '2': {
    id: '2',
    name: 'Plant-Based Laundry Pods',
    price: 12.99,
    image: '🌱',
    carbonFootprint: 1.2,
    ecoRating: 'high' as const,
    isEcoAlternative: true
  },
  '3': {
    id: '3',
    name: 'Concentrated Eco Detergent',
    price: 9.99,
    image: '♻️',
    carbonFootprint: 1.8,
    ecoRating: 'high' as const,
    isEcoAlternative: true
  },
  '6': {
    id: '6',
    name: 'Organic Whole Grain Bread',
    price: 3.99,
    image: '🌾',
    carbonFootprint: 1.1,
    ecoRating: 'high' as const,
    isEcoAlternative: true
  },
  '9': {
    id: '9',
    name: 'Sulfate-Free Natural Shampoo',
    price: 11.99,
    image: '🌿',
    carbonFootprint: 1.1,
    ecoRating: 'high' as const,
    isEcoAlternative: true
  }
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  carbonFootprint: number;
  ecoRating: 'high' | 'medium' | 'low';
}

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [ecoAlternatives, setEcoAlternatives] = useState([]);
  const [currentView, setCurrentView] = useState<'home' | 'scanner' | 'cart'>('home');
  const { toast } = useToast();

  const handleVoiceCommand = useCallback((command: string) => {
    setIsListening(false);
    
    // Process the voice command using our enhanced processor
    const result = processVoiceCommand(command);
    
    // Show the response to user
    toast({
      title: getCommandTypeIcon(result.type) + " " + getCommandTypeTitle(result.type),
      description: result.response,
    });
    
    // Handle different actions
    switch (result.action) {
      case 'show_map':
      case 'show_alternatives':
      case 'show_scanner':
      case 'prompt_scan':
        setCurrentView('scanner');
        break;
      case 'show_carbon_details':
      case 'show_eco_products':
        if (cartItems.length > 0) {
          setCurrentView('cart');
        } else {
          setCurrentView('scanner');
        }
        break;
      case 'show_help':
        // Stay on current view, just show helpful message
        break;
    }
    
    // If it's a detergent alternative query, simulate scanning a detergent
    if (result.data === 'detergent') {
      setTimeout(() => handleProductScanned('012345678901'), 1000);
    }
    // If it's a shampoo alternative query, simulate scanning shampoo  
    if (result.data === 'shampoo') {
      setTimeout(() => handleProductScanned('456789012345'), 1000);
    }
  }, [toast, cartItems.length]);
  
  const getCommandTypeIcon = (type: string) => {
    switch (type) {
      case 'location': return '📍';
      case 'alternatives': return '🌱';
      case 'availability': return '✅';
      case 'eco': return '♻️';
      case 'carbon': return '🌍';
      default: return '🤖';
    }
  };
  
  const getCommandTypeTitle = (type: string) => {
    switch (type) {
      case 'location': return 'Store Navigation';
      case 'alternatives': return 'Eco Alternatives';
      case 'availability': return 'Product Availability';
      case 'eco': return 'Sustainability Assistant';
      case 'carbon': return 'Carbon Impact';
      default: return 'EcoCart Assistant';
    }
  };

  const handleProductScanned = useCallback((barcode: string) => {
    setIsScanning(false);
    const product = PRODUCT_DATABASE[barcode];
    
    if (product) {
      setCurrentProduct(product);
      
      // Find eco alternatives
      const alternatives = product.alternatives.map(id => ECO_ALTERNATIVES[id]).filter(Boolean);
      setEcoAlternatives(alternatives);
      
      toast({
        title: "Product Scanned!",
        description: `Found ${product.name}${alternatives.length > 0 ? ` and ${alternatives.length} eco alternatives` : ''}`,
      });
    } else {
      toast({
        title: "Product Not Found",
        description: "Try scanning another barcode or add manually",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleAddToCart = useCallback((product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(items => 
        items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(items => [...items, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        carbonFootprint: product.carbonFootprint,
        ecoRating: product.ecoRating
      }]);
    }

    toast({
      title: product.isEcoAlternative ? "🌱 Eco Choice Added!" : "Added to Cart",
      description: `${product.name} - $${product.price.toFixed(2)}`,
    });
  }, [cartItems, toast]);

  const handleRemoveFromCart = useCallback((id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  }, []);

  const handleCheckout = useCallback(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalCarbon = cartItems.reduce((sum, item) => sum + (item.carbonFootprint * item.quantity), 0);
    
    toast({
      title: "🎉 Checkout Complete!",
      description: `${totalItems} items • ${totalCarbon.toFixed(1)} kg CO₂ impact`,
    });
    
    setCartItems([]);
    setCurrentView('home');
  }, [cartItems, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-eco text-primary-foreground p-4 shadow-eco">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">EcoCart</h1>
              <p className="text-sm opacity-90">Smart Shopping Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={currentView === 'home' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('home')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Home
            </Button>
            <Button
              variant={currentView === 'scanner' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('scanner')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <QrCode className="h-4 w-4 mr-1" />
              Scan
            </Button>
            <Button
              variant={currentView === 'cart' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('cart')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Cart ({cartItems.length})
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Card className="relative overflow-hidden border-0 shadow-card">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
              <div className="relative p-8 flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold">Shop Sustainably</h2>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-md">
                    Get eco-friendly alternatives, track your carbon footprint, and make better choices with AI assistance.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="eco" size="lg" onClick={() => setCurrentView('scanner')}>
                      <QrCode className="h-5 w-5 mr-2" />
                      Start Scanning
                    </Button>
                    <Button variant="voice" size="lg" onClick={() => setIsListening(true)}>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Voice Assistant
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src={heroImage} 
                    alt="Smart Cart Interface" 
                    className="w-96 h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </Card>

            {/* Voice Assistant */}
            <VoiceAssistant
              isListening={isListening}
              onToggleListening={() => setIsListening(!isListening)}
              onVoiceCommand={handleVoiceCommand}
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{cartItems.length}</div>
                <div className="text-sm text-muted-foreground">Items in Cart</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-eco-positive">
                  {cartItems.reduce((sum, item) => sum + item.carbonFootprint * item.quantity, 0).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">kg CO₂ Impact</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-eco-warning">
                  {cartItems.length > 0 
                    ? Math.round((cartItems.filter(item => item.ecoRating === 'high').length / cartItems.length) * 100)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Eco Score</div>
              </Card>
            </div>
          </>
        )}

        {currentView === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ScannerInterface
                onProductScanned={handleProductScanned}
                isScanning={isScanning}
                onToggleScanning={() => setIsScanning(!isScanning)}
              />
            </div>
            
            <div className="space-y-6">
              {currentProduct && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Scanned Product</h3>
                  <ProductCard
                    product={currentProduct}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              )}
              
              {ecoAlternatives.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">🌱 Eco-Friendly Alternatives</h3>
                  <div className="space-y-3">
                    {ecoAlternatives.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'cart' && (
          <CartSummary
            items={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
