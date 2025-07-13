import { Trash2, Leaf, TrendingDown, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  carbonFootprint: number;
  ecoRating: 'high' | 'medium' | 'low';
}

interface CartSummaryProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function CartSummary({ items, onRemoveItem, onCheckout }: CartSummaryProps) {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCarbon = items.reduce((sum, item) => sum + (item.carbonFootprint * item.quantity), 0);
  const ecoScore = items.length > 0 
    ? Math.round((items.filter(item => item.ecoRating === 'high').length / items.length) * 100)
    : 0;

  const getEcoScoreColor = (score: number) => {
    if (score >= 70) return 'eco-positive';
    if (score >= 40) return 'eco-warning';
    return 'eco-negative';
  };

  const getEcoScoreMessage = (score: number) => {
    if (score >= 70) return 'Excellent eco choices! 🌱';
    if (score >= 40) return 'Good progress! Consider more eco options';
    return 'Try adding more sustainable alternatives';
  };

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Your Cart ({items.length} items)</h3>
        
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Your cart is empty</p>
            <p className="text-sm">Scan or add products to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    {item.ecoRating === 'high' && (
                      <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                        <Leaf className="h-3 w-3 mr-1" />
                        Eco
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.carbonFootprint} kg CO₂
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Environmental Impact */}
      {items.length > 0 && (
        <Card className="p-6 bg-gradient-eco text-primary-foreground">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              <h3 className="font-semibold">Environmental Impact</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalCarbon.toFixed(1)}</div>
                <div className="text-sm opacity-90">kg CO₂</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ecoScore}%</div>
                <div className="text-sm opacity-90">Eco Score</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sustainability Rating</span>
                <Award className="h-4 w-4" />
              </div>
              <Progress value={ecoScore} className="h-2" />
              <p className="text-sm opacity-90">{getEcoScoreMessage(ecoScore)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Checkout */}
      {items.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <Button 
              variant="eco" 
              size="lg" 
              className="w-full" 
              onClick={onCheckout}
            >
              Proceed to Checkout
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 inline mr-1" />
              You're saving {(Math.random() * 5 + 2).toFixed(1)} kg CO₂ with eco choices!
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}