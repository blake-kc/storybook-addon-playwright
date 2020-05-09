import React, { SFC, memo, useRef, useEffect, useCallback } from 'react';
import {
  Snackbar as MUSnackbar,
  SnackbarProps as MUSnackbarProps,
  makeStyles,
} from '@material-ui/core';
import { Alert, AlertTitle, Color } from '@material-ui/lab';
import ReactDOM from 'react-dom';
import CloseSharp from '@material-ui/icons/CloseSharp';

interface StyleProps {
  type: Color;
}

const getColor = (type: Color, alt?: boolean) => {
  switch (type) {
    case 'error':
      return alt ? '#DD3C31' : '#FAB3AE';
    case 'info':
      return alt ? '#1D88DC' : '#A6D5FA';
    case 'warning':
      return alt ? '#ff9800' : 'rgb(255, 213, 153)';
    case 'success':
      return alt ? '#4caf50' : 'rgb(183, 223, 185)';
    default:
      return '';
  }
};

const useStyles = makeStyles(
  () => {
    return {
      closeIcon: {
        '&:hover': {
          color: (p: StyleProps) => getColor(p.type, true),
        },
        color: (p: StyleProps) => getColor(p.type),
        cursor: 'pointer',
        fontSize: 18,
        position: 'absolute',
        right: 6,
        top: 6,
      },
    };
  },
  { name: 'Snackbar' },
);

export interface SnackbarProps
  extends Omit<MUSnackbarProps, 'onClose'>,
    StyleProps {
  title?: string;
  onClose: () => void;
  closeIcon?: boolean;
}

const Snackbar: SFC<SnackbarProps> = memo(
  ({
    type = 'info',
    title,
    message,
    children,
    closeIcon,
    onClose,
    ...rest
  }) => {
    const div = useRef<HTMLDivElement>(document.createElement('div'));

    const classes = useStyles({ type });

    useEffect(() => {
      document.body.appendChild(div.current);

      return () => {
        document.body.removeChild(div.current);
      };
    }, []);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    return (
      <>
        {ReactDOM.createPortal(
          <MUSnackbar
            onClose={handleClose}
            autoHideDuration={6000}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            {...rest}
          >
            <>
              {closeIcon && (
                <CloseSharp
                  className={classes.closeIcon}
                  onClick={handleClose}
                />
              )}
              <Alert severity={type}>
                {title && <AlertTitle>{title}</AlertTitle>}
                {message ? message : children}
              </Alert>
            </>
          </MUSnackbar>,
          div.current,
        )}
      </>
    );
  },
);

Snackbar.displayName = 'Snackbar';

export { Snackbar };
