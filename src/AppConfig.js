/**
 * Scheduler config file
 */
import {DateHelper} from '@bryntum/scheduler/scheduler.umd';

const schedulerConfig = {
    flex: '1 1 50%',
    tree: true,
    transformFlatData: true,

    eventStyle: 'colored',
    eventColor: null,
    columns: [
        {
            type: 'tree',
            text: 'Name',
            width: 340,
            field: 'name'
        }
    ],
    filterBarFeature: true,
    stripeFeature: true,
    timeRangesFeature: true,
    features: {
        tree: true,
    },

    barMargin: 5,
    rowHeight: 55,

    startDate: new Date(2017, 1, 7, 8),
    endDate: new Date(2017, 1, 7, 18),
    viewPreset: 'hourAndDay',

    data: [
        {id: 1, name: 'ABBA'},
        {id: 2, name: 'Agnetha', parentId: 1},
        {id: 3, name: 'Bjorn', parentId: 1},
        {id: 4, name: 'Benny', parentId: 1},
        {id: 5, name: 'Anni-Frid', parentId: 1}
    ],

    // Specialized body template with header and footer
    eventBodyTemplate: data => `
        <div class="b-sch-event-header">${data.headerText}</div>
        <div class="b-sch-event-footer">${data.footerText}</div>
    `,

    eventRenderer({eventRecord, resourceRecord, renderData}) {
        renderData.style = 'background-color:' + resourceRecord.color;

        return {
            headerText: DateHelper.format(eventRecord.startDate, this.displayDateFormat),
            footerText: eventRecord.name || ''
        };
    },
};

const findConfig = {
    placeholder: 'Find tasks by name',
    keyStrokeChangeDelay: 80,
    clearable: true,
    width: '12.5em',
    triggers: {
        filter: {
            align: 'start',
            cls: 'b-fa b-fa-filter'
        }
    }
};

const highlightConfig = {
    placeholder: 'Highlight tasks',
    keyStrokeChangeDelay: 80,
    clearable: true,
    width: '12.5em',
    triggers: {
        filter: {
            align: 'start',
            cls: 'b-fa b-fa-search'
        }
    }
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
    eventEditFeature: {
        items: {
            locationField: {
                type: 'text',
                name: 'location',
                label: 'Location',
                dataset: {eventType: 'Meeting'},
                weight: 200
            }
        }
    },

    barMargin: 5,
    rowHeight: 55,

    startDate: new Date(2017, 1, 7, 8),
    endDate: new Date(2017, 1, 7, 18),
    viewPreset: 'hourAndDay',

    crudManager: {
        autoLoad: true,
        transport: {
            load: {
                url: 'data/employeeData.json'
            }
        },
        // This config enables response validation and dumping of found errors to the browser console.
        // It's meant to be used as a development stage helper only so please set it to false for production systems.
        validateResponse: true
    },

    // Specialized body template with header and footer
    eventBodyTemplate: data => `
        <div class="b-sch-event-header">${data.headerText}</div>
        <div class="b-sch-event-footer">${data.footerText}</div>
    `,

    eventRenderer({eventRecord, resourceRecord, renderData}) {
        renderData.style = 'background-color:' + resourceRecord.color;

        return {
            headerText: DateHelper.format(eventRecord.startDate, this.displayDateFormat),
            footerText: eventRecord.name || ''
        };
    },
};

export {schedulerConfig, scheduler2Config, findConfig, highlightConfig};
