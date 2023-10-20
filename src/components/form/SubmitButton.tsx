import React, {FC} from 'react';
import {useFormikContext} from 'formik';

import AppButton from '@ui/AppButton';

interface Props {
  title: string;
}

const SubmitButton: FC<Props> = props => {
  const {title} = props;
  const {handleSubmit, isSubmitting} = useFormikContext();
  return (
    <AppButton
      busy={isSubmitting}
      title={title}
      onPress={() => handleSubmit()}
    />
  );
};

export default SubmitButton;
