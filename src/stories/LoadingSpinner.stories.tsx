/**
 * LoadingSpinner Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from '../components/LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Loading text to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomText: Story = {
  args: {
    text: 'Loading your data...',
  },
};

export const LongText: Story = {
  args: {
    text: 'Please wait while we fetch your documents from the database...',
  },
};
