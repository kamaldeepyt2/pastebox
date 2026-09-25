import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ViewPaste = () => {

    const { id } = useParams();

    const allPastes = useSelector((state) => state.paste.pastes);

    const paste = allPastes.filter((p) => p._id === id)[0];

    if (!paste) {
        return (
            <section className="page empty-state-page">
                <p className="eyebrow">404 / Missing paste</p>
                <h1>That paste has moved on.</h1>
                <Link to="/pastes" className="primary-button back-link">
                    Back to pastes
                </Link>
            </section>
        );
    }

    return (
        <section className="page page-editor">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Read-only view</p>
                    <h1>One thought, kept intact.</h1>
                    <p className="page-subtitle">{paste.language ?? 'Plain text'} · {paste.updatedAt ? 'Updated' : 'Created'} {new Date(paste.updatedAt ?? paste.createdAt).toLocaleString()}</p>
                </div>
                <Link to="/pastes" className="status-chip back-link">Back to library</Link>
            </div>
            <div className="editor-card view-card">
                <input
                    type="text"
                    placeholder="Paste title..."
                    value={paste.title}
                    disabled
                    className="title-input"
                />
                {paste.language && paste.language !== 'Plain text' ? (
                    <pre className="code-preview"><code>{paste.content}</code></pre>
                ) : (
                    <textarea
                        value={paste.content}
                        placeholder="Write your paste here..."
                        disabled
                        className="paste-editor"
                        rows={20}
                    />
                )}
                {(paste.tags ?? []).length > 0 && <div className="tag-row view-tags">{paste.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div>}
            </div>
        </section>
    )
}

export default ViewPaste
