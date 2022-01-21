import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) => {
    const { divider, text } = theme.palette;

    return {
      root: {
        '& button': {
          alignItems: 'center',
          display: 'flex',
          marginTop: 0,
        },
        '& svg': {
          width: 18,
        },
        '&.border-bottom': {
          borderBottom: '1px solid ' + divider,
        },
        '&.border-left': {
          borderLeft: '1px solid ' + divider,
        },
        '&.border-right': {
          borderRight: '1px solid ' + divider,
        },
        '&.border-top': {
          borderTop: '1px solid ' + divider,
        },
        padding: 2,
      },
      toolbar: {
        '& > .left': {
          '& > *': {
            marginLeft: 8,
          },
        },
        '& > .left,& > .right': {
          alignItems: 'center',
          display: 'flex',
          minWidth: 0,
        },
        '& > .right': {
          '& > *': {
            marginRight: 6,
          },
        },
        alignItems: 'center',
        color: text.primary,
        display: 'flex',
        justifyContent: 'space-between',
      },
    };
  },
  { name: 'Toolbar' },
);

type Border = 'top' | 'right' | 'bottom' | 'left';

export interface ToolbarProps {
  border?: Border[];
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { children, border } = props;

  const classes = useStyles();

  return (
    <div
      className={
        clsx(classes.root) +
        (border && border.map((x) => ` border-${x}`).join(' '))
      }
    >
      <div className={classes.toolbar}>{children}</div>
    </div>
  );
};

Toolbar.displayName = 'Toolbar';

export { Toolbar };
