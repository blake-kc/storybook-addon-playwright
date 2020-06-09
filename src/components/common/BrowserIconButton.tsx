import React, { SFC, useCallback } from 'react';
import { BrowserTypes } from '../../typings';
import { IconButton } from '@storybook/components';
import { BrowserIcon } from '../common/BrowserIcon';

export interface BrowserIconProps {
  browserType: BrowserTypes;
  onClick: (browserType: BrowserTypes) => void;
  active: boolean;
}

const BrowserIconButton: SFC<BrowserIconProps> = (props) => {
  const { browserType, onClick, active } = props;

  const handleClick = useCallback(() => {
    onClick(browserType);
  }, [browserType, onClick]);

  return (
    <IconButton onClick={handleClick} active={active}>
      <BrowserIcon browserType={browserType} />
    </IconButton>
  );
};

BrowserIconButton.displayName = 'BrowserIconButton';

export { BrowserIconButton };