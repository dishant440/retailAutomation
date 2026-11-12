import React from 'react';
import {Button} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import _ from "lodash";


const LubeFilters = (props) => {

    const {loading, fetchData, startDate, endDate, activeFilters, setActiveFilters} = props;


    const filterSubmit = (formData, resetForm) => {

        Object.keys(formData).forEach((v) => {
            if (typeof formData[v] === 'object') {
                formData[v] = _.pickBy(formData[v]);
                formData[v] = Object.keys(formData[v]);
            }
        });

        formData.startDate = startDate;
        formData.endDate = endDate;

        setActiveFilters(formData);
        fetchData(formData).catch(e => console.error(e));
    };

    return <>
        <Form onValidSubmit={filterSubmit} loading={loading} >
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Lube Type</label>
                    {activeFilters && activeFilters.lube && activeFilters.lube.includes('2T Mix') ?
                        <Form.Checkbox label='2T Mix' name={'lube[2T Mix]'} defaultChecked/> :
                        <Form.Checkbox label='2T Mix' name={'lube[2T Mix]'}/>
                    }
                    {activeFilters && activeFilters.lube && activeFilters.lube.includes('3T Mix') ?
                        <Form.Checkbox label='3T Mix' name={'lube[3T Mix]'} defaultChecked/> :
                        <Form.Checkbox label='3T Mix' name={'lube[3T Mix]'}/>
                    }
                </Form.Field>
            </Form.Group>
            <br />
            <Button type='submit' color={'green'}>Apply Filter</Button>
        </Form>
    </>
};

export default LubeFilters;