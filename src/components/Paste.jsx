import React, { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { importPastes, removeFromPasts, toggleFavorite } from '../redux/pasteSlice';
import toast from 'react-hot-toast';

const Paste = () => {
    const pastes = useSelector((state) => state.paste.pastes);
    const dispatch = useDispatch();
    const importInput = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [selectedTag, setSelectedTag] = useState('all');
    const [favoritesOnly, setFavoritesOnly] = useState(false);

    const allTags = useMemo(
        () => [...new Set(pastes.flatMap((paste) => paste.tags ?? []))].sort(),
        [pastes],
    );

    const filteredData = useMemo(() => {
        const search = searchTerm.toLowerCase();
        const filtered = pastes.filter((paste) => {
            const matchesSearch = [paste.title, paste.content, ...(paste.tags ?? [])]
                .join(' ').toLowerCase().includes(search);
            const matchesTag = selectedTag === 'all' || (paste.tags ?? []).includes(selectedTag);
            const matchesFavorite = !favoritesOnly || paste.favorite;
            return matchesSearch && matchesTag && matchesFavorite;
        });

        return [...filtered].sort((first, second) => {
            if (sortOrder === 'oldest') return new Date(first.createdAt) - new Date(second.createdAt);
            if (sortOrder === 'title') return first.title.localeCompare(second.title);
            return new Date(second.createdAt) - new Date(first.createdAt);
        });
    }, [pastes, searchTerm, selectedTag, favoritesOnly, sortOrder]);

    function handleDelete(pasteId) {
        if (window.confirm('Delete this paste permanently?')) {
            dispatch(removeFromPasts(pasteId));
        }
    }

    async function copyPaste(content) {
        try {
            await navigator.clipboard.writeText(content);
            toast.success('Copied to clipboard!');
        } catch {
            toast.error('Could not copy this paste.');
        }
    }

    function exportPastes() {
        const file = new Blob([JSON.stringify(pastes, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = `pastebox-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success('Backup downloaded.');
    }

    function handleImport(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const imported = JSON.parse(reader.result);
                if (!Array.isArray(imported) || imported.some((paste) => !paste._id || !paste.title || !paste.content)) {
                    throw new Error('Invalid paste backup');
                }
                const shouldReplace = window.confirm('Replace your current pastes? Select Cancel to merge new pastes.');
                const nextPastes = shouldReplace
                    ? imported
                    : [...pastes, ...imported.filter((item) => !pastes.some((paste) => paste._id === item._id))];
                dispatch(importPastes(nextPastes));
            } catch {
                toast.error('That file is not a valid Pastebox backup.');
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    }

    return (
        <section className="page page-library">
            <div className="page-heading library-heading">
                <div>
                    <p className="eyebrow">Your collection</p>
                    <h1>Everything worth keeping.</h1>
                    <p className="page-subtitle">Search, sort, and protect your saved pastes.</p>
                </div>
                <span className="count-badge">{pastes.length} {pastes.length === 1 ? 'paste' : 'pastes'}</span>
            </div>

            <div className="search-wrap">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <input aria-label="Search pastes" className="search-input" type="search" placeholder="Search title, content, or tags..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="library-tools">
                <select className="filter-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} aria-label="Sort pastes">
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title">Title A-Z</option>
                </select>
                <select className="filter-select" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} aria-label="Filter by tag">
                    <option value="all">All tags</option>
                    {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                </select>
                <button className={`tool-button${favoritesOnly ? ' active-tool' : ''}`} aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly((value) => !value)}>★ Favorites</button>
                <button className="tool-button" onClick={exportPastes}>↓ Export</button>
                <button className="tool-button" onClick={() => importInput.current?.click()}>↑ Import</button>
                <input ref={importInput} className="import-input" type="file" accept="application/json" onChange={handleImport} />
            </div>

            <div className="paste-grid">
                {filteredData.length > 0 ? filteredData.map((paste) => (
                    <article key={paste._id} className="paste-card">
                        <div className="paste-card-top">
                            <span className="paste-label">{paste.language ?? 'PLAIN TEXT'}</span>
                            <button className={`card-action favorite-button${paste.favorite ? ' is-favorite' : ''}`} onClick={() => dispatch(toggleFavorite(paste._id))} aria-label={`${paste.favorite ? 'Remove' : 'Add'} favorite`} aria-pressed={Boolean(paste.favorite)}>★</button>
                        </div>
                        <h2>{paste.title}</h2>
                        <p className="paste-preview">{paste.content}</p>
                        {(paste.tags ?? []).length > 0 && <div className="tag-row">{paste.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div>}
                        <div className="card-actions">
                            <Link className="card-action card-action-main" to={`/?pasteId=${paste._id}`}>Edit</Link>
                            <Link className="card-action" to={`/pastes/${paste._id}`}>View</Link>
                            <button className="card-action" onClick={() => handleDelete(paste._id)}>Delete</button>
                            <button className="card-action" onClick={() => copyPaste(paste.content)}>Copy</button>
                        </div>
                        <div className="paste-created">{paste.updatedAt ? 'Updated' : 'Created'} {new Date(paste.updatedAt ?? paste.createdAt).toLocaleString()}</div>
                    </article>
                )) : (
                    <div className="empty-state">
                        <p>{searchTerm || selectedTag !== 'all' || favoritesOnly ? 'No pastes match these filters.' : 'No pastes yet. Create your first one.'}</p>
                        {!searchTerm && selectedTag === 'all' && !favoritesOnly && <Link to="/" className="empty-action">Create your first paste</Link>}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Paste
