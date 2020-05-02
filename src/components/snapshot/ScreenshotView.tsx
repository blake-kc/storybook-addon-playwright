import React, { SFC, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { ScrollArea } from '@storybook/components';
import clsx from 'clsx';
import { useScreenshot } from '../../hooks';
import { BrowserTypes } from '../../typings';
import { ErrorPanel } from '../common';
import { SaveScreenShot } from './SaveScreenShot';
import { ScreenShotViewToolbar } from './ScreenShotViewToolbar';

const useStyles = makeStyles((theme) => {
  const { palette } = theme;
  return {
    card: {
      '& .simplebar-track': {
        '&:after': {
          backgroundColor: palette.divider,
          content: '""',
          display: 'block',
          height: '100%',
          width: '100%',
        },
        backgroundColor: palette.background.paper,
      },
      borderLeft: '10px solid ' + palette.divider,

      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    },

    container: {
      alignItems: 'center',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    },

    fakeBorder: {
      border: '10px solid ' + palette.divider,
      borderLeft: 0,
      borderTop: 0,
      bottom: 0,
      left: 0,
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      top: 0,
    },

    iframe: {
      width: '100%',
    },

    image: {
      marginRight: 12,
    },

    imageContainer: {
      textAlign: 'center',
    },
  };
});

export interface PreviewItemProps {
  browserType: BrowserTypes | 'storybook';
  url?: string;
  height: number;
}

const ScreenshotView: SFC<PreviewItemProps> = (props) => {
  const { browserType, url, height } = props;

  const [openSaveScreenShot, setOpenSaveScreenShot] = useState(false);

  const classes = useStyles();

  const { loading, screenshot, getSnapshot } = useScreenshot(browserType);

  const containerHeight = height - 30;

  const handleOpenSaveScreenShotDialog = useCallback(() => {
    setOpenSaveScreenShot(true);
  }, []);

  const handleCloseSaveScreenShotDialog = useCallback(() => {
    setOpenSaveScreenShot(false);
  }, []);

  const isValidToSave =
    screenshot && !screenshot.error && browserType !== 'storybook';

  return (
    <div className={clsx(classes.card)}>
      <ScreenShotViewToolbar
        browserType={browserType}
        onSave={handleOpenSaveScreenShotDialog}
        loading={loading}
        onRefresh={getSnapshot}
        showSaveButton={isValidToSave}
      />

      <div className={classes.container} style={{ height: containerHeight }}>
        <div className={classes.fakeBorder} />
        {screenshot ? (
          <ScrollArea vertical={true} horizontal={true}>
            <div className={classes.imageContainer}>
              {screenshot.base64 ? (
                <img
                  className={classes.image}
                  src={`data:image/gif;base64,${screenshot.base64}`}
                />
              ) : (
                <ErrorPanel message={screenshot.error} />
              )}
            </div>
          </ScrollArea>
        ) : (
          <iframe
            src={url}
            className={classes.iframe}
            style={{ height: containerHeight - 10 }}
            frameBorder="0"
          ></iframe>
        )}
      </div>
      {isValidToSave && (
        <SaveScreenShot
          open={openSaveScreenShot}
          onClose={handleCloseSaveScreenShotDialog}
          browserType={browserType as BrowserTypes}
          screenShot={screenshot.base64}
        />
      )}
    </div>
  );
};

ScreenshotView.displayName = 'ScreenshotView';

export { ScreenshotView };