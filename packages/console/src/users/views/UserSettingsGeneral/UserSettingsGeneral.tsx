import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { userUpdateSchema } from '@automa/common';

import { getFragment } from 'gql';
import { UserUpdateInput } from 'gql/graphql';
import { Button, Flex, Input, toast, Typography } from 'shared';

import { USER_AVATAR_FRAGMENT, USER_QUERY, USER_QUERY_FRAGMENT } from 'users';

import { USER_UPDATE_MUTATION } from './UserSettingsGeneral.queries';

const UserSettingsGeneral: React.FC = () => {
  const { data: fullData } = useQuery(USER_QUERY);

  const meData = getFragment(USER_QUERY_FRAGMENT, fullData)?.user;
  const data = getFragment(USER_AVATAR_FRAGMENT, meData);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    if (meData && data) {
      reset({
        name: data?.name,
        email: meData?.email,
      });
    }
  }, [meData, data, reset]);

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
        <Button type="submit" disabled={mutationLoading || !isDirty}>
          Save
        </Button>
      </form>
    </>
  );
};

export default UserSettingsGeneral;
