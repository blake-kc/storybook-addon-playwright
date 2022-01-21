import React, { memo } from 'react';
import { BrowserTypes } from '../../typings';
import { Firefox, Browser, Chrome, Webkit } from '../../icons';
import { SvgIconProps } from '@mui/material';

export interface BrowserIconProps extends SvgIconProps {
  browserType: BrowserTypes;
}

const BrowserIcon: React.FC<BrowserIconProps> = memo((props) => {
  const { browserType, ...rest } = props;

  switch (browserType) {
    case 'chromium':
      return <Chrome {...rest} />;
    case 'firefox':
      return <Firefox {...rest} />;
    case 'webkit':
      return <Webkit {...rest} />;
    default:
      return <Browser {...rest} />;
  }
});

BrowserIcon.displayName = 'BrowserIcon';

export { BrowserIcon };
