
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import IDCardScanner from './IDCardScanner';

interface LoanDetailsFormProps {
  onSubmit: (formData: LoanFormData, idCardFront: Blob, idCardBack: Blob) => void;
  isSubmitting: boolean;
}

export interface LoanFormData {
  name: string;
  gender: string;
  whatsappNumber: string;
  educationDegree: string;
  workStatus: string;
  monthlyIncome: string;
  maritalStatus: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

const LoanDetailsForm: React.FC<LoanDetailsFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<LoanFormData>({
    name: '',
    gender: '',
    whatsappNumber: '',
    educationDegree: '',
    workStatus: '',
    monthlyIncome: '',
    maritalStatus: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  const [idCardFront, setIdCardFront] = useState<Blob | null>(null);
  const [idCardBack, setIdCardBack] = useState<Blob | null>(null);
  const [formError, setFormError] = useState('');

  const handleInputChange = (field: keyof LoanFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError('');
  };

  const handleIDCardCapture = (frontImage: Blob, backImage: Blob) => {
    console.log('ID Card images captured:', { frontSize: frontImage.size, backSize: backImage.size });
    setIdCardFront(frontImage);
    setIdCardBack(backImage);
    setFormError(''); // Clear any previous errors
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof LoanFormData)[] = [
      'name', 'gender', 'whatsappNumber', 'educationDegree', 'workStatus', 
      'monthlyIncome', 'maritalStatus', 'emergencyContactName', 
      'emergencyContactPhone', 'emergencyContactRelation'
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setFormError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!idCardFront || !idCardBack) {
      setFormError('Please scan both sides of your ID card');
      return false;
    }

    // Additional validation for ID card blobs
    if (idCardFront.size === 0 || idCardBack.size === 0) {
      setFormError('ID card images appear to be empty. Please try scanning again.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    console.log('Form submission started');
    
    if (!validateForm()) {
      console.log('Form validation failed:', formError);
      return;
    }

    console.log('Form validation passed, calling onSubmit');
    try {
      onSubmit(formData, idCardFront!, idCardBack!);
    } catch (error) {
      console.error('Error during form submission:', error);
      setFormError('An error occurred during submission. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader className="bg-garrison-green text-white">
          <CardTitle>Personal Information</CardTitle>
          <CardDescription className="text-white/80">
            Please provide your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
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
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
              placeholder="Enter your WhatsApp number"
            />
          </div>

          <div className="space-y-2">
            <Label>Education Degree</Label>
            <Select value={formData.educationDegree} onValueChange={(value) => handleInputChange('educationDegree', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary school">Primary school</SelectItem>
                <SelectItem value="Middle/High school">Middle/High school</SelectItem>
                <SelectItem value="College/University">College/University</SelectItem>
                <SelectItem value="Master/Dr">Master/Dr</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Work Status</Label>
            <Select value={formData.workStatus} onValueChange={(value) => handleInputChange('workStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your work status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Self employee">Self employee</SelectItem>
                <SelectItem value="No income">No income</SelectItem>
                <SelectItem value="Employer">Employer</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Civil servant">Civil servant</SelectItem>
                <SelectItem value="Soldier">Soldier</SelectItem>
                <SelectItem value="Police Officer">Police Officer</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Monthly Income</Label>
            <Select value={formData.monthlyIncome} onValueChange={(value) => handleInputChange('monthlyIncome', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your monthly income range" />
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
            <Label>Marital Status</Label>
            <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your marital status" />
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
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader className="bg-garrison-black text-white">
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription className="text-white/80">
            Please provide emergency contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            <Input
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              placeholder="Enter emergency contact name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone Number</Label>
            <Input
              id="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              placeholder="Enter emergency contact phone number"
            />
          </div>

          <div className="space-y-2">
            <Label>Emergency Contact Relation</Label>
            <Select value={formData.emergencyContactRelation} onValueChange={(value) => handleInputChange('emergencyContactRelation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Children">Children</SelectItem>
                <SelectItem value="Brother">Brother</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Colleague">Colleague</SelectItem>
                <SelectItem value="Classmate">Classmate</SelectItem>
                <SelectItem value="Sister">Sister</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ID Card Scanner */}
      <Card>
        <CardHeader className="bg-garrison-green text-white">
          <CardTitle>Uganda National ID Verification</CardTitle>
          <CardDescription className="text-white/80">
            Please scan both sides of your National ID card
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <IDCardScanner 
            onImagesCapture={handleIDCardCapture}
            onError={setFormError}
          />
        </CardContent>
      </Card>

      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{formError}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-garrison-green hover:bg-green-700 py-3 text-lg"
      >
        {isSubmitting ? 'Submitting Application...' : 'Submit Loan Application'}
      </Button>
    </div>
  );
};

export default LoanDetailsForm;
