
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Shield, Clock, ExternalLink } from 'lucide-react';
import { generateAccessLink } from '@/utils/adminTokenGenerator';

const AdminEmailPortal = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const { toast } = useToast();

  const AUTHORIZED_EMAIL = 'garrisonfinancialnexus01@gmail.com';

  const handleGenerateLink = async () => {
    if (adminEmail.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
      toast({
        title: "Access Denied",
        description: "Only authorized email addresses can request admin access",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const accessLink = generateAccessLink();
      setGeneratedLink(accessLink);
      
      toast({
        title: "Access Link Generated",
        description: "Secure admin access link has been created and is ready to use",
      });
      
      // In a real implementation, this would send an email
      console.log(`Admin Access Link for ${adminEmail}:`, accessLink);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate admin access link",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Link Copied",
        description: "Admin access link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const openAdminPanel = () => {
    window.open(generatedLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-garrison-green" />
              Admin Email Portal
            </CardTitle>
            <CardDescription>
              Secure access for Garrison Financial Nexus administrators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Administrator Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter authorized admin email"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Only authorized administrators can access the balance editor
                </p>
              </div>

              <Button
                onClick={handleGenerateLink}
                disabled={isGenerating || !adminEmail}
                className="w-full bg-garrison-green hover:bg-garrison-green/90"
              >
                {isGenerating ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-pulse" />
                    Generating Access Link...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Admin Access Link
                  </>
                )}
              </Button>
            </div>

            {generatedLink && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Secure Access Link Generated</span>
                </div>
                
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded border text-sm font-mono break-all">
                    {generatedLink}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={copyLinkToClipboard}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Copy Link
                    </Button>
                    <Button
                      onClick={openAdminPanel}
                      size="sm"
                      className="flex-1 bg-garrison-green hover:bg-garrison-green/90"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Open Admin Panel
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <Clock className="h-3 w-3" />
                  <span>Link expires when session ends and is single-use</span>
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="text-xs text-gray-500">
                Security Notice: Access links are encrypted and time-limited
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminEmailPortal;
