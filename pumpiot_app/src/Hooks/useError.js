import React, {useState} from "react";
import {Button, Modal} from 'semantic-ui-react';

export default function useError() {

    const [isError, setError] = useState(false);
    const [modal, setModal] = useState(true);

    const handleError = (input) => {
        if (typeof input.code !== "undefined" && input.code !== 0 && input.code !== 22) {
            setModal(true);

            return setError(<>
                <Modal size={'small'} open={modal}>
                    <Modal.Header>Quick Base Error.</Modal.Header>
                    <Modal.Content>
                        <p>We are sorry, we have received the following error.</p>
                        <p><strong>Action:</strong> {input.action}</p>
                        <p><strong>Error Code:</strong> {input.code}</p>
                        <p><strong>Error Text:</strong> {input.name}</p>
                        <p><strong>Error Details:</strong> {input.message}</p>
                        <br/>
                        <p>Please close or refresh this widow and try again. If the issue persists, please take a
                            screenshots
                            of this window and send it to the system administrator.</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive icon='checkmark' labelPosition='right' content='Exit' onClick={e => {
                            setModal(false);
                            setError(false); // clear up the previous display
                        }}/>
                    </Modal.Actions>
                </Modal>
            </>);
        }
    };

    return [
        isError,
        (error = true) => handleError(error)
    ]

}
