import { Search } from 'lucide-react';

export default function SearchFAQ({ searchTerm, onSearch }) {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <input
        type="text"
        placeholder="ابحث في الأسئلة الشائعة..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
}