export type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

const KebabMenu = ({ isOpen, children }: ModalProps) => {
  console.log(`Trying to Open Kebab Menu. Value of isOpen ${isOpen}`)
  if (!isOpen) return null;
  console.log(`Opening Kebab Menu`)

  return (
    <div>
     {children}
    </div>
  );
};

export default KebabMenu;
