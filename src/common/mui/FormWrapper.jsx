import { Form, Formik } from 'formik';

const FormWrapper = ({ initialValues, validationSchema, onSubmit, children, ...props }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            {...props}
        >
            {(formikProps) => (
                <Form style={{ width: '100%' }}>
                    {typeof children === 'function' ? children(formikProps) : children}
                </Form>
            )}
        </Formik>
    );
};

export default FormWrapper;
