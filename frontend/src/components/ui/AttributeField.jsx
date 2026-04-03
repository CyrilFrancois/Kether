import React from 'react';
import { Paperclip, List as ListIcon, Type, Hash, CheckCircle2, Circle } from 'lucide-react';

/**
 * AttributeField: A polymorphic input component.
 * Adapts its rendering logic based on the 'type' provided by the Attribute schema.
 */
const AttributeField = ({ type, value, onChange, placeholder = "Enter value..." }) => {
  
  // Render logic based on data type
  const renderInput = () => {
    switch (type) {
      case 'number':
        return (
          <div className="input-wrapper">
            <Hash size={14} className="input-icon" />
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="0.00"
              className="field-input"
            />
          </div>
        );

      case 'list':
        return (
          <div className="input-wrapper">
            <ListIcon size={14} className="input-icon" />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Item 1, Item 2, ..."
              className="field-input"
            />
          </div>
        );

      case 'boolean':
      case 'toggle':
        const isTrue = value === 'true' || value === true;
        return (
          <button 
            type="button"
            className={`toggle-field ${isTrue ? 'active' : ''}`}
            onClick={() => onChange(!isTrue)}
          >
            {isTrue ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            <span>{isTrue ? 'Enabled' : 'Disabled'}</span>
          </button>
        );

      case 'file':
        return (
          <div className="input-wrapper">
            <Paperclip size={14} className="input-icon" />
            <input
              type="text"
              value={value || ''}
              readOnly
              placeholder="Attachment path..."
              className="field-input readonly-field"
            />
          </div>
        );

      case 'text':
      default:
        return (
          <div className="input-wrapper">
            <Type size={14} className="input-icon" />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="field-input"
            />
          </div>
        );
    }
  };

  return (
    <div className="attribute-field-container">
      {renderInput()}

      <style jsx>{`
        .attribute-field-container {
          flex: 1;
          display: flex;
          min-width: 0;
        }

        .input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 10px;
          color: #8b949e;
          pointer-events: none;
          z-index: 1;
        }

        .field-input {
          width: 100%;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 8px 10px 8px 32px;
          color: #c9d1d9;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .field-input:focus {
          outline: none;
          border-color: #58a6ff;
          background: #161b22;
          box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
        }

        .readonly-field {
          cursor: default;
          color: #8b949e;
          background: #161b22;
          border-style: dashed;
        }

        /* Toggle Component Styling */
        .toggle-field {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #21262d;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 7px 12px;
          color: #8b949e;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          width: 100%;
        }

        .toggle-field.active {
          color: #3fb950;
          border-color: #3fb950;
          background: rgba(63, 185, 80, 0.1);
        }

        .toggle-field:hover {
          border-color: #8b949e;
        }

        /* Standardize number inputs */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default AttributeField;