export type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

const KebabMenu = ({ isOpen, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div>
     {children}
    </div>
  );
};

export default KebabMenu;
