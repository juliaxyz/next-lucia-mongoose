import React from 'react';
import { Loader2 } from 'lucide-react';

export default function loading() {
  return (
    <div className='flex items-center justify-center min-h-screen max-w-xl mx-auto animated-spin'>
      <Loader2 className='w-16 h-16 mx-auto text-emerald-500' />
    </div>
  );
}
