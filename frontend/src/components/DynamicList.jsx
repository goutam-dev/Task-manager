// src/components/DynamicList.jsx
import React, { useState } from 'react';
import { Input, Button } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const DynamicList = ({ items = [], onChange, placeholder }) => {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    const v = newItem.trim();
    if (!v) return;
    onChange([...items, v]);
    setNewItem('');
  };

  const handleSaveEdit = () => {
    const v = editValue.trim();
    if (editingIndex === null || !v) return;
    const updated = [...items];
    updated[editingIndex] = v;
    onChange(updated);
    setEditingIndex(null);
    setEditValue('');
  };

  const handleRemove = idx => {
    onChange(items.filter((_, i) => i !== idx));
  };

  // Intercepts Enter so it doesn't submit the parent Form
  const onNewItemKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();   // <-- stop Form.submit
      handleAdd();
    }
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}
        >
          {editingIndex === idx ? (
            <Input
              size="small"
              style={{ flex: 1, marginRight: 8 }}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveEdit();
                }
              }}
            />
          ) : (
            <span style={{ flex: 1 }}>{item}</span>
          )}

          {editingIndex === idx ? (
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={handleSaveEdit}
            />
          ) : (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingIndex(idx);
                setEditValue(item);
              }}
            />
          )}

          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemove(idx)}
            style={{ marginLeft: 8 }}
          />
        </div>
      ))}

      <div style={{ display: 'flex', marginTop: 8 }}>
        <Input
          placeholder={placeholder}
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={onNewItemKeyDown}       // <-- use keyDown instead of onPressEnter
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ marginLeft: 8 }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default DynamicList;
