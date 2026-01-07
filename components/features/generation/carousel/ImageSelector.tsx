import React, { useState } from 'react';
import { Search, Image as ImageIcon, Link, X, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Curated list of high-quality Unsplash images for business/tech context
// Using source-wrapped URLs for reliable sizing and optimization
const CURATED_IMAGES = [
  // OFFICE & TEAM
  { id: '1', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', tags: 'team office meeting collaboration people' },
  { id: '2', url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80', tags: 'office modern workspace desk computer' },
  { id: '3', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80', tags: 'analytics diverse business meeting strategy' },
  { id: '4', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80', tags: 'work startup team discussion successful' },
  
  // TECH & ABSTRACT
  { id: '5', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', tags: 'tech chip circuit board hardware blue' },
  { id: '6', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', tags: 'network connection data digital global' },
  { id: '7', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', tags: 'cyber security protection lock code' },
  { id: '8', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80', tags: 'ai artificial intelligence brain gradient' },

  // MINIMAL & BACKGROUNDS
  { id: '9', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80', tags: 'minimal landscape mountain calm blue' },
  { id: '10', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', tags: 'beach sea water nature summer' },
  { id: '11', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80', tags: 'gradient abstract modern background' },
  { id: '12', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', tags: 'building city architecture skyscraper urban' },
  
  // LIFESTYLE & FOCUS
  { id: '13', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80', tags: 'focus study writing notebook planning' },
  { id: '14', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', tags: 'lifestyle work cafe laptop remote' },
  { id: '15', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', tags: 'group team computer startup work' },
];

interface ImageSelectorProps {
  onSelect: (imageUrl: string) => void;
  trigger?: React.ReactNode;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ onSelect, trigger }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);

  // Local filtering logic simulating an API search
  const filteredImages = CURATED_IMAGES.filter(img => 
    searchQuery === '' || img.tags.includes(searchQuery.toLowerCase())
  );

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  const handleCustomUrl = () => {
    if (customUrl) {
      handleSelect(customUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="w-full">
            <ImageIcon className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-100 bg-white">
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="gallery" className="flex-1 flex flex-col overflow-hidden">
           <div className="px-4 pt-2">
             <TabsList className="w-full justify-start border-b border-slate-100 rounded-none bg-transparent h-auto p-0 space-x-6">
                <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent px-2 py-3">
                   Gallery
                </TabsTrigger>
                <TabsTrigger value="url" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent px-2 py-3">
                   Direct Link
                </TabsTrigger>
             </TabsList>
           </div>
           
           <TabsContent value="gallery" className="flex-1 flex flex-col overflow-hidden m-0">
             <div className="p-4 border-b border-slate-100 bg-slate-50">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input 
                    placeholder="Search curated photos (e.g. 'office', 'tech', 'minimal')" 
                    className="pl-9 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
             </div>

             <ScrollArea className="flex-1 bg-slate-50/50">
               <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {filteredImages.map((img) => (
                   <button
                     key={img.id}
                     onClick={() => handleSelect(img.url)}
                     className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 hover:ring-2 ring-brand-500 transition-all"
                   >
                     <img 
                       src={img.url} 
                       alt={img.tags} 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                     />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </button>
                 ))}
                 
                 {filteredImages.length === 0 && (
                   <div className="col-span-full py-12 text-center text-slate-400">
                     <p>No images found for "{searchQuery}"</p>
                     <p className="text-sm">Try generic tags like "business", "tech", or "background"</p>
                   </div>
                 )}
               </div>
             </ScrollArea>
           </TabsContent>

           <TabsContent value="url" className="m-0 p-8 flex flex-col items-center justify-center flex-1">
              <div className="w-full max-w-md space-y-4 text-center">
                 <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Link className="w-6 h-6" />
                 </div>
                 <h3 className="font-semibold text-slate-800">Paste Image URL</h3>
                 <p className="text-sm text-slate-500">
                   Enter a direct link to a transparent PNG or high-quality JPG.
                 </p>
                 <div className="flex gap-2">
                    <Input 
                      placeholder="https://example.com/image.png" 
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                    />
                    <Button onClick={handleCustomUrl} disabled={!customUrl}>
                      Use
                    </Button>
                 </div>
                 <p className="text-xs text-slate-400">
                   Tip: We recommend 1080x1350px for portraits.
                 </p>
              </div>
           </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
