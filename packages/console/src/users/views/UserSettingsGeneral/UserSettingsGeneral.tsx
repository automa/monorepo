import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { UserUpdateInput, userUpdateSchema } from '@automa/common';

import { getFragment } from 'gql';
import { Button, Flex, Input, toast, Typography } from 'shared';

import { ME_QUERY, ME_QUERY_FRAGMENT } from 'users';

import { UserSettingsGeneralProps } from './types';

import { USER_UPDATE_MUTATION } from './UserSettingsGeneral.queries';

const UserSettingsGeneral: React.FC<UserSettingsGeneralProps> = () => {
  const { data: fullData } = useQuery(ME_QUERY);

  const data = getFragment(ME_QUERY_FRAGMENT, fullData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: data?.me?.name,
      email: data?.me?.email,
    },
  });

  // TODO: Handle error
  const [userUpdate, { loading: mutationLoading, error }] = useMutation(
    USER_UPDATE_MUTATION,
    {
      onCompleted() {
        toast({
          title: 'Profile updated',
          variant: 'success',
        });
      },
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          id: cache.identify(data.userUpdate),
          fields: {
            name() {
              return data.userUpdate.name;
            },
            email() {
              return data.userUpdate.email;
            },
          },
        });
      },
    },
  );

  if (!data) return null;

  return (
    <>
      <Typography variant="title6">General</Typography>
      <form
        onSubmit={handleSubmit((data) =>
          userUpdate({
            variables: {
              input: data,
            },
          }),
        )}
        className="w-full"
      >
        <Flex fullWidth direction="column" className="mb-4 gap-2">
          <Input
            label="Name"
            error={errors.name?.message}
            input={{ ...register('name'), placeholder: 'John Smith' }}
          />
          <Input
            label="Email"
            error={errors.email?.message}
            input={{
              ...register('email'),
              placeholder: 'john@smith.com',
            }}
          />
        </Flex>
        <Button type="submit" disabled={mutationLoading}>
          Save
        </Button>
      </form>
    </>
  );
};

export default UserSettingsGeneral;
