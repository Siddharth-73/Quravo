'use client';

import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';

export default function SuperAdminCMSPage() {
  const [pages] = useState([
    { id: '1', title: 'Landing Page Hero Content', type: 'Landing Page', status: 'Published' },
    { id: '2', title: 'Platform FAQ & Knowledge Base', type: 'FAQs', status: 'Published' },
    { id: '3', title: 'HIPAA & Compliance Documentation', type: 'Documentation', status: 'Published' },
    { id: '4', title: 'Release Notes v2.4 (Summer Update)', type: 'Release Notes', status: 'Published' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CMS Content Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage public landing pages, FAQs, documentation, help center articles, blog posts, and release notes.
          </p>
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow">
          + Create CMS Page
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 border-b border-slate-800 uppercase font-semibold text-slate-400">
            <tr>
              <th className="p-3.5">Content Title</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-slate-900/40">
                <td className="p-3.5 font-bold text-white">{p.title}</td>
                <td className="p-3.5 text-purple-400 font-medium">{p.type}</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                    {p.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded">
                    Edit Content
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
