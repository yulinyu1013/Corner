import React from 'react';
import Profile from '../components/Profile';
import {act, render, fireEvent, cleanup, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const fetcherHelpers = require('../fetchers/profile');
jest.mock('../fetchers/profile');

describe('UI', () => {
  it('profile page', () => {
    render(<Profile/>);
    const linkElement = screen.getByTestId('userProfile');
    expect(linkElement).toBeInTheDocument();
  })

  it('update page', () => {
    render(<Profile/>);
    const settingButton = screen.getByTestId('userSetting');
    fireEvent.click(settingButton);
    const linkElement = screen.getByTestId('updateUserProfile');
    expect(linkElement).toBeInTheDocument();
  })
})

describe('display current user', () => {
  it('displays user', () => {
    const mockUser = {
      name: 'Kevin Doe', bio: 'test bio', email: 'test@gmail.com', password: 'Aa123456', avatar: null,
    };
    render(<Profile currentUser={mockUser}/>);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
  })
})

describe('update current user', () => {
  // it('update a user', async () => {
  //   const mockUser = {
  //     name: 'KevinDoe', bio: 'test bio', email: 'test@gmail.com', password: 'Aa1234567', avatar: null,
  //   };
  //   const mockUpdatedUser = {
  //     name: 'KevinDoe2', bio: 'test bio2', email: 'test2@gmail.com', password: '2Aa1234567', avatar: null,
  //   };

  //   jest.spyOn(fetcherHelpers, 'updateProfile').mockResolvedValue({ data: mockUpdatedUser });

  //   act(() => {
  //     render(<Profile currentUser={mockUser}/>);
  //     fireEvent.click(screen.getByText('Setting'));
  //   })
  //   userEvent.clear(screen.queryAllByTestId('updateUserInput')[0]);
  //   userEvent.clear(screen.queryAllByTestId('updateUserInput')[1]);
  //   userEvent.clear(screen.queryAllByTestId('updateUserInput')[2]);
  //   userEvent.clear(screen.queryAllByTestId('updateUserInput')[3]);
  //   userEvent.clear(screen.queryAllByTestId('updateUserInput')[4]);
  //   userEvent.type(screen.queryAllByTestId('updateUserInput')[0], mockUpdatedUser.name);
  //   userEvent.type(screen.queryAllByTestId('updateUserInput')[1], mockUpdatedUser.bio);
  //   userEvent.type(screen.queryAllByTestId('updateUserInput')[2], mockUpdatedUser.email);
  //   userEvent.type(screen.queryAllByTestId('updateUserInput')[3], mockUpdatedUser.password);
  //   userEvent.type(screen.queryAllByTestId('updateUserInput')[4], mockUpdatedUser.password);
  //   act(() => {
  //     fireEvent.click(screen.getByText('Update'));
  //   })

  //   await waitFor(() => expect(screen.getByText(mockUpdatedUser.name)).toBeInTheDocument);
  //   await waitFor(() => expect(screen.getByText(mockUpdatedUser.bio)).toBeInTheDocument); 
  // })

  it('fails to update a user', async () => {
    const mockUser = {
      name: 'KevinDoe', bio: 'test bio', email: 'test@gmail.com', password: 'Aa1234567', avatar: null,
    };
    const mockUpdatedUser = {
      name: 'KevinDoe2', bio: 'test bio2', email: 'test2@gmail.com', password: '2Aa1234567', avatar: null,
    };

    jest.spyOn(fetcherHelpers, 'updateProfile').mockRejectedValue('fail to update.');

    act(() => {
      render(<Profile currentUser={mockUser}/>);
      fireEvent.click(screen.getByText('Setting'));
    })
    userEvent.clear(screen.queryAllByTestId('updateUserInput')[0]);
    userEvent.clear(screen.queryAllByTestId('updateUserInput')[1]);
    userEvent.clear(screen.queryAllByTestId('updateUserInput')[2]);
    userEvent.clear(screen.queryAllByTestId('updateUserInput')[3]);
    userEvent.clear(screen.queryAllByTestId('updateUserInput')[4]);
    userEvent.type(screen.queryAllByTestId('updateUserInput')[0], mockUpdatedUser.name);
    userEvent.type(screen.queryAllByTestId('updateUserInput')[1], mockUpdatedUser.bio);
    userEvent.type(screen.queryAllByTestId('updateUserInput')[2], mockUpdatedUser.email);
    userEvent.type(screen.queryAllByTestId('updateUserInput')[3], mockUpdatedUser.password);
    userEvent.type(screen.queryAllByTestId('updateUserInput')[4], mockUpdatedUser.password);
    act(() => {
      fireEvent.click(screen.getByText('Update'));
    }) 
  })

  it('can cancel update', () => {
    const mockUser = {
      name: 'Kevin Doe', bio: 'test bio', email: 'test@gmail.com', password: 'Aa123456', avatar: null,
    };
    
    act(() => {
      render(<Profile currentUser={mockUser}/>);
      fireEvent.click(screen.getByText('Setting'));
    })
    userEvent.type(screen.queryAllByTestId('updateUserInput')[0], 'testName');
    act(() => {
      fireEvent.click(screen.getByText('Cancel'));
    })
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
  })
})