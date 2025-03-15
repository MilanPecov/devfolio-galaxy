
import React from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExternalLink } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseMarkdownToHtml } from '@/services/blog';

/**
 * Process blog post content from markdown to React components
 * including proper syntax highlighting for code blocks
 */
export const createBlogPostContent = (content: string): React.ReactNode[] => {
  if (!content) return [];
  
  // Convert markdown to HTML
  const htmlContent = parseMarkdownToHtml(content);
  
  // Parse HTML to React components
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const elements: React.ReactNode[] = [];

  const processNode = (node: Node, index: number): React.ReactNode => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // Handle code blocks
      if (element.tagName === 'PRE' && element.querySelector('code')) {
        const codeElement = element.querySelector('code');
        // Extract language from class (language-xxx)
        const languageMatch = codeElement?.className.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : '';
        const code = codeElement?.textContent || '';

        return (
          <SyntaxHighlighter
            key={index}
            language={language}
            style={vscDarkPlus}
            className="rounded-lg !p-4 my-4 w-full"
            customStyle={{
              backgroundColor: "#1e2130",
              width: "100%"
            }}
            showLineNumbers={false}
            wrapLines={true}
            wrapLongLines={false}
          >
            {code.trim()}
          </SyntaxHighlighter>
        );
      }

      // Handle tables
      if (element.tagName === 'TABLE') {
        const tableHeaders: React.ReactNode[] = [];
        const tableRows: React.ReactNode[] = [];

        // Process headers
        const headerRow = element.querySelector('thead tr');
        if (headerRow) {
          headerRow.querySelectorAll('th').forEach((th, thIndex) => {
            tableHeaders.push(
              <TableHead key={thIndex}>{th.textContent}</TableHead>
            );
          });
        }

        // Process rows
        element.querySelectorAll('tbody tr').forEach((tr, trIndex) => {
          const cells: React.ReactNode[] = [];
          tr.querySelectorAll('td').forEach((td, tdIndex) => {
            cells.push(
              <TableCell key={tdIndex}>{td.textContent}</TableCell>
            );
          });
          tableRows.push(<TableRow key={trIndex}>{cells}</TableRow>);
        });

        return (
          <div key={index} className="my-4 w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>{tableHeaders}</TableRow>
              </TableHeader>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </div>
        );
      }

      // Handle links
      if (element.tagName === 'A') {
        const href = element.getAttribute('href') || '';
        const target = element.getAttribute('target') || '';
        const childNodes = Array.from(element.childNodes);
        
        const children: React.ReactNode[] = [];
        childNodes.forEach((child, childIndex) => {
          const processedChild = processNode(child, childIndex);
          if (processedChild) {
            children.push(processedChild);
          }
        });

        // Only add the external link icon if it's an external link and doesn't already have an icon
        const isExternal = href.startsWith('http');
        const hasIcon = element.innerHTML.includes('lucide-') || element.innerHTML.includes('inline-icon');

        return (
          <a
            key={index}
            href={href}
            target={target || (isExternal ? '_blank' : '')}
            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {children.length > 0 ? children : element.textContent}
            {isExternal && !hasIcon && <ExternalLink className="ml-1 h-4 w-4" />}
          </a>
        );
      }

      // Handle lists
      if (element.tagName === 'UL') {
        const listItems: React.ReactNode[] = [];
        element.querySelectorAll('li').forEach((li, liIndex) => {
          // Process child nodes of list items to handle links and other elements
          const childNodes: React.ReactNode[] = [];
          li.childNodes.forEach((child, childIndex) => {
            const processedChild = processNode(child, childIndex);
            if (processedChild) {
              childNodes.push(processedChild);
            }
          });
          
          listItems.push(<li key={liIndex} className="text-left">{childNodes.length > 0 ? childNodes : li.textContent}</li>);
        });
        return <ul key={index} className="list-disc pl-5 my-4 text-left">{listItems}</ul>;
      }

      // Handle other HTML elements
      const children: React.ReactNode[] = [];
      element.childNodes.forEach((child, childIndex) => {
        const processedChild = processNode(child, childIndex);
        if (processedChild) {
          children.push(processedChild);
        }
      });

      if (element.tagName === 'H2') {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-left">{children}</h2>;
      }

      if (element.tagName === 'H3') {
        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-left">{children}</h3>;
      }

      if (element.tagName === 'H4') {
        return <h4 key={index} className="text-lg font-medium mt-4 mb-2 text-left">{children}</h4>;
      }

      if (element.tagName === 'P') {
        return <p key={index} className="mb-4 text-left">{children}</p>;
      }

      if (element.tagName === 'STRONG') {
        return <strong key={index}>{children}</strong>;
      }

      return children;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    return null;
  };

  doc.body.childNodes.forEach((node, index) => {
    const processedNode = processNode(node, index);
    if (processedNode) {
      elements.push(processedNode);
    }
  });

  return elements;
};
