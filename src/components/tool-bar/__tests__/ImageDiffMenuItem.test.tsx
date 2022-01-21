import { getStoryData } from '../../../../__test_data__/story-data';
import { ImageDiffMenuItem } from '../ImageDiffMenuItem';
import { shallow } from 'enzyme';
import React from 'react';
import { MenuItem } from '@mui/material';
import { useStorybookApi } from '@storybook/api';

describe('ImageDiffMenuItem', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ImageDiffMenuItem imageDiff={{ pass: true }} onClick={jest.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should load story and call callback', () => {
    const onClickMock = jest.fn();
    const selectStoryMock = jest.fn();
    const setSelectedPanelMock = jest.fn();

    (useStorybookApi as jest.Mock).mockImplementationOnce(() => ({
      getData: () => {
        return getStoryData();
      },
      selectStory: selectStoryMock,
      setSelectedPanel: setSelectedPanelMock,
    }));

    const wrapper = shallow(
      <ImageDiffMenuItem
        imageDiff={{ pass: true, storyId: 'story-id' }}
        onClick={onClickMock}
      />,
    );

    wrapper
      .find(MenuItem)
      .props()
      .onClick({} as React.MouseEvent<HTMLLIElement, MouseEvent>);

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(selectStoryMock).toHaveBeenCalledWith('story-id');
    expect(setSelectedPanelMock).toHaveBeenCalledWith(
      'playwright-addon/screenshot-panel',
    );
  });

  it('should show error if unable to find story', () => {
    const onClickMock = jest.fn();
    const selectStoryMock = jest.fn();
    const setSelectedPanelMock = jest.fn();

    (useStorybookApi as jest.Mock).mockImplementationOnce(() => ({
      getData: () => {
        return undefined;
      },
      selectStory: selectStoryMock,
      setSelectedPanel: setSelectedPanelMock,
    }));

    const wrapper = shallow(
      <ImageDiffMenuItem
        imageDiff={{ pass: true, storyId: 'story-id' }}
        onClick={onClickMock}
      />,
    );

    expect(wrapper.find(MenuItem).props().onClick).toBeUndefined();

    expect(wrapper.find(MenuItem).find('b').first().text()).toBe(
      'Unable to locate story!',
    );
  });
});
