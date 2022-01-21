import React, { memo } from 'react';
import { capitalize } from '../../utils';
import HelpOutlineSharp from '@mui/icons-material/HelpOutlineSharp';
import { Tooltip } from '@mui/material';
import CheckSelected from '@mui/icons-material/CheckCircleOutlineRounded';
import CheckNotSelected from '@mui/icons-material/RadioButtonUncheckedRounded';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) => {
    return {
      active: {
        color: theme.palette.primary.main,
      },
      controlWrap: {
        flex: 2,
      },
      iconWrapper: {
        marginBottom: -2,
        marginRight: -8,
        paddingLeft: 4,
        width: 14,
      },
      icons: {
        '&:hover': {
          opacity: 0.8,
        },
        cursor: 'pointer',
        fontSize: 14,
        opacity: 0.4,
      },
      labelWrap: {
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
      },
      root: {
        '& fieldset > div': {
          '&>div': {
            margin: 0,
            marginRight: 10,
          },
        },
        '& input[type="number"], select,textarea': {
          transition: 'none',
          width: '100%',
        },
        '& label': {
          border: 'none !important',
          margin: '0 !important',
        },
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4,
      },
    };
  },
  { name: 'FormControl' },
);

export interface ControlFormProps {
  label: string;
  description?: string;
  appendValueToTitle: boolean;
  onAppendValueToTitle?: () => void;
  isRequired: boolean;
  active?: boolean;
}

const FormControl: React.FC<ControlFormProps> = memo((props) => {
  const {
    label,
    description,
    appendValueToTitle,
    onAppendValueToTitle,
    children,
    isRequired,
    active,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={clsx(classes.labelWrap, { [classes.active]: active })}>
        <span className="form-label">
          {capitalize(label)}
          {isRequired && <span style={{ marginLeft: 2 }}>*</span>}
        </span>
      </div>
      <div className={classes.controlWrap}>{children}</div>
      <div className={classes.iconWrapper}>
        <div>
          {description && (
            <Tooltip placement="top" enterDelay={800} title={description}>
              <HelpOutlineSharp className={classes.icons} />
            </Tooltip>
          )}
        </div>
        {onAppendValueToTitle && (
          <div onClick={onAppendValueToTitle}>
            <Tooltip
              placement="top"
              enterDelay={800}
              title="Append value to title"
            >
              {appendValueToTitle ? (
                <CheckSelected
                  style={{ opacity: 1 }}
                  className={classes.icons}
                />
              ) : (
                <CheckNotSelected className={classes.icons} />
              )}
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
});

FormControl.displayName = 'FormControl';

export { FormControl };
