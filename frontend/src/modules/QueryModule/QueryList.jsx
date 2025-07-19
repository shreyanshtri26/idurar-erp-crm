import React, { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable/DataTable';
import CrudModal from '@/components/CrudModal';
import SelectAsync from '@/components/SelectAsync';
import QueryForm from './QueryForm';
import NotesPanel from './NotesPanel';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const QueryList = () => {
  const [queries, setQueries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showNotes, setShowNotes] = useState(null);

  // Fetch customers for dropdown
  useEffect(() => {
    fetch('/api/client/listAll')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(() => setCustomers([]));
  }, []);

  // Fetch queries
  useEffect(() => {
    let url = `/api/queries?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setQueries(data.data || []);
        setTotal(data.total || 0);
      });
  }, [page, limit, status, showModal]);

  // Map customerId to name
  const customerMap = customers.reduce((acc, c) => {
    acc[c._id] = c.name;
    return acc;
  }, {});

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      render: (id) => customerMap[id] || 'N/A',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => status.charAt(0).toUpperCase() + status.slice(1),
    },
    {
      title: 'Resolution',
      dataIndex: 'resolution',
      render: (text) => text ? text.slice(0, 30) + (text.length > 30 ? '...' : '') : '',
    },
    {
      title: 'Notes',
      dataIndex: '_id',
      render: (id) => (
        <button onClick={() => setShowNotes(id)}>Notes</button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button onClick={() => { setSelectedQuery(null); setShowModal(true); }}>Add Query</button>
      </div>
      <DataTable
        columns={columns}
        data={queries}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: (p) => setPage(p),
        }}
      />
      <CrudModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        title={selectedQuery ? 'Edit Query' : 'Add Query'}
      >
        <QueryForm
          initialValues={selectedQuery}
          customers={customers}
          onSubmit={() => setShowModal(false)}
        />
      </CrudModal>
      {showNotes && (
        <CrudModal visible={!!showNotes} onCancel={() => setShowNotes(null)} title="Notes">
          <NotesPanel queryId={showNotes} />
        </CrudModal>
      )}
    </div>
  );
};

export default QueryList; 