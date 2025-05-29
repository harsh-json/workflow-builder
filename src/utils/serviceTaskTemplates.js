export const serviceTaskTemplates = {
    UPDATEENTITYEXECUTOR: {
        type: "serviceTask",
        executor: "UPDATEENTITYEXECUTOR",
        parameters: {
            resource: "case",
            entityData: {
                data: {
                    id: "${caseId}",
                    csae_status_id: null,
                },
                meta_data: {
                    embedded: ["case_status_id"],
                    entity_name: "case"
                }
            },
            resource_id: "${caseId}"
        },
        sequential: false,
        listener: [],
        group_name: null,
        identifier: null,
        resourceId: null,
        description: null,
        skipExpression: null,
        loopCardinality: 0
    },
    GETENTITYDATAEXECUTOR: {
        type: "serviceTask",
        executor: "GETENTITYDATAEXECUTOR",
        parameters: {
            criteria: {
                select: [],
                entity_name: "case"
            },
            resource_id: "${caseId}",
            outputVariable: "caseObj"
        },
        sequential: false,
        listener: [],
        group_name: null,
        identifier: null,
        resourceId: null,
        description: "Fetch data",
        skipExpression: null,
        loopCardinality: 0
    },
    CREATEENTITYEXECUTOR: {
        type: "serviceTask",
        executor: "CREATEENTITYEXECUTOR",
        parameters: {
            resource: "entity",
            entityData: {
                data: {
                    case_id: "${caseId}"
                },
                meta_data: {
                    embedded: ["case_id"],
                    entity_id: null,
                    entity_name: "entity"
                }
            },
            outputVariable: "outputVariable",
        },
        sequential: false,
        listener: [],
        group_name: null,
        identifier: null,
        resourceId: null,
        description: null,
        skipExpression: null,
        loopCardinality: 0
    },
    CREATEINSTANCEEXECUTOR: {
        type: "serviceTask",
        executor: "CREATEINSTANCEEXECUTOR",
        parameters: {
            outputVariable: "appealCase",
            processRequest: {
                flow_meta_data: {
                    process_definition_id: 64
                }
            },
            procedureRequest: {
                params: {
                    old_case_id: {
                        type: "LONGDATATYPE",
                        order: 1,
                        value: "${caseId}",
                        is_input_param: true
                    },
                    v_payer_rank_id: {
                        type: "LONGDATATYPE",
                        order: 2,
                        value: null,
                        is_input_param: true
                    },
                    new_case_id: {
                        type: "LONGDATATYPE",
                        order: 3,
                        value: null,
                        is_input_param: false
                    }
                },
                procedureName: "clone_appeal_from_pa_intake",
                primaryKeyName: "new_case_id"
            },
            processDefinitionId: 64
        },
        sequential: false,
        listener: [],
        group_name: null,
        identifier: null,
        resourceId: null,
        description: null,
        skipExpression: null,
        loopCardinality: 0
    }
};