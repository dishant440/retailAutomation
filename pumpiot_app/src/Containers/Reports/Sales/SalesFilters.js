import React from 'react';
import {Button} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import _ from "lodash";


const SalesFilters = (props) => {

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
        <Form onValidSubmit={filterSubmit} loading={loading} style={{minWidth: "450px"}}>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Fuel Type</label>
                    {activeFilters && activeFilters.fuel && activeFilters.fuel.includes('petrol') ?
                        <Form.Checkbox label='Petrol' name={'fuel[petrol]'} defaultChecked/> :
                        <Form.Checkbox label='Petrol' name={'fuel[petrol]'}/>
                    }
                    {activeFilters && activeFilters.fuel && activeFilters.fuel.includes('diesel') ?
                        <Form.Checkbox label='Diesel' name={'fuel[diesel]'} defaultChecked/> :
                        <Form.Checkbox label='Diesel' name={'fuel[diesel]'}/>
                    }
                    {activeFilters && activeFilters.fuel && activeFilters.fuel.includes('alpg') ?
                        <Form.Checkbox label='ALPG' name={'fuel[alpg]'} defaultChecked/> :
                        <Form.Checkbox label='ALPG' name={'fuel[alpg]'}/>
                    }
                </Form.Field>
                <Form.Field>
                    <label>Shifts</label>
                    {activeFilters && activeFilters.shift && activeFilters.shift.includes('A') ?
                        <Form.Checkbox label='A (06:01 to 14:00)' name={'shift[A]'} defaultChecked/> :
                        <Form.Checkbox label='A (06:01 to 14:00)' name={'shift[A]'}/>
                    }
                    {activeFilters && activeFilters.shift && activeFilters.shift.includes('B') ?
                        <Form.Checkbox label='B (14:01 to 22:00)' name={'shift[B]'} defaultChecked/> :
                        <Form.Checkbox label='B (14:01 to 22:00)' name={'shift[B]'}/>
                    }
                    {activeFilters && activeFilters.shift && activeFilters.shift.includes('C') ?
                        <Form.Checkbox label='C (22:01 to 06:00)' name={'shift[C]'} defaultChecked/> :
                        <Form.Checkbox label='C (22:01 to 06:00)' name={'shift[C]'}/>
                    }
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>MOP</label>
                    {activeFilters && activeFilters.mop && activeFilters.mop.includes('cash') ?
                        <Form.Checkbox label='Cash' name={'mop[cash]'} defaultChecked/> :
                        <Form.Checkbox label='Cash' name={'mop[cash]'}/>
                    }
                    {activeFilters && activeFilters.mop && activeFilters.mop.includes('credit') ?
                        <Form.Checkbox label='Credit Card' name={'mop[credit]'} defaultChecked/> :
                        <Form.Checkbox label='Credit Card' name={'mop[credit]'}/>
                    }
                    {activeFilters && activeFilters.mop && activeFilters.mop.includes('fleet') ?
                        <Form.Checkbox label='Fleet' name={'mop[fleet]'} defaultChecked/> :
                        <Form.Checkbox label='Fleet' name={'mop[fleet]'}/>
                    }
                </Form.Field>
                <Form.Field>
                    <label>Pump Test</label>
                    {activeFilters && activeFilters.pump_test ?
                        <Form.Checkbox label='Pump Test' name={'pump_test'} defaultChecked/> :
                        <Form.Checkbox label='Pump Test' name={'pump_test'}/>
                    }
                </Form.Field>
                <Form.Field>
                    <label>Own Use</label>
                    {activeFilters && activeFilters.own_use ?
                        <Form.Checkbox label='Own Use' name={'own_use'} defaultChecked/> :
                        <Form.Checkbox label='Own Use' name={'own_use'}/>
                    }
                </Form.Field>
            </Form.Group>
            <br />
            <Button type='submit' color={'green'}>Apply Filter</Button>
        </Form>
    </>
};

export default SalesFilters;