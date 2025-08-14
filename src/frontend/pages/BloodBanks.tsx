import { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Search, MapPin, Filter, Droplets } from 'lucide-react';
import { BloodBankCard } from '@/frontend/components/BloodBanks/BloodBankCard';
import { mockBloodBanks } from '@/frontend/data/mockBloodBanksData';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BloodBanks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBloodBanks = mockBloodBanks.filter((bank) => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = !selectedBloodGroup || bank.bloodGroups.includes(selectedBloodGroup);
    
    return matchesSearch && matchesBloodGroup;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-6 h-6 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">Blood Banks</h1>
          </div>
          <p className="text-muted-foreground">Find blood banks near you for donation and emergency requirements</p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search blood banks by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Kurnool, AP</span>
                </div>
              </div>

              {showFilters && (
                <div className="border-t border-border pt-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Blood Group</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedBloodGroup === '' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => setSelectedBloodGroup('')}
                      >
                        All Groups
                      </Badge>
                      {bloodGroups.map((group) => (
                        <Badge
                          key={group}
                          variant={selectedBloodGroup === group ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => setSelectedBloodGroup(group)}
                        >
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {filteredBloodBanks.length} Blood Banks Found
            </h2>
            {selectedBloodGroup && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {selectedBloodGroup}
              </Badge>
            )}
          </div>
        </div>

        {/* Blood Banks Grid */}
        {filteredBloodBanks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBloodBanks.map((bloodBank) => (
              <BloodBankCard key={bloodBank.id} bloodBank={bloodBank} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Droplets className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Blood Banks Found</h3>
              <p className="text-muted-foreground">
                No blood banks match your search criteria. Try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact */}
        <Card className="mt-8 bg-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Droplets className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Emergency Blood Requirement?</h3>
                <p className="text-sm text-muted-foreground">Call our 24/7 helpline for urgent blood needs</p>
              </div>
              <Button size="sm" variant="destructive">
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};