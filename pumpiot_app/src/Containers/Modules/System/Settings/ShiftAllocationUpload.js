import React from "react";
import {
    Card, Button
} from "semantic-ui-react";
import {Form, Input} from "formsy-semantic-ui-react";
import {useToasts} from "react-toast-notifications";

const ShiftAllocationUpload = () => {

    const [loading, setLoading] = React.useState(false);
    const {addToast} = useToasts();


    const save = (value, reset) => {
        setLoading(true);

        addToast("Shift Schedule has been uploaded.", {appearance: 'success', autoDismiss: true});

        setLoading(false);
        reset();

    };

    return <>
        <Form onValidSubmit={save} loading={loading}>
            <Card fluid>
                <Card.Content>
                    <Card.Header>Shift Allocation</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Card.Description>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <label>Upload Shift Allocation File</label>
                                <Input type={'file'} name={'shfitfile'} required
                                       accept=".xlsx, .xls, .csv"
                                       placeholder={'Upload Shift Allocation File'}/>
                            </Form.Field>
                        </Form.Group>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button type={'submit'} color={'green'}>Upload</Button>
                </Card.Content>
            </Card>
        </Form>
    </>
}

export default ShiftAllocationUpload;