import { ScreenshotListItemMenu } from '../ScreenshotListItemMenu';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../__test_data__/get-screenshot-date';
import EditIcon from '@mui/icons-material/Edit';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ScreenshotUpdate } from '../ScreenshotUpdate';
import Compare from '@mui/icons-material/Compare';
import { ScreenshotDelete } from '../ScreenshotDelete';
import { ScreenshotInfo } from '../ScreenshotInfo';

const onDeleteMock = jest.fn();

describe('ScreenshotListItemMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();

    const delComp = wrapper.find(ScreenshotDelete);
    expect(delComp).toHaveLength(1);

    const InfComp = wrapper.find(ScreenshotInfo);
    expect(InfComp).toHaveLength(1);
  });

  it('should have edit icon', () => {
    const editMock = jest.fn();

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onEditClick={editMock}
        onDelete={onDeleteMock}
        enableEditScreenshot
      />,
    );
    const editIcon = wrapper.find(EditIcon);

    expect(editIcon).toHaveLength(1);

    editIcon
      .parent()
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(editMock).toHaveBeenCalledTimes(1);
  });

  it('should render load screenshot setting into storybook icon', () => {
    const editMock = jest.fn();

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
        onLoadSettingClick={editMock}
        enableLoadSetting
      />,
    );
    const icon = wrapper.find(SystemUpdateAltIcon);

    expect(icon).toHaveLength(1);

    icon
      .parent()
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(editMock).toHaveBeenCalledTimes(1);
  });

  it('should render update component', () => {
    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
        enableUpdate
      />,
    );
    const screenshotUpdate = wrapper.find(ScreenshotUpdate);

    expect(screenshotUpdate).toHaveLength(1);
  });

  it('should render image diff icon', () => {
    const funcMock = jest.fn();

    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
        enableImageDiff
        onRunImageDiff={funcMock}
      />,
    );

    const icon = wrapper.find(Compare);

    expect(icon).toHaveLength(1);

    icon
      .parent()
      .props()
      .onClick({} as React.MouseEvent<SVGSVGElement, MouseEvent>);

    expect(funcMock).toHaveBeenCalledTimes(1);
  });

  it('should call on delete', () => {
    const wrapper = shallow(
      <ScreenshotListItemMenu
        screenshot={getScreenshotDate()}
        onDelete={onDeleteMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();

    const delComp = wrapper.find(ScreenshotDelete);

    delComp.props().onDelete();

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });
});
