import React from 'react';
import { TrendItem } from '../types';
import { Icons } from './Icon';

interface TrendCardProps {
  item: TrendItem;
}

const TrendCard: React.FC<TrendCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 leading-tight">
          {item.title}
        </h3>
        <div className="p-2 bg-indigo-50 rounded-full shrink-0 ml-2">
          <Icons.Flash className="w-4 h-4 text-indigo-600" />
        </div>
      </div>
      
      <div className="space-y-4 flex-grow">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Summary</span>
          <p className="text-sm text-slate-600 leading-relaxed">{item.summary}</p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1 block">Impact</span>
          <p className="text-sm text-slate-700">{item.impact}</p>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1 block">Key Takeaway</span>
          <p className="text-sm font-medium text-slate-800 italic">"{item.takeaway}"</p>
        </div>
      </div>

      {item.sources.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <Icons.Link className="w-3 h-3" />
            Sources
          </span>
          <div className="flex flex-col gap-1.5">
            {item.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline truncate flex items-center gap-1"
                title={source.title}
              >
                • {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendCard;
