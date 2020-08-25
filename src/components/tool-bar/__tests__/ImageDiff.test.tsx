import { ImageDiff } from '../ImageDiff';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { IconButton } from '@storybook/components';
import { useAppScreenshotImageDiff } from '../../../hooks/use-app-screenshot-imageDiff';
import { Snackbar } from '../../common';
import { useGlobalImageDiffResults } from '../../../hooks/use-global-imageDiff-results';
import { ImageDiffResult } from '../../../api/typings';
import { Menu, MenuItem } from '@material-ui/core';
import { ImageDiffMenuItem } from '../ImageDiffMenuItem';
import { mocked } from 'ts-jest/utils';
import { useGlobalScreenshotDispatch } from '../../../hooks';

jest.mock('../../../hooks/use-global-imageDiff-results.ts');
jest.mock('../../../hooks/use-app-screenshot-imageDiff.ts');
jest.mock('../../../hooks/use-global-screenshot-dispatch.ts');
jest.mock('../../../hooks/use-current-story-data');

const screenshotDispatchMock = jest.fn();
mocked(useGlobalScreenshotDispatch).mockImplementation(() => ({
  dispatch: screenshotDispatchMock,
}));

describe('ImageDiff', () => {
  const testStoryScreenShotsMock = jest.fn();

  const imageDiffResult = [
    {
      fileName: 'test.stories.playwright.json',
      pass: true,
      screenshotId: 'screenshot-id',
    },
  ] as ImageDiffResult[];

  (useAppScreenshotImageDiff as jest.Mock).mockImplementation(() => {
    return {
      testStoryScreenShots: testStoryScreenShotsMock,
    };
  });

  beforeEach(() => {
    (useGlobalImageDiffResults as jest.Mock).mockImplementation(() => {
      return { imageDiffResult: [] };
    });

    jest.clearAllMocks();
  });

  async function clickOnIconButton(
    wrapper: ShallowWrapper<
      unknown,
      Readonly<unknown>,
      React.Component<unknown, unknown, unknown>
    >,
  ) {
    await wrapper
      .find(IconButton)
      .props()
      .onClick({ currentTarget: { tagName: 'button' } } as never);
  }

  it('should render', () => {
    const wrapper = shallow(<ImageDiff />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show/hide menu with the list of story that failed image diff test', async () => {
    (useGlobalImageDiffResults as jest.Mock)
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      });

    const wrapper = shallow(<ImageDiff />);

    clickOnIconButton(wrapper);

    expect(wrapper.find(Menu)).toHaveLength(1);

    //should do nothing if anchor set, fixes
    clickOnIconButton(wrapper);

    expect(wrapper.find(Menu)).toHaveLength(1);
    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(0);
  });

  it('should run image diff and show/hide success if no image diff result returned', async () => {
    const wrapper = shallow(<ImageDiff />);

    testStoryScreenShotsMock.mockImplementationOnce((): ImageDiffResult[] => {
      return [];
    });

    await clickOnIconButton(wrapper);

    expect(testStoryScreenShotsMock).toHaveBeenCalledTimes(1);

    const snackbar = wrapper.find(Snackbar).last();

    expect(snackbar.props().open).toBeTruthy();

    snackbar.props().onClose();

    expect(wrapper.find(Snackbar).last().props().open).toBeFalsy();
  });

  it('should show menu', () => {
    (useGlobalImageDiffResults as jest.Mock).mockImplementationOnce(() => ({
      imageDiffResult: [
        {
          fileName: 'test.stories.playwright.json',
          pass: true,
          screenshotId: 'screenshot-id',
        },
      ] as ImageDiffResult[],
    }));
    const wrapper = shallow(<ImageDiff />);
    expect(wrapper.find(Menu)).toHaveLength(1);
  });

  it('should clear result', () => {
    (useGlobalImageDiffResults as jest.Mock)
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      });

    const wrapper = shallow(<ImageDiff />);

    clickOnIconButton(wrapper);

    expect(wrapper.find(Menu)).toHaveLength(1);

    const clearItem = wrapper.find(MenuItem).first();

    expect(clearItem.text()).toBe('Clear results');

    clearItem
      .props()
      .onClick({} as React.MouseEvent<HTMLLIElement, MouseEvent>);

    expect(wrapper.find(Menu)).toHaveLength(0);
  });

  it('should hide menu on item click', () => {
    (useGlobalImageDiffResults as jest.Mock)
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      });

    const wrapper = shallow(<ImageDiff />);

    clickOnIconButton(wrapper);

    expect(wrapper.find(Menu).props().anchorEl).not.toBe(null);

    wrapper.find(ImageDiffMenuItem).last().props().onClick();

    expect(wrapper.find(Menu).props().anchorEl).toBe(null);
  });

  it('should test story file', () => {
    const wrapper = shallow(<ImageDiff testCurrentStory={true} />);

    clickOnIconButton(wrapper);

    expect(testStoryScreenShotsMock).toHaveBeenCalledWith('./test.stories.tsx');
  });

  it('should remove only story file image diff', () => {
    (useGlobalImageDiffResults as jest.Mock)
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      })
      .mockImplementationOnce(() => {
        return { imageDiffResult };
      });

    const wrapper = shallow(<ImageDiff testCurrentStory={true} />);

    clickOnIconButton(wrapper);

    expect(wrapper.find(Menu)).toHaveLength(1);

    const clearItem = wrapper.find(MenuItem).first();

    expect(clearItem.text()).toBe('Clear results');

    clearItem
      .props()
      .onClick({} as React.MouseEvent<HTMLLIElement, MouseEvent>);

    expect(screenshotDispatchMock).toHaveBeenCalledWith({
      screenshotId: 'screenshot-id',
      type: 'removeImageDiffResult',
    });
  });
});
