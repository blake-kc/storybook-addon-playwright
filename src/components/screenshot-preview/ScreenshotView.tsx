import React, { useState, useCallback, useEffect, useRef } from 'react';
import { capitalize } from '@mui/material';
import { ScrollArea } from '@storybook/components';
import clsx from 'clsx';
import {
  useScreenshot,
  useEditScreenshot,
  useSaveScreenshot,
} from '../../hooks';
import { BrowserTypes } from '../../typings';
import {
  ErrorPanel,
  Dialog,
  Loader,
  ImageDiffMessage,
  InputDialog,
  ImagePreview,
} from '../common';
import { ScreenShotViewToolbar } from './ScreenShotViewToolbar';
import { useBrowserOptions } from '../../hooks';
import { lighten, darken } from '@mui/material/styles';
import { getBorderColor } from './utils';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) => {
    const getBackgroundColor =
      theme.palette.mode === 'light' ? lighten : darken;
    const { palette } = theme;
    const { background } = palette;

    return {
      card: {
        '& .os-scrollbar': {
          opacity: 1,
          visibility: 'visible !important',
          zIndex: 10,
        },
        '& .os-scrollbar-track': {
          '& .os-scrollbar-handle': {
            backgroundColor: getBorderColor(
              palette.mode,
              background.paper,
              0.6,
            ),
          },
          backgroundColor: 'transparent',
          visibility: 'visible !important',
        },

        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        zIndex: 10,
      },

      container: {
        alignItems: 'center',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      },

      editMode: {
        '& $fakeBorder': {
          borderColor: getBackgroundColor(theme.palette.warning.main, 0.5),
        },
        backgroundColor: getBackgroundColor(theme.palette.warning.main, 0.6),
      },

      fakeBorder: {
        border:
          '10px solid ' + getBorderColor(palette.mode, background.paper, 0.1),
        borderTop: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 5,
      },

      iframe: {
        width: '100%',
      },

      image: {
        marginLeft: 10,
        marginRight: 12,
      },
      imageContainer: {
        paddingBottom: 10,
      },
    };
  },
  { name: 'ScreenshotView' },
);

export interface PreviewItemProps {
  browserType: BrowserTypes | 'storybook';
  url?: string;
  height: number;
  refresh?: boolean;
  onRefreshEnd?: () => void;
  savingWithTitle?: string;
  onSaveComplete?: (browserType: string) => void;
}

const ScreenshotView: React.FC<PreviewItemProps> = (props) => {
  const {
    browserType,
    url,
    height,
    refresh,
    onRefreshEnd,
    savingWithTitle,
    onSaveComplete,
  } = props;

  const [showTitleDialog, setShowTitleDialog] = useState(false);

  const isSaving = useRef<boolean>(false);

  const { isEditing } = useEditScreenshot();

  const [openFullScreen, setOpenFullScreen] = useState(false);

  const classes = useStyles();

  const { getBrowserOptions } = useBrowserOptions();

  const browserOptions = getBrowserOptions(browserType as BrowserTypes);

  const { loading, screenshot, getSnapshot, error } = useScreenshot(
    browserType,
    browserOptions,
  );

  useEffect(() => {
    if (!refresh || loading) return;
    getSnapshot();
    onRefreshEnd();
  }, [getSnapshot, loading, onRefreshEnd, refresh]);

  const containerHeight = height - 30;

  const handleShowTitleDialog = useCallback(() => setShowTitleDialog(true), []);
  const handleCloseTitleDialog = useCallback(
    () => setShowTitleDialog(false),
    [],
  );

  const isValidToSave =
    screenshot && !screenshot.error && browserType !== 'storybook';

  const toggleFullScreen = useCallback(() => {
    setOpenFullScreen(!openFullScreen);
  }, [openFullScreen]);

  const errorMessage = (screenshot && screenshot.error) || error;

  const {
    saveScreenShot,
    onSuccessClose,
    inProgress,
    getUpdatingScreenshotTitle,
    ErrorSnackbar,
    result,
  } = useSaveScreenshot();

  const handleSave = useCallback(
    async (title: string) => {
      isSaving.current = true;
      await saveScreenShot(
        browserType as BrowserTypes,
        title,
        screenshot.base64,
        browserOptions,
      );
      onSaveComplete(browserType);
      handleCloseTitleDialog();
      isSaving.current = false;
    },
    [
      browserOptions,
      browserType,
      handleCloseTitleDialog,
      onSaveComplete,
      saveScreenShot,
      screenshot,
    ],
  );

  useEffect(() => {
    if (savingWithTitle) {
      if (!isSaving.current && !inProgress) {
        handleSave(savingWithTitle);
      }
    }
  }, [browserType, handleSave, inProgress, savingWithTitle]);

  return (
    <div
      className={clsx(classes.card, {
        [classes.editMode]: isEditing(browserType as BrowserTypes),
      })}
    >
      <ScreenShotViewToolbar
        browserType={browserType}
        onSave={handleShowTitleDialog}
        loading={loading}
        onRefresh={getSnapshot}
        showSaveButton={isValidToSave}
        onFullScreen={toggleFullScreen}
      />

      <div className={classes.container} style={{ height: containerHeight }}>
        <div className={classes.fakeBorder} />
        {browserType !== 'storybook' ? (
          <ScrollArea vertical={true} horizontal={true}>
            <div className={classes.imageContainer}>
              {screenshot && screenshot.base64 && !errorMessage ? (
                <img
                  className={classes.image}
                  src={`data:image/gif;base64,${screenshot.base64}`}
                />
              ) : (
                <>{errorMessage && <ErrorPanel message={errorMessage} />}</>
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
        <>
          <InputDialog
            open={showTitleDialog}
            onClose={handleCloseTitleDialog}
            onSave={handleSave}
            title="Screenshot Title"
            value={getUpdatingScreenshotTitle()}
            required
          />

          <Loader open={inProgress && !savingWithTitle} />

          <ErrorSnackbar />

          <ImageDiffMessage
            browserType={browserType as BrowserTypes}
            title={savingWithTitle}
            result={result}
            onClose={onSuccessClose}
          />
        </>
      )}

      <Dialog
        open={openFullScreen}
        width="100%"
        height="100%"
        onClose={toggleFullScreen}
        title={`${capitalize(browserType)} screenshot`}
      >
        {screenshot && openFullScreen && (
          <ImagePreview imgSrcString={screenshot.base64} />
        )}
      </Dialog>
    </div>
  );
};

ScreenshotView.displayName = 'ScreenshotView';

export { ScreenshotView };
