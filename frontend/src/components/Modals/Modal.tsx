import {useEffect} from 'react';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
};

const Modal = ({ isOpen, onClose, children, height=0 }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Shortcut to close the modal with the 'Escape' key
      if (event.key === 'Escape') {
        onClose();
      }
    };
    // Add event listener when the modal is open
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: remove event listener when the modal is closed
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]); // Dependencies for the effect
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 relative shadow-xl w-[500px] h-[${height}px]`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
