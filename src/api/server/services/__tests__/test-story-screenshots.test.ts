import { testStoryScreenshot } from '../test-story-screenshots';

jest.mock('../make-screenshot');
jest.mock('../../utils/load-story-data');
jest.mock('../diff-image-to-screenshot');

describe('testStoryScreenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have diff', async () => {
    const result = await testStoryScreenshot(
      { fileName: 'story.ts', storyId: 'story-id' },
      'localhost',
    );
    expect(result).toStrictEqual([
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotHash: 'hash',
        storyId: 'story-id',
      },
      {
        added: true,
        newScreenshot: 'base64-image',
        screenshotHash: 'hash-2',
        storyId: 'story-id',
      },
    ]);
  });

  it('should throw if story not found', async () => {
    await expect(
      testStoryScreenshot(
        { fileName: 'story.ts', storyId: 'story-id-2' },
        'localhost',
      ),
    ).rejects.toThrowError('Unable to find story screenshots');
  });
});