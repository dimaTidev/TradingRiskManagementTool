import React, { useState } from 'react';
import Style from "./EditField.module.css"

export default function EditField( {initName, onChanged} ) {
  const [name, setName] = useState(initName);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      e.target.value = name;
      e.target.blur();
    }
  };

  return (
    <>
        <input
          className={Style.inputStyle}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength="20"
          onBlur={() => { 
            onChanged?.(name);
          }}
        />
    </>
  );
}