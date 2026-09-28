import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import csharp from 'highlight.js/lib/languages/csharp';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import '../../styles/tiptap-custom.css';

hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('python', python);

const PostContent = ({ html }) => {
    const ref = useRef(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;

        root.querySelectorAll('pre').forEach((pre) => {
            if (pre.parentElement?.classList.contains('code-wrap')) return;

            const code = pre.querySelector('code');
            if (code) {
                const lang = [...code.classList]
                    .find((c) => c.startsWith('language-'))
                    ?.replace('language-', '');
                if (lang && hljs.getLanguage(lang)) {
                    hljs.highlightElement(code);
                }
            }

            // Wrap block + add copy button
            const wrap = document.createElement('div');
            wrap.className = 'code-wrap';
            pre.parentNode.insertBefore(wrap, pre);
            wrap.appendChild(pre);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'code-copy';
            btn.textContent = 'Copy';
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText((code || pre).innerText);
                    btn.textContent = 'Copied ✓';
                    btn.classList.add('is-copied');
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('is-copied');
                    }, 1500);
                } catch {
                    btn.textContent = 'Failed';
                }
            });
            wrap.appendChild(btn);
        });
    }, [html]);

    return (
        <div
            ref={ref}
            className="post-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html || '') }}
        />
    );
};

export default PostContent;