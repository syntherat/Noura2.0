import { useState } from 'react';

export default function SyllabusInput({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Or enter syllabus content directly
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field min-h-[200px]"
        placeholder="Paste your syllabus content here..."
      />
    </div>
  );
}