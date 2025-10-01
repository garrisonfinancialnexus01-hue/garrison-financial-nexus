import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RegularClientSearch = () => {
  const [searchName, setSearchName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const loanData = location.state;

  if (!loanData) {
    navigate('/loan-application');
    return null;
  }

  const handleSearch = async () => {
    if (!searchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name to search",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .ilike('name', `%${searchName.trim()}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setSearchResults(data);
        toast({
          title: "Search Results",
          description: `Found ${data.length} matching client(s)`,
        });
      } else {
        toast({
          title: "No Results",
          description: "No clients found with that name. Please try a different name or register as a new client.",
          variant: "destructive"
        });
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching clients:', error);
      toast({
        title: "Error",
        description: "Failed to search for clients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
  };

  const handleProceed = () => {
    if (selectedClient) {
      navigate('/regular-client-application', { 
        state: { 
          ...loanData, 
          existingClient: selectedClient 
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/client-type-selection', { state: loanData });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="text-garrison-green border-garrison-green hover:bg-garrison-green hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Client Type Selection
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Search Regular Client</h1>
        <p className="text-gray-600">
          Enter your name to search for your existing client information.
        </p>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader className="bg-garrison-green text-white">
          <CardTitle>Client Search</CardTitle>
          <CardDescription className="text-white/80">
            Search for existing client records
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-name">Full Name</Label>
              <Input
                id="search-name"
                type="text"
                placeholder="Enter your full name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchName.trim()}
              className="w-full bg-garrison-green hover:bg-green-700"
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Select your client record from the results below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((client) => (
                <div
                  key={client.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedClient?.id === client.id
                      ? 'border-garrison-green bg-green-50'
                      : 'border-gray-200 hover:border-garrison-green'
                  }`}
                  onClick={() => handleSelectClient(client)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <strong className="text-garrison-green">Name:</strong> {client.name}
                    </div>
                    <div>
                      <strong className="text-garrison-green">Phone:</strong> {client.whatsapp_number || client.phone}
                    </div>
                    {client.gender && (
                      <div>
                        <strong className="text-garrison-green">Gender:</strong> {client.gender}
                      </div>
                    )}
                    {client.education_degree && (
                      <div>
                        <strong className="text-garrison-green">Education:</strong> {client.education_degree}
                      </div>
                    )}
                    {client.work_status && (
                      <div>
                        <strong className="text-garrison-green">Work Status:</strong> {client.work_status}
                      </div>
                    )}
                    {client.monthly_income && (
                      <div>
                        <strong className="text-garrison-green">Monthly Income:</strong> {client.monthly_income}
                      </div>
                    )}
                    <div>
                      <strong className="text-garrison-green">Last Application:</strong> {new Date(client.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <strong className="text-garrison-green">Previous Amount:</strong> {Number(client.amount).toLocaleString()} UGX
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedClient && (
              <div className="mt-6 pt-6 border-t">
                <Button 
                  onClick={handleProceed}
                  className="w-full bg-garrison-green hover:bg-green-700"
                >
                  Proceed with Selected Client
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RegularClientSearch;