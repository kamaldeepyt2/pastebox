import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { addToPastes, updateToPastes } from '../redux/pasteSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const languages = ['Plain text', 'JavaScript', 'JSX', 'Python', 'HTML', 'CSS', 'JSON', 'Markdown'];

function getDraft(pasteId, existingPaste) {
    const savedDraft = localStorage.getItem(`paste-draft-${pasteId ?? 'new'}`);

    if (savedDraft) {
        try {
            return JSON.parse(savedDraft);
        } catch {
            localStorage.removeItem(`paste-draft-${pasteId ?? 'new'}`);
        }
    }

    return {
        title: existingPaste?.title ?? '',
        content: existingPaste?.content ?? '',
        tags: existingPaste?.tags ?? [],
        language: existingPaste?.language ?? 'Plain text',
    };
}

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const pasteId = searchParams.get('pasteId');
    const allPastes = useSelector((state) => state.paste.pastes);

    return (
        <PasteForm
            key={pasteId ?? 'new'}
            pasteId={pasteId}
            allPastes={allPastes}
            setSearchParams={setSearchParams}
        />
    );
};

const PasteForm = ({ pasteId, allPastes, setSearchParams }) => {
    const existingPaste = allPastes.find((paste) => paste._id === pasteId);
    const initialDraft = getDraft(pasteId, existingPaste);
    const [title, setTitle] = useState(initialDraft.title);
    const [value, setValue] = useState(initialDraft.content);
    const [tags, setTags] = useState(initialDraft.tags.join(', '));
    const [language, setLanguage] = useState(initialDraft.language);
    const dispatch = useDispatch();

    useEffect(() => {
        const draft = { title, content: value, tags: parseTags(tags), language };

        if (title || value || tags) {
            localStorage.setItem(`paste-draft-${pasteId ?? 'new'}`, JSON.stringify(draft));
        }
    }, [title, value, tags, language, pasteId]);

    function savePaste() {
        if (!title.trim() || !value.trim()) {
            toast.error('Add a title and some content first.');
            return;
        }

        const paste = {
            title: title.trim(),
            content: value.trim(),
            tags: parseTags(tags),
            language,
            favorite: existingPaste?.favorite ?? false,
            _id: pasteId ?? Date.now().toString(36),
            createdAt: existingPaste?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        dispatch(pasteId ? updateToPastes(paste) : addToPastes(paste));
        localStorage.removeItem(`paste-draft-${pasteId ?? 'new'}`);
        setTitle('');
        setValue('');
        setTags('');
        setLanguage('Plain text');
        setSearchParams({});
    }

    function handleEditorKeyDown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            savePaste();
        }
    }

    return (
        <section className="page page-editor">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">{pasteId ? 'Edit entry' : 'Private scratch space'}</p>
                    <h1>{pasteId ? 'Shape it until it is clear.' : 'Put an idea somewhere safe.'}</h1>
                    <p className="page-subtitle">Capture code, notes, links, or anything you want to keep close.</p>
                </div>
                <span className="status-chip"><span className="status-dot" /> Autosave on</span>
            </div>

            <div className="editor-card">
                <input
                    type="text"
                    aria-label="Paste title"
                    placeholder="Paste title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="title-input"
                />
                <button onClick={savePaste} className="primary-button">
                    {pasteId ? 'Update paste' : 'Save paste'}
                </button>
                <div className="editor-options">
                    <input
                        type="text"
                        aria-label="Paste tags"
                        placeholder="Tags: work, idea, code"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="option-input"
                    />
                    <select aria-label="Paste language" value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
                        {languages.map((item) => <option key={item}>{item}</option>)}
                    </select>
                </div>
                <textarea
                    aria-label="Paste content"
                    value={value}
                    placeholder="Write your paste here..."
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleEditorKeyDown}
                    className="paste-editor"
                    rows={20}
                />
            </div>
            <div className="editor-footer"><span>Ctrl + Enter to save · Draft saved locally</span><span>{value.trim() ? value.trim().split(/\s+/).length : 0} words · {value.length} characters</span></div>
        </section>
    );
};

function parseTags(value) {
    return value.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 6);
}

export default Home;
