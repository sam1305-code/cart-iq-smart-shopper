import { useState } from 'react';
import { Scan, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ScannerInterfaceProps {
  onProductScanned: (productId: string) => void;
  isScanning: boolean;
  onToggleScanning: () => void;
}

export function ScannerInterface({ onProductScanned, isScanning, onToggleScanning }: ScannerInterfaceProps) {
  const [manualBarcode, setManualBarcode] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onProductScanned(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  const simulateBarcodeScan = () => {
    // Simulate common barcodes for demo
    const mockBarcodes = [
      '012345678901', // Regular detergent
      '123456789012', // Organic milk
      '234567890123', // Conventional bread
      '345678901234', // Eco-friendly soap
      '456789012345'  // Regular shampoo
    ];
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    onProductScanned(randomBarcode);
  };

  return (
    <Card className="p-6 bg-gradient-card border-0 shadow-card">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">Product Scanner</h3>
          <p className="text-muted-foreground text-sm">
            Scan barcodes to get eco-friendly alternatives
          </p>
        </div>

        {/* Scanner Camera View */}
        <div className="relative">
          <div className={`aspect-video bg-muted rounded-lg border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
            isScanning ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            {isScanning ? (
              <div className="text-center space-y-4">
                <div className="animate-pulse">
                  <Camera className="h-12 w-12 text-primary mx-auto" />
                </div>
                <p className="text-sm text-primary font-medium">Scanning for barcode...</p>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Scan className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Camera preview</p>
              </div>
            )}
          </div>

          {/* Scanning Overlay */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-32 border-2 border-primary rounded-lg bg-transparent">
                <div className="w-full h-0.5 bg-primary animate-pulse mt-16" />
              </div>
            </div>
          )}
        </div>

        {/* Scanner Controls */}
        <div className="flex gap-2">
          <Button
            variant={isScanning ? "destructive" : "scan"}
            onClick={isScanning ? onToggleScanning : simulateBarcodeScan}
            className="flex-1"
          >
            {isScanning ? (
              <>
                <X className="h-4 w-4" />
                Stop Scanning
              </>
            ) : (
              <>
                <Scan className="h-4 w-4" />
                Scan Product
              </>
            )}
          </Button>
        </div>

        {/* Manual Barcode Input */}
        <div className="space-y-2">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <Input
              placeholder="Enter barcode manually"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" disabled={!manualBarcode.trim()}>
              Add
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Try: 012345678901, 123456789012, or scan button for demo
          </p>
        </div>
      </div>
    </Card>
  );
}