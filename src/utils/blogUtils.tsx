
import React from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Process blog post content from HTML string to React components
 * including proper syntax highlighting for code blocks
 */
export const createBlogPostContent = (content: string): React.ReactNode[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const elements: React.ReactNode[] = [];

  const processNode = (node: Node, index: number): React.ReactNode => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // Handle code blocks
      if (element.tagName === 'PRE' && element.querySelector('code')) {
        const codeElement = element.querySelector('code');
        const language = codeElement?.className.replace('language-', '') || '';
        const code = codeElement?.textContent || '';

        return (
          <SyntaxHighlighter
            key={index}
            language={language}
            style={oneDark}
            className="rounded-lg !bg-[#1E293B] !p-4 my-4 w-full"
            customStyle={{
              backgroundColor: "#1E293B",
              width: "100%"
            }}
            codeTagProps={{
              style: {
                backgroundColor: "#1E293B",
                color: "white"
              }
            }}
          >
            {code.trim()}
          </SyntaxHighlighter>
        );
      }

      // Handle lists
      if (element.tagName === 'UL') {
        const listItems: React.ReactNode[] = [];
        element.querySelectorAll('li').forEach((li, liIndex) => {
          listItems.push(<li key={liIndex} className="text-left">{li.textContent}</li>);
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
