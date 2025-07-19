import React, { useEffect, useState } from 'react';
import { List, Input, Button, Popconfirm, message } from 'antd';

const NotesPanel = ({ queryId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [author, setAuthor] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    const res = await fetch(`/api/queries/${queryId}`);
    if (res.ok) {
      const data = await res.json();
      setNotes(data.notes || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (queryId) fetchNotes();
    // eslint-disable-next-line
  }, [queryId]);

  const handleAddNote = async () => {
    if (!noteText) return;
    const res = await fetch(`/api/queries/${queryId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: noteText, author }),
    });
    if (res.ok) {
      setNoteText('');
      setAuthor('');
      fetchNotes();
      message.success('Note added');
    }
  };

  const handleDeleteNote = async (noteId) => {
    const res = await fetch(`/api/queries/${queryId}/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchNotes();
      message.success('Note deleted');
    }
  };

  return (
    <div>
      <List
        loading={loading}
        dataSource={notes}
        renderItem={note => (
          <List.Item
            actions={[
              <Popconfirm
                title="Delete this note?"
                onConfirm={() => handleDeleteNote(note._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger size="small">Delete</Button>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              title={note.author || 'Anonymous'}
              description={note.text}
            />
            <div style={{ fontSize: 12, color: '#888' }}>{new Date(note.createdAt).toLocaleString()}</div>
          </List.Item>
        )}
      />
      <Input
        placeholder="Your name (optional)"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        style={{ marginTop: 16 }}
      />
      <Input.TextArea
        placeholder="Add a note..."
        value={noteText}
        onChange={e => setNoteText(e.target.value)}
        rows={2}
        style={{ marginTop: 8 }}
      />
      <Button type="primary" onClick={handleAddNote} style={{ marginTop: 8 }}>
        Add Note
      </Button>
    </div>
  );
};

export default NotesPanel; 