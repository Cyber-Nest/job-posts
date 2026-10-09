import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type ReactQuillType from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as unknown as React.ComponentType<
  ReactQuillType['props'] & { ref?: React.Ref<ReactQuillType> }
>;

interface RichTextEditorProps {
  placeholder?: string;
  value?: string;  
  onChange?: (text: string) => void;
  onHtmlChange?: (html: string) => void;
  minHeight?: number;
  maxLength?: number;
  required?: boolean;
}

const SIMPLE_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

const FULL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'link',
];

export default function RichTextEditor({
  placeholder,
  value: externalValue,  
  onChange,
  onHtmlChange,
  minHeight = 180,
  maxLength = 1000,
  required = false
}: RichTextEditorProps) {
  const [value, setValue] = useState(externalValue || '');
  const [charCount, setCharCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const quillRef = useRef<ReactQuillType>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue);
      const plainText = stripHtml(externalValue);
      setCharCount(plainText.length);
    }
  }, [externalValue]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stripHtml = (html: string) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleChange = (content: string) => {
    const plainText = stripHtml(content);
    const currentLength = plainText.length;

    if (maxLength && currentLength > maxLength) {
      setIsLimitReached(true);
      return;
    }

    setIsLimitReached(false);
    setCharCount(currentLength);
    setValue(content);
    onChange?.(plainText);
    onHtmlChange?.(content);
  };

  const getEditorHeight = () => {
    if (isMobile) {
      return Math.min(minHeight, 150);
    }
    return minHeight;
  };

  const getModules = () => {
    return isMobile ? SIMPLE_MODULES : FULL_MODULES;
  };

  // Calculate initial character count
  useEffect(() => {
    if (isFirstRender.current && value) {
      const plainText = stripHtml(value);
      setCharCount(plainText.length);
      isFirstRender.current = false;
    }
  }, [value]);

  return (
    <div className="w-full">
      <style jsx global>{`
        .custom-quill-editor .ql-container {
          font-size: 14px;
          border-radius: 0 0 12px 12px !important;
        }
        
        .custom-quill-editor .ql-editor {
          padding: 12px 16px !important;
          min-height: 120px !important;
          line-height: 1.5 !important;
        }
        
        @media (max-width: 640px) {
          .custom-quill-editor .ql-toolbar {
            padding: 8px !important;
            border-radius: 12px 12px 0 0 !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 4px !important;
          }
          
          .custom-quill-editor .ql-toolbar .ql-formats {
            margin-right: 4px !important;
            display: inline-flex !important;
          }
          
          .custom-quill-editor .ql-toolbar button {
            width: 32px !important;
            height: 32px !important;
            padding: 4px !important;
          }
          
          .custom-quill-editor .ql-toolbar button svg {
            width: 18px !important;
            height: 18px !important;
          }
          
          .custom-quill-editor .ql-picker {
            font-size: 12px !important;
          }
          
          .custom-quill-editor .ql-picker-label {
            padding: 4px 8px !important;
          }
          
          .custom-quill-editor .ql-editor {
            font-size: 15px !important;
            padding: 10px 12px !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .custom-quill-editor .ql-toolbar button {
            width: 34px !important;
            height: 34px !important;
          }
          
          .custom-quill-editor .ql-editor {
            font-size: 15px !important;
          }
        }
        
        @media (min-width: 1025px) {
          .custom-quill-editor .ql-editor {
            font-size: 16px !important;
          }
        }
        
        .char-counter {
          transition: all 0.2s ease;
        }
        
        .required-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        
        .custom-quill-editor .ql-container:focus-within {
          box-shadow: 0 0 0 2px rgba(200, 120, 42, 0.2);
        }
      `}</style>

      <div className="custom-quill-editor w-full">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          modules={getModules()}
          formats={formats}
          style={{ height: getEditorHeight() }}
          onKeyPress={(e: any) => {
            if (isLimitReached && e.key !== 'Backspace' && e.key !== 'Delete') {
              e.preventDefault();
            }
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3 px-1">
        <div className="text-xs text-[#6B3A2A]/50">
          {required && !value && (
            <span className="required-indicator text-red-500">
              <svg className="w-3 h-3 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Required field
            </span>
          )}
          {/* {!required && (
            <span className="text-[#6B3A2A]/40">
              {isMobile ? '💡' : 'Tip:'} Use formatting tools to style your text
            </span>
          )} */}
        </div>

        <div className={`char-counter text-xs px-2 py-1 mr-2 rounded-full ${isLimitReached
            ? 'bg-red-50 text-red-600 font-semibold'
            : charCount > maxLength * 0.9
              ? 'bg-yellow-50 text-yellow-700'
              : 'bg-gray-50 text-[#6B3A2A]/60'
          }`}>
          <span className="inline-flex items-center gap-1.5">
            <span className="hidden xs:inline">📄</span>
            <span className="font-mono">
              {charCount.toLocaleString()} / {maxLength.toLocaleString()}
            </span>
            <span className="hidden xs:inline">characters</span>
          </span>
        </div>
      </div>

      {!isLimitReached && charCount > maxLength * 0.9 && (
        <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1.5 bg-yellow-50 p-2 rounded-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
          Approaching character limit ({maxLength - charCount} characters remaining)
        </p>
      )}

      {isLimitReached && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          Maximum character limit of {maxLength.toLocaleString()} reached. Please shorten your text.
        </p>
      )}
    </div>
  );
}