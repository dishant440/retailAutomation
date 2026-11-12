import React from 'react';
import {Button, Divider} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import _ from "lodash";


const NewSummaryDateFilters = (props) => {

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
                    <label>Fuel Type</label>
                    {activeFilters && activeFilters.fuel && activeFilters.fuel.includes('MS') ?
                        <Form.Checkbox label='MS' name={'fuel[MS]'} defaultChecked/> :
                        <Form.Checkbox label='MS' name={'fuel[MS]'}/>
                    }
                    {activeFilters && activeFilters.fuel && activeFilters.fuel.includes('HSD') ?
                        <Form.Checkbox label='HSD' name={'fuel[HSD]'} defaultChecked/> :
                        <Form.Checkbox label='HSD' name={'fuel[HSD]'}/>
                    }
                    {activeFilters && activeFilters.fuel && activeFilters.fuel.includes('ALPG') ?
                        <Form.Checkbox label='ALPG' name={'fuel[ALPG]'} defaultChecked/> :
                        <Form.Checkbox label='ALPG' name={'fuel[ALPG]'}/>
                    }
                </Form.Field>
            </Form.Group>
            <br />
            <Button type='submit' color={'green'}>Apply Filter</Button>
        </Form>
    </>
};

export default NewSummaryDateFilters;