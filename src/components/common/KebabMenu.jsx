import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import PropTypes from 'prop-types';

const KebabMenu = ({ options, buttonClassName = '', menuClassName = '' }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${buttonClassName}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={e => { e.stopPropagation(); setOpen((v) => !v); }}
      >
        <FiMoreVertical size={20} />
      </button>
      {open && (
        <div
          className={`absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${menuClassName}`}
          role="menu"
        >
          {options.map((opt, idx) => (
            <button
              key={opt.label}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={e => { e.stopPropagation(); setOpen(false); opt.onClick(); }}
              role="menuitem"
              tabIndex={0}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

KebabMenu.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  buttonClassName: PropTypes.string,
  menuClassName: PropTypes.string,
};

export default KebabMenu; 