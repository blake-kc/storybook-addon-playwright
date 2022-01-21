import React, { useCallback, useState, useEffect } from 'react';
import { useBrowserOptions, BrowsersOption } from '../../hooks/';
import { OptionPopover } from './OptionPopover';
import SettingIcon from '@mui/icons-material/Settings';
import { MemoizedSchemaFormLoader, DeviceList } from '../common';

export interface BrowserOptionsProps {
  browserType: keyof BrowsersOption;
}

const BrowserOptions: React.FC<BrowserOptionsProps> = ({ browserType }) => {
  const {
    setBrowserOptions,
    browserOptions,
    hasOption: isActive,
    setBrowserDeviceOptions,
  } = useBrowserOptions(browserType);

  const [reset, setReset] = useState(false);

  const handleSave = useCallback(
    (data) => {
      setBrowserOptions(browserType, data);
    },
    [browserType, setBrowserOptions],
  );

  const handleDeviceSelection = useCallback(
    (deviceName) => {
      setBrowserDeviceOptions(browserType, deviceName);
      setReset(true);
    },
    [browserType, setBrowserDeviceOptions],
  );

  useEffect(() => {
    if (reset) setReset(false);
  }, [reset]);

  if (!browserOptions) return null;

  return (
    <OptionPopover title="Browser Options" Icon={SettingIcon} active={isActive}>
      {!reset && (
        <MemoizedSchemaFormLoader
          onSave={handleSave}
          schemaName={'browser-options'}
          defaultData={browserOptions && browserOptions[browserType]}
          FooterComponent={
            <DeviceList onDeviceSelect={handleDeviceSelection} />
          }
        />
      )}
    </OptionPopover>
  );
};

BrowserOptions.displayName = 'BrowserOptions';

export { BrowserOptions };
