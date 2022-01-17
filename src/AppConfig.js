/**
 * Scheduler config file
 */
import moment from "moment";

const schedulerConfig = {
    flex: '1 1 50%',
    tree: true,
    resourceStore: {
        transformFlatData: true,
        tree: true
    },
    eventDragFeature: {
        constrainDragToResource: true
    },

    crudManager: {
        autoSync: true,
        autoLoad: true,
        transport: {
            load: {
                url: 'http://172.31.226.249:5000/post/info'
            },
            sync: {
                url: 'http://172.31.226.249:5000/post/info',
                // specify Content-Type for requests
                headers: {
                    'Content-Type': 'application/json'
                },
            },
        },
        // This config enables response validation and dumping of found errors to the browser console.
        // It's meant to be used as a development stage helper only so please set it to false for production systems.
        validateResponse: true,
    },


    // eventStyle: 'colored',
    // eventColor: null,
    columns: [
        {
            type: 'tree',
            text: 'Name',
            width: 200,
            field: 'name'
        },
        {
            type: "aggregate",
            text: 'Uren',
            field: 'hours',
            width: 140,
            renderer: (data, x, y) => {
                if (data.record.events.length > 0) {
                    let tot = 0

                    for (let e of data.record.events) {
                        const a = moment(e.data.startDate)
                        const b = moment(e.data.endDate)


                        tot += b.diff(a, "hours", true)
                    }

                    return data.record.data.hours - tot
                }
                if (data.record.children?.length > 0) {
                    return null
                }

                return data.record.data.hours
            },
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
                    items: ['tekenwerk', "ibs"]
                },
                eventEmployeeField: {
                    type: 'combo',
                    label: 'Werknemer',
                    name: 'employeeID',
                    weight: 130,
                    items: ["Joris", "Johan"]

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

    // eventStyle: 'colored',
    // eventColor: null,
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
                resourceField: {
                    type: 'displayField',
                    name: 'role',
                    weight: 100,
                    listeners: {
                        change: ({value, source}) => {
                            console.log(value, source)
                        },
                    },

                },

                // Using this ref hooks dynamic toggling of fields per eventType up
                eventNewTypeField: {
                    type: 'combo',
                    name: 'phase',
                    label: 'Fase',
                    // Provided items start at 100, and go up in 100s, so insert after first one
                    weight: 110,
                    items: ['Tekenwerk', 'ibs', "niet productief"],
                    listeners: {
                        change: ({value, source}) => {
                            const editor = source.parent;
                            editor.widgetMap.eventProjectField.disabled = value === "niet productief";
                        },
                    }

                },
                eventProjectField: {
                    type: 'combo',
                    label: 'Project',
                    name: 'projectID',
                    editable: false,
                    weight: 130,
                    items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

                },
                linkField: {
                    type: 'displayField',
                    label: 'role',
                    name: 'role',
                },

            }
        }
    },
    listeners: {
        beforeEventEditShow({editor, eventRecord}) {
            editor.widgetMap.linkField.value = eventRecord.data.phase
            // const
            //     equipmentCombo = editor.widgetMap.equipment,
            //     volumeField = editor.widgetMap.volume;
            //
            // // update data in combo list
            // equipmentCombo.items = this.equipmentStore.getRange();
            // // update field visibility state
            // volumeField.hidden = !eventRecord.hasVolume;
        }
    }
};

export {schedulerConfig, scheduler2Config};