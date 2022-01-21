import React from 'react';
import { useEditScreenshot } from '../../hooks';
import { Button, Alert } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(
  () => {
    return {
      alert: {
        padding: '0px 16px',
      },
      icon: {
        alignSelf: 'center',
      },
      message: {
        flex: 1,
      },
      messageWrapper: {
        alignSelf: 'center',
      },
      root: {
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      },
    };
  },
  { name: 'EditScreenshotAlert' },
);

const EditScreenshotAlert: React.FC = () => {
  const { editScreenshotState, clearScreenshotEdit } = useEditScreenshot();

  const classes = useStyles();

  if (!editScreenshotState) return null;

  return (
    <Alert
      classes={{
        icon: classes.icon,
        message: classes.message,
        root: classes.alert,
      }}
      severity="warning"
    >
      <div className={classes.root}>
        <div className={classes.messageWrapper}>
          {`Editing '${editScreenshotState.screenshotData.title}' screenshot (${editScreenshotState.screenshotData.browserType}).`}
        </div>

        <div>
          <Button size="small" color="inherit" onClick={clearScreenshotEdit}>
            Cancel
          </Button>
        </div>
      </div>
    </Alert>
  );
};

EditScreenshotAlert.displayName = 'EditScreenshotAlert';

export { EditScreenshotAlert };
