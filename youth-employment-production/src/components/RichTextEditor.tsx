// /**
//  * RichTextEditor — lightweight Lexical-based editor for job descriptions.
//  * Supports bold, italic, unordered lists, and ordered lists.
//  * Calls onChange with the current plain-text content for the live preview,
//  * and onHtmlChange with serialised HTML for form submission.
//  */
// import { useCallback } from 'react';
// import { LexicalComposer } from '@lexical/react/LexicalComposer';
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
// import { ContentEditable } from '@lexical/react/LexicalContentEditable';
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
// import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
// import { ListPlugin } from '@lexical/react/LexicalListPlugin';
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
// import {
//   $getRoot,
//   FORMAT_TEXT_COMMAND,
//   type EditorState,
// } from 'lexical';
// import {
//   INSERT_UNORDERED_LIST_COMMAND,
//   INSERT_ORDERED_LIST_COMMAND,
//   ListNode,
//   ListItemNode,
// } from '@lexical/list';
// import { $generateHtmlFromNodes } from '@lexical/html';
// import { Bold, Italic, List, ListOrdered } from 'lucide-react';
// import { cn } from '@/lib/utils';

// /* ── Toolbar ──────────────────────────────────────────────────────────── */
// function ToolbarPlugin() {
//   const [editor] = useLexicalComposerContext();

//   const format = useCallback(
//     (fmt: 'bold' | 'italic') => {
//       editor.dispatchCommand(FORMAT_TEXT_COMMAND, fmt);
//     },
//     [editor]
//   );

//   const insertList = useCallback(
//     (type: 'bullet' | 'number') => {
//       if (type === 'bullet') {
//         editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
//       } else {
//         editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
//       }
//     },
//     [editor]
//   );

//   const btn =
//     'p-1.5 rounded hover:bg-[#2563EB]/10 text-[#475569] hover:text-[#2563EB] transition-colors duration-150';

//   return (
//     <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#C8782A]/15 bg-[#FAF5EE]/60">
//       <button type="button" className={btn} onClick={() => format('bold')} title="Bold">
//         <Bold size={14} />
//       </button>
//       <button type="button" className={btn} onClick={() => format('italic')} title="Italic">
//         <Italic size={14} />
//       </button>
//       <div className="w-px h-4 bg-[#C8782A]/20 mx-1" />
//       <button type="button" className={btn} onClick={() => insertList('bullet')} title="Bullet list">
//         <List size={14} />
//       </button>
//       <button type="button" className={btn} onClick={() => insertList('number')} title="Numbered list">
//         <ListOrdered size={14} />
//       </button>
//     </div>
//   );
// }

// /* ── Change handler ───────────────────────────────────────────────────── */
// interface ChangeHandlerProps {
//   onChange: (text: string) => void;
//   onHtmlChange: (html: string) => void;
// }

// function ChangeHandler({ onChange, onHtmlChange }: ChangeHandlerProps) {
//   const [editor] = useLexicalComposerContext();

//   const handleChange = useCallback(
//     (state: EditorState) => {
//       state.read(() => {
//         const text = $getRoot().getTextContent();
//         onChange(text);
//       });
//       editor.update(() => {
//         const html = $generateHtmlFromNodes(editor, null);
//         onHtmlChange(html);
//       });
//     },
//     [editor, onChange, onHtmlChange]
//   );

//   return <OnChangePlugin onChange={handleChange} />;
// }

// /* ── Placeholder ──────────────────────────────────────────────────────── */
// function Placeholder({ text }: { text: string }) {
//   return (
//     <div className="absolute top-3 left-3 text-sm text-[#1C1C1C]/35 pointer-events-none select-none">
//       {text}
//     </div>
//   );
// }

// /* ── Main export ──────────────────────────────────────────────────────── */
// interface RichTextEditorProps {
//   placeholder?: string;
//   onChange?: (text: string) => void;
//   onHtmlChange?: (html: string) => void;
//   minHeight?: number;
//   className?: string;
// }

// export default function RichTextEditor({
//   placeholder = 'Start typing…',
//   onChange,
//   onHtmlChange,
//   minHeight = 160,
//   className,
// }: RichTextEditorProps) {
//   const initialConfig = {
//     namespace: 'JobDescriptionEditor',
//     nodes: [ListNode, ListItemNode],
//     onError: (err: Error) => console.error('Lexical error:', err),
//     theme: {
//       text: {
//         bold: 'font-bold',
//         italic: 'italic',
//       },
//       list: {
//         ul: 'list-disc list-inside ml-2 my-1',
//         ol: 'list-decimal list-inside ml-2 my-1',
//         listitem: 'my-0.5',
//       },
//     },
//   };

//   return (
//     <LexicalComposer initialConfig={initialConfig}>
//       <div
//         className={cn(
//           'rounded-md border border-[#2563EB]/20 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2563EB]/30 transition-shadow',
//           className
//         )}
//       >
//         <ToolbarPlugin />
//         <div className="relative">
//           <RichTextPlugin
//             contentEditable={
//               <ContentEditable
//                 className="outline-none px-3 py-3 text-sm text-[#1C1C1C] leading-relaxed"
//                 style={{ minHeight }}
//                 aria-label={placeholder}
//               />
//             }
//             placeholder={<Placeholder text={placeholder} />}
//             ErrorBoundary={LexicalErrorBoundary}
//           />
//         </div>
//         <HistoryPlugin />
//         <ListPlugin />
//         <ChangeHandler
//           onChange={onChange ?? (() => {})}
//           onHtmlChange={onHtmlChange ?? (() => {})}
//         />
//       </div>
//     </LexicalComposer>
//   );
// }

/**
 * RichTextEditor — lightweight Lexical-based editor for job descriptions.
 * Supports bold, italic, unordered lists, and ordered lists.
 * Now supports initialHtml for edit mode.
 */
import { useCallback, useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  FORMAT_TEXT_COMMAND,
  type EditorState,
} from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  ListNode,
  ListItemNode,
} from '@lexical/list';
import { $generateHtmlFromNodes } from '@lexical/html';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Toolbar ──────────────────────────────────────────────────────────── */
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const format = useCallback(
    (fmt: 'bold' | 'italic') => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, fmt);
    },
    [editor]
  );

  const insertList = useCallback(
    (type: 'bullet' | 'number') => {
      if (type === 'bullet') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    },
    [editor]
  );

  const btn =
    'p-1.5 rounded hover:bg-blue-600/10 text-gray-500 hover:text-blue-600 transition-colors duration-150';

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-blue-200 bg-blue-50/30">
      <button type="button" className={btn} onClick={() => format('bold')} title="Bold">
        <Bold size={14} />
      </button>
      <button type="button" className={btn} onClick={() => format('italic')} title="Italic">
        <Italic size={14} />
      </button>
      <div className="w-px h-4 bg-blue-200 mx-1" />
      <button type="button" className={btn} onClick={() => insertList('bullet')} title="Bullet list">
        <List size={14} />
      </button>
      <button type="button" className={btn} onClick={() => insertList('number')} title="Numbered list">
        <ListOrdered size={14} />
      </button>
    </div>
  );
}

/* ── Initial Value Setter (Sets HTML content when editor loads) ──────── */
interface InitialValueSetterProps {
  initialHtml?: string;
  onContentLoaded?: () => void;
}

function InitialValueSetter({ initialHtml, onContentLoaded }: InitialValueSetterProps) {
  const [editor] = useLexicalComposerContext();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (initialHtml && !hasLoaded && editor) {
      // Simple: Set text content (strip HTML tags)
      const textContent = initialHtml.replace(/<[^>]*>/g, '');
      
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(textContent));
        root.append(paragraph);
      });
      
      setHasLoaded(true);
      onContentLoaded?.();
    }
  }, [initialHtml, editor, hasLoaded, onContentLoaded]);

  return null;
}

/* ── Change handler ───────────────────────────────────────────────────── */
interface ChangeHandlerProps {
  onChange: (text: string) => void;
  onHtmlChange: (html: string) => void;
}

function ChangeHandler({ onChange, onHtmlChange }: ChangeHandlerProps) {
  const [editor] = useLexicalComposerContext();

  const handleChange = useCallback(
    (state: EditorState) => {
      state.read(() => {
        const text = $getRoot().getTextContent();
        onChange(text);
      });
      editor.update(() => {
        const html = $generateHtmlFromNodes(editor, null);
        onHtmlChange(html);
      });
    },
    [editor, onChange, onHtmlChange]
  );

  return <OnChangePlugin onChange={handleChange} />;
}

/* ── Placeholder ──────────────────────────────────────────────────────── */
function Placeholder({ text }: { text: string }) {
  return (
    <div className="absolute top-3 left-3 text-sm text-gray-400 pointer-events-none select-none">
      {text}
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────────────────── */
interface RichTextEditorProps {
  placeholder?: string;
  value?: string;           // Initial HTML content for edit mode
  onChange?: (text: string) => void;
  onHtmlChange?: (html: string) => void;
  minHeight?: number;
  className?: string;
}

export default function RichTextEditor({
  placeholder = 'Start typing…',
  value = '',
  onChange,
  onHtmlChange,
  minHeight = 160,
  className,
}: RichTextEditorProps) {
  // const [ setIsValueLoaded] = useState(false);

  const initialConfig = {
    namespace: 'JobDescriptionEditor',
    nodes: [ListNode, ListItemNode],
    onError: (err: Error) => console.error('Lexical error:', err),
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
      },
      list: {
        ul: 'list-disc list-inside ml-2 my-1',
        ol: 'list-decimal list-inside ml-2 my-1',
        listitem: 'my-0.5',
      },
    },
  };

  const handleValueLoaded = () => {
    ///
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={cn(
          'rounded-md border border-blue-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-300 transition-shadow',
          className
        )}
      >
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none px-3 py-3 text-sm text-gray-900 leading-relaxed"
                style={{ minHeight }}
                aria-label={placeholder}
              />
            }
            placeholder={<Placeholder text={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <InitialValueSetter 
          initialHtml={value} 
          onContentLoaded={handleValueLoaded}
        />
        <ChangeHandler
          onChange={onChange ?? (() => {})}
          onHtmlChange={onHtmlChange ?? (() => {})}
        />
      </div>
    </LexicalComposer>
  );
}