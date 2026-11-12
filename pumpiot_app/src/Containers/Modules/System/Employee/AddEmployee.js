import React from "react";
import {
    Card, Grid, Button
} from "semantic-ui-react";
import {Form, Input} from "formsy-semantic-ui-react";
import SystemLayout from './../SystemLayout';
import post from "../../../../functions/post";
import {useToasts} from "react-toast-notifications";

const AddEmployee = () => {

    const [loading, setLoading] = React.useState(false);
    const {addToast} = useToasts();

    const save = (formData, resetForm) => {
        setLoading(true);

        post('/employees/add', formData).then(() => {

            // reset the form!
            resetForm();
            setLoading(false);
            addToast("Employees added successfully.", {appearance: 'success', autoDismiss: true});

        }).catch(e => {
            setLoading(false);
            addToast("Failed to add. Please contact the administrator.", {appearance: 'error', autoDismiss: true});
            console.error(e);
        });
    };

    return <>
        <SystemLayout>
            <Form onValidSubmit={save} loading={loading}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>Add Employee</Card.Header>
                        <Card.Description>
                            <br/>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Employee ID (UNIQUE) *</label>
                                    <Input name={'id'} required validations={"minLength:2"}
                                           placeholder={'Employee ID *'}/>
                                </Form.Field>

                                <Form.Field>
                                    <label>Name *</label>
                                    <Input name={'name'} required validations={"minLength:2"} placeholder={'Name *'}/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths='equal'>

                                <Form.Field>
                                    <label>Mobile Number *</label>
                                    <Input name={'phone'} required validations={"minLength:10"}
                                           placeholder={'Mobile Number *'}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Gender.</label>
                                    <Input name={'sex'} placeholder={'Gender.'}/>
                                </Form.Field>
                            </Form.Group>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button type={'submit'} color={'green'}>Save Employee</Button>
                    </Card.Content>
                </Card>
                </Form>
        </SystemLayout>
    </>
}

export default AddEmployee;