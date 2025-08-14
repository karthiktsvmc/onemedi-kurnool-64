import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { AlertTriangle, Info, CheckCircle, ThermometerSun } from 'lucide-react';

interface ProductTabsProps {
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  warnings: string[];
  ingredients: string[];
  composition: string;
  howToUse: string[];
  safetyInfo: string[];
  storageInstructions: string[];
  expertAdvice: string[];
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  description,
  uses,
  dosage,
  sideEffects,
  warnings,
  ingredients,
  composition,
  howToUse,
  safetyInfo,
  storageInstructions,
  expertAdvice
}) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="uses">Uses</TabsTrigger>
        <TabsTrigger value="dosage">Dosage</TabsTrigger>
        <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
        <TabsTrigger value="safety">Safety</TabsTrigger>
        <TabsTrigger value="expert">Expert Advice</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-foreground leading-relaxed">{description}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="uses" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Uses & Benefits
            </h3>
            <ul className="space-y-2">
              {uses.map((use, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-foreground">{use}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dosage" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Dosage Instructions
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-foreground">{dosage}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              ⚠️ Always follow your doctor's prescription. Do not exceed the recommended dose.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="side-effects" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Side Effects & Warnings
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Common Side Effects:</h4>
                <div className="flex flex-wrap gap-2">
                  {sideEffects.map((effect, index) => (
                    <Badge key={index} variant="outline" className="border-red-200 text-red-700">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Warnings:</h4>
                <ul className="space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ingredients" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Composition & Ingredients</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Active Ingredients:</h4>
                <p className="text-foreground bg-secondary p-3 rounded">{composition}</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">All Ingredients:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary rounded">
                      <span className="text-sm text-foreground">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="how-to-use" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">How to Use</h3>
            <div className="space-y-3">
              {howToUse.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-foreground">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="safety" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-orange-600" />
              Safety Information & Storage
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Safety Information:</h4>
                <ul className="space-y-1">
                  {safetyInfo.map((info, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Storage Instructions:</h4>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <ul className="space-y-1">
                    {storageInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ThermometerSun className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expert" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Expert Pharmacist Advice</h3>
            <div className="space-y-3">
              {expertAdvice.map((advice, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-foreground italic">"{advice}"</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-primary-light rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Need personalized advice?</strong> Our licensed pharmacists are available 24/7 
                to answer your questions about this medication.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};