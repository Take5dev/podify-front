import React, {ReactNode} from 'react';
import {Formik, FormikHelpers} from 'formik';

interface Props<T> {
  enableReinitialize?: boolean;
  initialValues: any;
  validationSchema: any;
  onSubmit(values: T, formikHelpers: FormikHelpers<T>): void;
  children: ReactNode;
}

const Form = <T extends object>(props: Props<T>) => {
  return (
    <Formik
      enableReinitialize={props.enableReinitialize}
      initialValues={props.initialValues}
      validationSchema={props.validationSchema}
      onSubmit={props.onSubmit}>
      {props.children}
    </Formik>
  );
};

export default Form;
