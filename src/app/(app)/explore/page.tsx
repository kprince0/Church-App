import { AIQueryClient } from '@/components/app/ai-query-client';

export default function ExplorePage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <AIQueryClient />
      </div>
    </main>
  );
}
