/**
 * Scheduler config file
 */
import {DateHelper} from '@bryntum/scheduler/scheduler.umd';

const schedulerConfig = {
    flex: '1 1 50%',
    tree: true,
    resourceStore: {
        transformFlatData: true,
        tree: true
    },

    eventStyle: 'colored',
    eventColor: null,
    columns: [
        {
            type: 'tree',
            text: 'Name',
            width: 200,
            field: 'name'
        },
        {
            text: 'Uren',
            field: 'hours',
            width: 140,
        }
    ],
    filterBarFeature: true,
    stripeFeature: true,
    timeRangesFeature: true,
    treeFeature: true,

    barMargin: 5,
    rowHeight: 30,

    startDate: new Date(2017, 1, 7, 8),
    endDate: new Date(2017, 1, 7, 18),
    viewPreset: 'hourAndDay',


    features: {
        eventEdit: {
            // Uncomment to make event editor readonly from the start
            // readOnly : true,
            // Add items to the event editor
            items: {
                // resourceField : resourceComboConfig,

                // Using this ref hooks dynamic toggling of fields per eventType up
                eventTypeField: {
                    type: 'combo',
                    name: 'phase',
                    label: 'Fase',
                    // Provided items start at 100, and go up in 100s, so insert after first one
                    weight: 110,
                    items: ['Tekenwerk']
                },
                eventEmployeeField: {
                    type: 'combo',
                    label: 'Werknemer',
                    name: 'employeeID',
                    editable: false,
                    weight: 130,
                    items: [0]

                },
                linkField: {
                    type: 'displayfield',
                    label: 'Link',
                    name: 'id',
                    weight: 600,
                }
            }
        }
    },
};

const scheduler2Config = {
    flex: '1 1 50%',

    eventStyle: 'colored',
    eventColor: null,
    columns: [
        {
            type: 'resourceInfo',
            text: 'Staff',
            width: 200
        },
        {
            text: 'Role',
            field: 'role',
            width: 140,
            editor: {
                type: 'combo',
                items: ['in bedrijf stellen', 'Engineer', 'tekenwerk'],
                editable: false,
                pickerWidth: 140
            }
        }
    ],
    filterBarFeature: true,
    stripeFeature: true,
    timeRangesFeature: true,

    barMargin: 5,
    rowHeight: 40,

    startDate: new Date(2017, 1, 7, 8),
    endDate: new Date(2017, 1, 7, 18),
    viewPreset: 'hourAndDay',

    // // Specialized body template with header and footer
    // eventBodyTemplate: data => `
    //     <div class="b-sch-event-header">${data.headerText}</div>
    //     <div class="b-sch-event-footer">${data.footerText}</div>
    // `,
    //
    // eventRenderer({eventRecord, resourceRecord, renderData}) {
    //     renderData.style = 'background-color:' + resourceRecord.color;
    //
    //     return {
    //         headerText: DateHelper.format(eventRecord.startDate, this.displayDateFormat),
    //         footerText: eventRecord.name || ''
    //     };
    // },
    features: {

            eventEdit: {
                // Uncomment to make event editor readonly from the start
                // readOnly : true,
                // Add items to the event editor
                items: {
                    // resourceField : resourceComboConfig,

                    // Using this ref hooks dynamic toggling of fields per eventType up
                    eventNewTypeField: {
                        type: 'combo',
                        name: 'phase',
                        label: 'Fase',
                        // Provided items start at 100, and go up in 100s, so insert after first one
                        weight: 110,
                        items: ['Tekenwerk','ibs']
                    },
                    eventProjectField: {
                        type: 'combo',
                        label: 'Project',
                        name: 'projectID',
                        editable: false,
                        weight: 130,
                        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

                    },
                    // linkField: {
                    //     type: 'displayfield',
                    //     label: 'Rool',
                    //     name: 'role',
                    //     weight: 600,
                    // }
                }
            }
        },
};

export {schedulerConfig, scheduler2Config};