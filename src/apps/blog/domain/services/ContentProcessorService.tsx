
import React from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExternalLink } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table.tsx";
import { MarkdownService } from "@/apps/blog/domain/services/MarkdownService.ts";

/**
 * Service responsible for processing blog data and converting it to React components
 */
export class ContentProcessorService {
  private markdownService: MarkdownService;

  constructor() {
    this.markdownService = new MarkdownService();
  }

  /**
   * Main public method to process blog post data from markdown to React components
   */
  public processContent(content: string): React.ReactNode[] {
    if (!content) return [];
    
    // Convert markdown to HTML
    const htmlContent = this.markdownService.parseMarkdownToHtml(content);
    
    // Parse HTML to React components
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const elements: React.ReactNode[] = [];

    // Process all top-level nodes
    doc.body.childNodes.forEach((node, index) => {
      const processedNode = this.processNode(node, index);
      if (processedNode) {
        elements.push(processedNode);
      }
    });

    return elements;
  }

  /**
   * Process an individual DOM node into a React component
   */
  private processNode(node: Node, index: number): React.ReactNode {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // Delegate to specialized processors based on element type
      if (element.tagName === 'PRE' && element.querySelector('code')) {
        return this.processCodeBlock(element, index);
      }

      if (element.tagName === 'TABLE') {
        return this.processTable(element, index);
      }

      if (element.tagName === 'UL') {
        return this.processList(element, index);
      }

      if (element.tagName === 'A') {
        return this.processLink(element, index);
      }

      // Handle other HTML elements
      return this.processStandardElement(element, index);
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    return null;
  }

  /**
   * Process code blocks with syntax highlighting
   */
  private processCodeBlock(element: Element, index: number): React.ReactNode {
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

  /**
   * Process tables into shadcn UI table components
   */
  private processTable(element: Element, index: number): React.ReactNode {
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

  /**
   * Process lists (unordered lists)
   */
  private processList(element: Element, index: number): React.ReactNode {
    // Check if this list is nested by seeing if its parent is an LI or UL
    const isNestedList =
        element.parentElement?.tagName === 'LI' ||
        element.parentElement?.tagName === 'UL';

    const listItems: React.ReactNode[] = [];

    // Process only direct child <li> elements
    Array.from(element.children).forEach((child, liIndex) => {
      if (child.tagName === 'LI') {
        const childNodes: React.ReactNode[] = [];
        child.childNodes.forEach((node, childIndex) => {
          const processedChild = this.processNode(node, childIndex);
          if (processedChild) {
            childNodes.push(processedChild);
          }
        });

        listItems.push(
            <li key={liIndex} className="text-left">
              {childNodes.length > 0 ? childNodes : child.textContent}
            </li>
        );
      }
    });

    // If nested, remove the top/bottom margin. If top-level, keep your usual spacing.
    const ulClassName = isNestedList
        ? "list-disc pl-5 text-left"  // no my-4
        : "list-disc pl-5 my-4 text-left";

    return (
        <ul key={index} className={ulClassName}>
          {listItems}
        </ul>
    );
  }


  /**
   * Process links with special handling for external links
   */
  private processLink(element: Element, index: number): React.ReactNode {
    const href = element.getAttribute('href') || '';
    const target = element.getAttribute('target') || '';
    const childNodes = Array.from(element.childNodes);
    
    const children: React.ReactNode[] = [];
    childNodes.forEach((child, childIndex) => {
      const processedChild = this.processNode(child, childIndex);
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

  /**
   * Process standard HTML elements like headings and paragraphs
   */
  private processStandardElement(element: Element, index: number): React.ReactNode {
    // Process child elements
    const children: React.ReactNode[] = [];
    element.childNodes.forEach((child, childIndex) => {
      const processedChild = this.processNode(child, childIndex);
      if (processedChild) {
        children.push(processedChild);
      }
    });

    // Return appropriate React element based on tag name
    switch (element.tagName) {
      case 'H2':
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-left">{children}</h2>;
      case 'H3':
        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-left">{children}</h3>;
      case 'H4':
        return <h4 key={index} className="text-lg font-medium mt-4 mb-2 text-left">{children}</h4>;
      case 'P':
        return <p key={index} className="mb-4 text-left" >{children}</p>;
      case 'STRONG':
        return <strong key={index}>{children}</strong>;
      case 'EM':
        return <em key={index} className="italic">{children}</em>;
      case 'BLOCKQUOTE': // ✅ Handle blockquotes explicitly
        return (
          <blockquote key={index} className="border-l-4 border-gray-500 pl-4 italic text-gray-600">
            {children}
          </blockquote>
        );
      default:
        return children;
    }
  }
}