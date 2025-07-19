import React, { useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const QueryForm = ({ initialValues, customers, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = async (values) => {
    const method = initialValues && initialValues._id ? 'PUT' : 'POST';
    const url = initialValues && initialValues._id
      ? `/api/queries/${initialValues._id}`
      : '/api/queries';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      onSubmit();
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        label="Customer"
        name="customer"
        rules={[{ required: true, message: 'Please select a customer' }]}
      >
        <Select
          showSearch
          placeholder="Select a customer"
          optionFilterProp="children"
        >
          {customers.map((c) => (
            <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        label="Status"
        name="status"
        initialValue="open"
        rules={[{ required: true }]}
      >
        <Select>
          {STATUS_OPTIONS.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Resolution" name="resolution">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Update Query' : 'Add Query'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default QueryForm; 