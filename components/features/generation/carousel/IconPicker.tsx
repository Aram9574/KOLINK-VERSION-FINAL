import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { DynamicIcon, iconMap } from './DynamicIcon';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = Object.keys(iconMap).filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-12 h-12 p-0 rounded-lg border-2 border-slate-200 hover:border-brand-500 hover:bg-slate-50 relative group">
          <DynamicIcon name={selectedIcon || 'star'} className="w-6 h-6 text-slate-700" />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
             <span className="text-[10px] font-bold text-slate-700">EDIT</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
          <div className="p-3 border-b border-slate-100">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                   placeholder="Search icons..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-9 h-9"
                />
             </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2 grid grid-cols-6 gap-1">
             {filteredIcons.map(iconName => (
                 <Button
                    key={iconName}
                    variant="ghost"
                    className={`h-10 w-10 p-0 rounded-md hover:bg-slate-100 ${selectedIcon === iconName ? 'bg-brand-50 text-brand-600 ring-2 ring-brand-500' : 'text-slate-600'}`}
                    onClick={() => {
                        onSelect(iconName);
                        setOpen(false);
                    }}
                    title={iconName}
                 >
                     <DynamicIcon name={iconName} className="w-5 h-5" />
                 </Button>
             ))}
             {filteredIcons.length === 0 && (
                 <div className="col-span-6 text-center py-8 text-sm text-slate-500">
                     No icons found.
                 </div>
             )}
          </div>
      </PopoverContent>
    </Popover>
  );
};
