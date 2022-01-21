import React, { useCallback } from 'react';
import { ImageDiffResult } from '../../api/typings';
import { Tabs, Tab, Divider, Alert } from '@mui/material';
import { ImagePreview } from './ImagePreview';
import { getImageDiffMessages } from '../../utils';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(
  () => {
    return {
      preview: {
        flexGrow: 1,
        margin: 5,
        overflow: 'auto',
      },
      root: {
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      },
    };
  },
  { name: 'ImageDiffPreview' },
);
export { useStyles as useImageDiffPreviewStyles };

export interface ImageDiffPreviewProps {
  imageDiffResult: ImageDiffResult;
  activeTab?: 'newScreenshot' | 'imageDiff';
}

const ImageDiffPreview: React.FC<ImageDiffPreviewProps> = (props) => {
  const { imageDiffResult, activeTab } = props;

  const shouldShowDiff =
    activeTab === 'imageDiff' || imageDiffResult.error !== undefined;

  const [value, setValue] = React.useState(shouldShowDiff ? 1 : 0);

  const [showDiff, setShowDiff] = React.useState(shouldShowDiff);

  const classes = useStyles();

  const currentImage =
    imageDiffResult.pass || !showDiff
      ? imageDiffResult.newScreenshot
      : imageDiffResult.imgSrcString;

  const error = getImageDiffMessages(imageDiffResult);

  const toggleScreenshotDiff = useCallback(
    (_event: React.ChangeEvent<unknown>, newValue: number) => {
      setValue(newValue);
      setShowDiff(!showDiff);
    },
    [showDiff],
  );

  return (
    <div className={classes.root}>
      {!imageDiffResult.pass && (
        <>
          <Tabs
            textColor="primary"
            value={value}
            variant="fullWidth"
            onChange={toggleScreenshotDiff}
            indicatorColor="primary"
          >
            <Tab label="New screen shot" />
            <Tab label="Screenshot image diff" />
          </Tabs>
          <Divider />
        </>
      )}
      {error && value === 1 && (
        <Alert severity="error">
          {error.split('\n').map((x, i) => {
            return <div key={i}>{x}</div>;
          })}
        </Alert>
      )}
      <div className={classes.preview}>
        <ImagePreview
          imgSrcString={currentImage}
          diffDirection={imageDiffResult.diffDirection}
        />
      </div>
    </div>
  );
};

ImageDiffPreview.displayName = 'ImageDiffPreview';

export { ImageDiffPreview };
