import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Table({ headers, children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={twMerge("min-w-full divide-y divide-gray-200", className)}>
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr 
      className={twMerge("hover:bg-gray-50", className)}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={twMerge("px-6 py-4 whitespace-nowrap text-sm text-gray-500", className)}>
      {children}
    </td>
  );
}

export function TableActions({ children }: { children: ReactNode }) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
      {children}
    </td>
  );
}
