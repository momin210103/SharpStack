import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import '../../styles/tiptap-custom.css';

const lowlight = createLowlight(common);

const LANGUAGES = [
  ['csharp', 'C#'],
  ['javascript', 'JavaScript'],
  ['typescript', 'TypeScript'],
  ['sql', 'SQL'],
  ['json', 'JSON'],
  ['bash', 'Bash'],
  ['xml', 'HTML/XML'],
  ['css', 'CSS'],
  ['python', 'Python'],
  ['plaintext', 'Plain text'],
];

// NOTE: Tiptap v3 StarterKit-এ Link ও Underline আগে থেকেই আছে।
// (v2 ব্যবহার করলে @tiptap/extension-link ও @tiptap/extension-underline আলাদা যোগ করতে হবে)

function Toolbar({ editor }) {
  if (!editor) return null;

  const addLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (https://...)', prev || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const Btn = ({ label, title, onClick, active, disabled }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`tt-btn ${active ? 'is-active' : ''}`}
    >
      {label}
    </button>
  );

  const chain = () => editor.chain().focus();

  return (
    <div className="tt-toolbar">
      <Btn label="↶" title="Undo" onClick={() => chain().undo().run()} disabled={!editor.can().undo()} />
      <Btn label="↷" title="Redo" onClick={() => chain().redo().run()} disabled={!editor.can().redo()} />
      <span className="tt-sep" />

      <select
        className="tt-select"
        title="Text style"
        value={
          [1, 2, 3, 4].find((l) => editor.isActive('heading', { level: l })) || 'p'
        }
        onChange={(e) => {
          const v = e.target.value;
          if (v === 'p') chain().setParagraph().run();
          else chain().toggleHeading({ level: Number(v) }).run();
        }}
      >
        <option value="p">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
      </select>
      <span className="tt-sep" />

      <Btn label={<b>B</b>} title="Bold" onClick={() => chain().toggleBold().run()} active={editor.isActive('bold')} />
      <Btn label={<i>I</i>} title="Italic" onClick={() => chain().toggleItalic().run()} active={editor.isActive('italic')} />
      <Btn label={<u>U</u>} title="Underline" onClick={() => chain().toggleUnderline().run()} active={editor.isActive('underline')} />
      <Btn label={<s>S</s>} title="Strikethrough" onClick={() => chain().toggleStrike().run()} active={editor.isActive('strike')} />
      <span className="tt-sep" />

      <label className="tt-color" title="Text color">
        A
        <input
          type="color"
          value={editor.getAttributes('textStyle').color || '#ffffff'}
          onChange={(e) => chain().setColor(e.target.value).run()}
        />
      </label>
      <Btn label="▮" title="Highlight" onClick={() => chain().toggleHighlight().run()} active={editor.isActive('highlight')} />
      <Btn label="x₂" title="Subscript" onClick={() => chain().toggleSubscript().run()} active={editor.isActive('subscript')} />
      <Btn label="x²" title="Superscript" onClick={() => chain().toggleSuperscript().run()} active={editor.isActive('superscript')} />
      <span className="tt-sep" />

      <Btn label="1." title="Numbered list" onClick={() => chain().toggleOrderedList().run()} active={editor.isActive('orderedList')} />
      <Btn label="•" title="Bullet list" onClick={() => chain().toggleBulletList().run()} active={editor.isActive('bulletList')} />
      <Btn label="⇤" title="Outdent" onClick={() => chain().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} />
      <Btn label="⇥" title="Indent" onClick={() => chain().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} />
      <span className="tt-sep" />

      <Btn label="≡←" title="Align left" onClick={() => chain().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} />
      <Btn label="≡" title="Align center" onClick={() => chain().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} />
      <Btn label="≡→" title="Align right" onClick={() => chain().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} />
      <span className="tt-sep" />

      <Btn label="❝" title="Quote" onClick={() => chain().toggleBlockquote().run()} active={editor.isActive('blockquote')} />
      <Btn label="</>" title="Code block" onClick={() => chain().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} />
      {editor.isActive('codeBlock') && (
        <select
          className="tt-select"
          title="Code language"
          value={editor.getAttributes('codeBlock').language || 'plaintext'}
          onChange={(e) => chain().updateAttributes('codeBlock', { language: e.target.value }).run()}
        >
          {LANGUAGES.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      )}
      <Btn label="Link" title="Link" onClick={addLink} active={editor.isActive('link')} />
      <Btn label="Img" title="Insert image by URL" onClick={addImage} />
      <span className="tt-sep" />

      <Btn
        label="Tx"
        title="Clear formatting"
        onClick={() => chain().unsetAllMarks().clearNodes().run()}
      />
    </div>
  );
}

export default function TiptapEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, link: { openOnClick: false } }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'csharp' }),
      Image,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder || 'Write your article content...' }),
    ],
    content: value || '',
    shouldRerenderOnTransaction: true, // toolbar active-state আপডেটের জন্য
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="tt-wrapper">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}