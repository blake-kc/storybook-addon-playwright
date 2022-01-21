import React, { memo } from 'react';
import {
  DialogTitle,
  Button,
  DialogContent,
  DialogActions,
} from '@mui/material';

export interface ActionPanelProps {
  title?: string;
  onPositiveAction?: () => void;
  onNegativeAction?: () => void;
  positiveActionName?: string;
  negativeActionName?: string;
}

const ActionPanel: React.FC<ActionPanelProps> = memo(
  ({
    onPositiveAction,
    title,
    onNegativeAction,
    children,
    positiveActionName = 'Save',
    negativeActionName = 'Cancel',
  }) => {
    return (
      <>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onNegativeAction}>{negativeActionName}</Button>
          <Button onClick={onPositiveAction}>{positiveActionName}</Button>
        </DialogActions>
      </>
    );
  },
);

ActionPanel.displayName = 'ActionPanel';

export { ActionPanel };
