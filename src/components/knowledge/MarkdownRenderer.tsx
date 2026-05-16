'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text: string): string {
  let result = escapeHtml(text);
  // Code (must be before bold/italic to avoid conflicts)
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Italic
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  result = result.replace(/_([^_]+)_/g, '<em>$1</em>');
  return result;
}

function parseMarkdown(content: string): string {
  const lines = content.split('\n');
  const output: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        output.push(
          `<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        if (inList) {
          output.push('</ul>');
          inList = false;
        }
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Close list if needed
    if (inList && !line.startsWith('- ') && !line.startsWith('* ')) {
      output.push('</ul>');
      inList = false;
    }

    // Headings
    const h1 = line.match(/^# (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);

    if (h1) {
      output.push(`<h1>${renderInline(h1[1])}</h1>`);
    } else if (h2) {
      output.push(`<h2>${renderInline(h2[1])}</h2>`);
    } else if (h3) {
      output.push(`<h3>${renderInline(h3[1])}</h3>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        output.push('<ul>');
        inList = true;
      }
      output.push(`<li>${renderInline(line.slice(2))}</li>`);
    } else if (line.trim() === '') {
      output.push('<br/>');
    } else {
      output.push(`<p>${renderInline(line)}</p>`);
    }
  }

  if (inList) output.push('</ul>');
  if (inCodeBlock && codeLines.length > 0) {
    output.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  }

  return output.join('');
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = parseMarkdown(content);

  return (
    <div
      className="markdown-content text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-jetbrains), monospace',
      }}
    />
  );
}
