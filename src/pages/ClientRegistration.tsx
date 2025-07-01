
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { isValidUgandanNIN } from '@/utils/ninValidation';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RegistrationFormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  phoneNumber: string;
  emailAddress: string;
  currentAddress: string;
  districtRegion: string;
  permanentAddress: string;
  occupation: string;
  employerBusiness: string;
  monthlyIncome: string;
  incomeSource: string;
  savingsAccountType: string;
  initialDepositAmount: string;
  savingsFrequency: string;
  savingsTarget: string;
  maturityPeriod: string;
  nextOfKinName: string;
  relationshipToClient: string;
  nextOfKinPhone: string;
  nextOfKinAddress: string;
}

const ClientRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    maritalStatus: '',
    phoneNumber: '',
    emailAddress: '',
    currentAddress: '',
    districtRegion: '',
    permanentAddress: '',
    occupation: '',
    employerBusiness: '',
    monthlyIncome: '',
    incomeSource: '',
    savingsAccountType: '',
    initialDepositAmount: '',
    savingsFrequency: '',
    savingsTarget: '',
    maturityPeriod: '',
    nextOfKinName: '',
    relationshipToClient: '',
    nextOfKinPhone: '',
    nextOfKinAddress: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof RegistrationFormData)[] = [
      'fullName', 'dateOfBirth', 'gender', 'nationality', 'maritalStatus',
      'phoneNumber', 'emailAddress', 'currentAddress', 'districtRegion',
      'occupation', 'employerBusiness', 'monthlyIncome', 'incomeSource',
      'savingsAccountType', 'initialDepositAmount', 'savingsFrequency',
      'savingsTarget', 'maturityPeriod', 'nextOfKinName', 'relationshipToClient',
      'nextOfKinPhone', 'nextOfKinAddress'
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    // Validate deposit amount is a number
    if (isNaN(Number(formData.initialDepositAmount)) || Number(formData.initialDepositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid initial deposit amount",
        variant: "destructive",
      });
      return false;
    }

    // Validate savings target is a number
    if (isNaN(Number(formData.savingsTarget)) || Number(formData.savingsTarget) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid savings target amount",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Store registration data temporarily
      const registrationData = {
        ...formData,
        registrationDate: new Date().toISOString()
      };

      localStorage.setItem('pendingRegistration', JSON.stringify(registrationData));

      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted successfully. Please contact the manager to get your account details.",
      });

      // Navigate to success page
      navigate('/registration-success', { state: { registrationData } });

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-garrison-green hover:text-garrison-black">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="bg-garrison-green text-white">
            <CardTitle className="text-2xl">Client Account Registration</CardTitle>
            <CardDescription className="text-white/80">
              Please fill out all fields to register for a new client account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-garrison-black">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      placeholder="Enter your nationality"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Marital Status *</Label>
                    <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorce">Divorce</SelectItem>
                        <SelectItem value="Widow/Widower">Widow/Widower</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address *</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-garrison-black">Address Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAddress">Current Address *</Label>
                    <Textarea
                      id="currentAddress"
                      value={formData.currentAddress}
                      onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                      placeholder="Enter your current address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="districtRegion">District/Region *</Label>
                    <Input
                      id="districtRegion"
                      value={formData.districtRegion}
                      onChange={(e) => handleInputChange('districtRegion', e.target.value)}
                      placeholder="Enter your district/region"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="permanentAddress">Permanent Address</Label>
                    <Textarea
                      id="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                      placeholder="Enter your permanent address (if different from current)"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-garrison-black">Employment Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      placeholder="Enter your occupation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerBusiness">Employer/Business *</Label>
                    <Input
                      id="employerBusiness"
                      value={formData.employerBusiness}
                      onChange={(e) => handleInputChange('employerBusiness', e.target.value)}
                      placeholder="Enter your employer or business name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Monthly Income *</Label>
                    <Select value={formData.monthlyIncome} onValueChange={(value) => handleInputChange('monthlyIncome', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than 50,000 UGX">Less than 50,000 UGX</SelectItem>
                        <SelectItem value="50,000 - 100,000 UGX">50,000 - 100,000 UGX</SelectItem>
                        <SelectItem value="100,000 - 150,000 UGX">100,000 - 150,000 UGX</SelectItem>
                        <SelectItem value="150,000 - 250,000 UGX">150,000 - 250,000 UGX</SelectItem>
                        <SelectItem value="Above 250,000 UGX">Above 250,000 UGX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incomeSource">Income Source *</Label>
                    <Input
                      id="incomeSource"
                      value={formData.incomeSource}
                      onChange={(e) => handleInputChange('incomeSource', e.target.value)}
                      placeholder="Enter your source of income"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Savings Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-garrison-black">Savings Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Savings Account Type *</Label>
                    <Select value={formData.savingsAccountType} onValueChange={(value) => handleInputChange('savingsAccountType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular Savings">Regular Savings</SelectItem>
                        <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                        <SelectItem value="Group / Joint Account">Group / Joint Account</SelectItem>
                        <SelectItem value="Children's Account">Children's Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialDepositAmount">Initial Deposit Amount (UGX) *</Label>
                    <Input
                      id="initialDepositAmount"
                      type="number"
                      value={formData.initialDepositAmount}
                      onChange={(e) => handleInputChange('initialDepositAmount', e.target.value)}
                      placeholder="Enter initial deposit amount"
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Savings Frequency *</Label>
                    <Select value={formData.savingsFrequency} onValueChange={(value) => handleInputChange('savingsFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select savings frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="savingsTarget">Savings Target (UGX) *</Label>
                    <Input
                      id="savingsTarget"
                      type="number"
                      value={formData.savingsTarget}
                      onChange={(e) => handleInputChange('savingsTarget', e.target.value)}
                      placeholder="Enter your savings target"
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="maturityPeriod">Maturity Period *</Label>
                    <Input
                      id="maturityPeriod"
                      value={formData.maturityPeriod}
                      onChange={(e) => handleInputChange('maturityPeriod', e.target.value)}
                      placeholder="Enter maturity period (e.g., 12 months, 2 years)"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Next of Kin Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-garrison-black">Next of Kin Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinName">Next of Kin Name *</Label>
                    <Input
                      id="nextOfKinName"
                      value={formData.nextOfKinName}
                      onChange={(e) => handleInputChange('nextOfKinName', e.target.value)}
                      placeholder="Enter next of kin's name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Relationship to Client *</Label>
                    <Select value={formData.relationshipToClient} onValueChange={(value) => handleInputChange('relationshipToClient', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Children">Children</SelectItem>
                        <SelectItem value="Brother">Brother</SelectItem>
                        <SelectItem value="Sister">Sister</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Colleague">Colleague</SelectItem>
                        <SelectItem value="Classmate">Classmate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinPhone">Next of Kin Phone *</Label>
                    <Input
                      id="nextOfKinPhone"
                      value={formData.nextOfKinPhone}
                      onChange={(e) => handleInputChange('nextOfKinPhone', e.target.value)}
                      placeholder="Enter next of kin's phone number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinAddress">Next of Kin Address *</Label>
                    <Textarea
                      id="nextOfKinAddress"
                      value={formData.nextOfKinAddress}
                      onChange={(e) => handleInputChange('nextOfKinAddress', e.target.value)}
                      placeholder="Enter next of kin's address"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-garrison-green hover:bg-green-700 py-3 text-lg"
              >
                {isLoading ? 'Submitting Registration...' : 'Submit Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientRegistration;
