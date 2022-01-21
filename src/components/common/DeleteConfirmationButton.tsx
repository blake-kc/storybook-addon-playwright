import React, { useCallback } from 'react';
import { IconButton as MuIconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlineSharp';
import { ConfirmationPopover } from '../common';

export interface DeleteConfirmationButtonProps {
  onDelete: () => void;
  IconButton?: React.ComponentType;
  onClose?: () => void;
}

const DeleteConfirmationButton: React.FC<DeleteConfirmationButtonProps> = ({
  onDelete,
  IconButton = MuIconButton,
  onClose,
}) => {
  const [confirmAnchorEl, setConfirmAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setConfirmAnchorEl(e.currentTarget);
    },
    [],
  );

  const closeDeleteConfirmation = useCallback(() => {
    if (onClose) onClose();
    setConfirmAnchorEl(undefined);
  }, [onClose]);

  const handleDeleteConfirmation = useCallback(() => {
    closeDeleteConfirmation();
    onDelete();
  }, [closeDeleteConfirmation, onDelete]);

  return (
    <>
      <IconButton onClick={handleDelete} title="Delete Item" size="small">
        <DeleteIcon />
      </IconButton>

      {confirmAnchorEl && (
        <ConfirmationPopover
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteConfirmation}
          anchorEl={confirmAnchorEl}
        />
      )}
    </>
  );
};

DeleteConfirmationButton.displayName = 'DeleteConfirmationButton';

export { DeleteConfirmationButton };
