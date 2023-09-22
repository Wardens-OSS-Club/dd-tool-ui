// components/DraggableItem.tsx
import React from 'react';

interface DraggableActionProps {
  id: string;
  content: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragEnd?: () => void; // Add this line
}

const DraggableAction: React.FC<DraggableActionProps> = ({ id, content, onDragStart, onDragEnd }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onDragEnd={onDragEnd} // And this line
      style={{
        padding: '8px',
        margin: '4px',
        backgroundColor: 'lightgray',
      }}
    >
      {content}
    </div>
  );
};

export default DraggableAction;
