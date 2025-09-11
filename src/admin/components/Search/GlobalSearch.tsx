import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, ArrowRight, Package, Users, ShoppingCart, TestTube, Building2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/shared/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'order' | 'user' | 'product' | 'lab_test' | 'doctor' | 'hospital';
  url: string;
  metadata?: any;
}

interface RecentSearch {
  query: string;
  timestamp: Date;
}

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('admin-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search Orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, total_amount, status, created_at')
        .or(`order_number.ilike.%${searchQuery}%,id::text.ilike.%${searchQuery}%`)
        .limit(5);

      orders?.forEach(order => {
        searchResults.push({
          id: order.id,
          title: `Order #${order.order_number}`,
          subtitle: `₹${order.total_amount} • ${order.status}`,
          type: 'order',
          url: `/admin/orders/${order.id}`,
          metadata: order
        });
      });

      // Search Users
      const { data: users } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, phone')
        .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
        .limit(5);

      users?.forEach(user => {
        searchResults.push({
          id: user.user_id,
          title: user.full_name || 'Unnamed User',
          subtitle: `${user.email} • ${user.phone || 'No phone'}`,
          type: 'user',
          url: `/admin/users/${user.user_id}`,
          metadata: user
        });
      });

      // Search Medicines
      const { data: medicines } = await supabase
        .from('medicines')
        .select('id, name, manufacturer, mrp')
        .or(`name.ilike.%${searchQuery}%,manufacturer.ilike.%${searchQuery}%`)
        .limit(5);

      medicines?.forEach(medicine => {
        searchResults.push({
          id: medicine.id,
          title: medicine.name,
          subtitle: `${medicine.manufacturer} • ₹${medicine.mrp}`,
          type: 'product',
          url: `/admin/medicines/${medicine.id}`,
          metadata: medicine
        });
      });

      // Search Lab Tests
      const { data: labTests } = await supabase
        .from('lab_tests')
        .select('id, name, description, mrp')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      labTests?.forEach(test => {
        searchResults.push({
          id: test.id,
          title: test.name,
          subtitle: `₹${test.mrp} • ${test.description?.substring(0, 50)}...`,
          type: 'lab_test',
          url: `/admin/lab-tests/${test.id}`,
          metadata: test
        });
      });

      // Search Doctors
      const { data: doctors } = await supabase
        .from('doctors')
        .select('id, name, qualification, clinic_name')
        .or(`name.ilike.%${searchQuery}%,qualification.ilike.%${searchQuery}%,clinic_name.ilike.%${searchQuery}%`)
        .limit(5);

      doctors?.forEach(doctor => {
        searchResults.push({
          id: doctor.id,
          title: doctor.name,
          subtitle: `${doctor.qualification} • ${doctor.clinic_name}`,
          type: 'doctor',
          url: `/admin/doctors/${doctor.id}`,
          metadata: doctor
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const newSearch: RecentSearch = {
      query: searchQuery,
      timestamp: new Date()
    };

    const updated = [newSearch, ...recentSearches.filter(s => s.query !== searchQuery)]
      .slice(0, 10); // Keep only last 10 searches

    setRecentSearches(updated);
    localStorage.setItem('admin-recent-searches', JSON.stringify(updated));
  };

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(query);
    setIsOpen(false);
    setQuery('');
    window.location.href = result.url;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'user': return Users;
      case 'product': return Package;
      case 'lab_test': return TestTube;
      case 'doctor': return Building2;
      case 'hospital': return Building2;
      default: return Search;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return 'Order';
      case 'user': return 'User';
      case 'product': return 'Medicine';
      case 'lab_test': return 'Lab Test';
      case 'doctor': return 'Doctor';
      case 'hospital': return 'Hospital';
      default: return 'Result';
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search everything... (Ctrl+K)"
            className="pl-10 pr-16"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Badge variant="secondary" className="text-xs">
              ⌘K
            </Badge>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search orders, users, products..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            
            {!loading && query && results.length === 0 && (
              <CommandEmpty>No results found for "{query}"</CommandEmpty>
            )}

            {!loading && results.length > 0 && (
              <CommandGroup heading={`Results for "${query}"`}>
                {results.map((result) => {
                  const Icon = getIcon(result.type);
                  return (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="flex-shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{result.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(result.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {!query && recentSearches.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Recent Searches">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => {
                        setQuery(search.query);
                        performSearch(search.query);
                      }}
                      className="flex items-center gap-3 px-4 py-2"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{search.query}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {!query && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Quick Actions">
                  <CommandItem onSelect={() => window.location.href = '/admin/orders'}>
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    View All Orders
                  </CommandItem>
                  <CommandItem onSelect={() => window.location.href = '/admin/medicines'}>
                    <Package className="h-4 w-4 mr-3" />
                    Manage Products
                  </CommandItem>
                  <CommandItem onSelect={() => window.location.href = '/admin/users'}>
                    <Users className="h-4 w-4 mr-3" />
                    User Management
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};