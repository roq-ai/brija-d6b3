import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getGithubStarById, updateGithubStarById } from 'apiSdk/github-stars';
import { Error } from 'components/error';
import { githubStarValidationSchema } from 'validationSchema/github-stars';
import { GithubStarInterface } from 'interfaces/github-star';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { RepositoryInterface } from 'interfaces/repository';
import { getRepositories } from 'apiSdk/repositories';

function GithubStarEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<GithubStarInterface>(
    () => (id ? `/github-stars/${id}` : null),
    () => getGithubStarById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: GithubStarInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateGithubStarById(id, values);
      mutate(updated);
      resetForm();
      router.push('/github-stars');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<GithubStarInterface>({
    initialValues: data,
    validationSchema: githubStarValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Github Star
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="date" mb="4">
              <FormLabel>Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.date ? new Date(formik.values?.date) : null}
                  onChange={(value: Date) => formik.setFieldValue('date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="star_count" mb="4" isInvalid={!!formik.errors?.star_count}>
              <FormLabel>Star Count</FormLabel>
              <NumberInput
                name="star_count"
                value={formik.values?.star_count}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('star_count', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.star_count && <FormErrorMessage>{formik.errors?.star_count}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<RepositoryInterface>
              formik={formik}
              name={'repository_id'}
              label={'Select Repository'}
              placeholder={'Select Repository'}
              fetcher={getRepositories}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'github_star',
    operation: AccessOperationEnum.UPDATE,
  }),
)(GithubStarEditPage);
