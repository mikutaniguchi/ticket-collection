import { useState } from 'react';
import { renderMarkdown } from '../../utils/markdown';
import './SimpleMarkdownEditor.css';

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleMarkdownEditor({
  value,
  onChange,
  placeholder = 'メモを入力...',
}: SimpleMarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="markdown-editor">
      <div className="markdown-editor-toolbar">
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={`toolbar-button ${!isPreview ? 'active' : ''}`}
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={`toolbar-button ${isPreview ? 'active' : ''}`}
        >
          プレビュー
        </button>
      </div>

      {isPreview ? (
        <div
          className="markdown-preview"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(value),
          }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const textarea = e.target as HTMLTextAreaElement;
              const { selectionStart, value } = textarea;
              const lines = value.substring(0, selectionStart).split('\n');
              const currentLine = lines[lines.length - 1];

              if (currentLine.match(/^- .+/)) {
                e.preventDefault();
                const newValue =
                  value.substring(0, selectionStart) +
                  '\n- ' +
                  value.substring(selectionStart);
                onChange(newValue);
                setTimeout(() => {
                  textarea.setSelectionRange(
                    selectionStart + 3,
                    selectionStart + 3
                  );
                }, 0);
              }
            }
          }}
          placeholder={placeholder}
          className="markdown-textarea"
        />
      )}
    </div>
  );
}
