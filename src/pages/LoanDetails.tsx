
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const LoanDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const state = location.state as { 
    amount: number, 
    term: 'short' | 'medium',
    interest: number,
    totalAmount: number
  } | null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nin: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    nin: ''
  });

  if (!state) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Loan Details Not Found</h1>
        <p className="text-gray-600 mb-8">
          Please start your loan application process again.
        </p>
        <Button asChild className="bg-garrison-green hover:bg-green-700">
          <a href="/loan-application">Return to Application</a>
        </Button>
      </div>
    );
  }

  const { amount, term, interest, totalAmount } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.nin.trim()) {
      newErrors.nin = 'NIN is required';
      valid = false;
    } else if (formData.nin.trim().length < 10) {
      newErrors.nin = 'NIN should be at least 10 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      toast({
        title: "Application submitted successfully",
        description: "Our team will review your application and contact you soon.",
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-garrison-black mb-4">Complete Your Loan Application</h1>
        <p className="text-gray-600">
          Please provide your personal details to complete the application process.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-garrison-green text-white">
          <CardTitle>Personal Information</CardTitle>
          <CardDescription className="text-white/80">
            Fill in your details for verification
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +256700000000"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nin">National Identification Number (NIN)</Label>
              <Input
                id="nin"
                name="nin"
                value={formData.nin}
                onChange={handleChange}
                placeholder="Enter your NIN"
                className={errors.nin ? "border-red-500" : ""}
              />
              {errors.nin && <p className="text-red-500 text-sm mt-1">{errors.nin}</p>}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-garrison-black mb-2">Loan Summary:</h3>
              <div className="flex justify-between mt-2 text-sm">
                <span>Loan Amount:</span>
                <span>{amount.toLocaleString()} UGX</span>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>Interest Rate:</span>
                <span>{interest}%</span>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>Repayment Term:</span>
                <span>{term === 'short' ? '2 Weeks' : '1 Month'}</span>
              </div>
              <div className="flex justify-between mt-3 font-medium">
                <span>Total Repayment:</span>
                <span>{totalAmount.toLocaleString()} UGX</span>
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full bg-garrison-green hover:bg-green-700"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanDetails;
