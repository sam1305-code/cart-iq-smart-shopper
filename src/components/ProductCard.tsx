import { Plus, Leaf, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  carbonFootprint: number;
  ecoRating: 'high' | 'medium' | 'low';
  isEcoAlternative?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showEcoInfo?: boolean;
}

export function ProductCard({ product, onAddToCart, showEcoInfo = true }: ProductCardProps) {
  const getEcoColor = (rating: string) => {
    switch (rating) {
      case 'high': return 'eco-positive';
      case 'medium': return 'eco-warning';
      case 'low': return 'eco-negative';
      default: return 'muted';
    }
  };

  const getEcoIcon = (rating: string) => {
    switch (rating) {
      case 'high': return <Leaf className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className={`p-4 hover:shadow-lg transition-all duration-300 ${
      product.isEcoAlternative ? 'border-primary bg-accent/20 animate-bounce-in' : 'hover:shadow-card'
    }`}>
      <div className="space-y-4">
        {/* Product Image */}
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          <div className="text-6xl">{product.image}</div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
            {product.isEcoAlternative && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                Eco Choice
              </Badge>
            )}
          </div>
          
          <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
        </div>

        {/* Eco Information */}
        {showEcoInfo && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Carbon Impact:</span>
              <div className={`flex items-center gap-1 text-${getEcoColor(product.ecoRating)}`}>
                {getEcoIcon(product.ecoRating)}
                <span className="font-medium">{product.carbonFootprint} kg CO₂</span>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-${getEcoColor(product.ecoRating)} transition-all duration-500`}
                style={{ 
                  width: product.ecoRating === 'high' ? '90%' : 
                         product.ecoRating === 'medium' ? '60%' : '30%' 
                }}
              />
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <Button 
          variant={product.isEcoAlternative ? "eco" : "outline"}
          className="w-full"
          onClick={() => onAddToCart(product)}
        >
          <Plus className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}