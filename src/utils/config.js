export const config = {
    "global_variables": {
        "case_management": {
            "void": {
                "entity_id": "1311",
                "layout_id": "6658",
                "entity_name": "case_summary"
            },
            "close": {
                "entity_id": "1311",
                "layout_id": "6657",
                "entity_name": "case_summary"
            }
        },
        "config": {
            "case_id": "case_key",
            "case_status": "case_status_id",
            "case_status_name": "c_case_statuses",
            "overall_case_status": "overall_case_status"
        },
        "add_task": {
            "entity_id": "611",
            "layout_id": "461",
            "entity_name": "task_notes"
        },
        "entities": {
            "users": {
                "entity_id": "74",
                "entity_name": "users"
            },
            "task": {
                "entity_id": "62",
                "entity_name": "task"
            },
            "program": {
                "entity_id": "94",
                "entity_name": "programs"
            },
            "service": {
                "entity_id": "51",
                "entity_name": "services"
            },
            "document": {
                "entity_id": "96",
                "entity_name": "document"
            },
            "communication": {
                "entity_id": "59",
                "entity_name": "communication"
            },
            "case_documents": {
                "entity_id": "43",
                "entity_name": "case_documents"
            },
            "hcp_portal_entity": {
                "entity_id": "90",
                "layout_id": 742,
                "entity_name": "hcp_portal_entity",
                "lookup_name": "c_case"
            }
        },
        "config_fields": {
            "case": {
                "fax_received_date": "request_received_at"
            }
        },
        "entity_id": "32",
        "left_split": {
            "edit_layout_id": "84",
            "view_layout_id": "229"
        },
        "entity_name": "case",
        "stepper_config": {
            "action_buttons": {
                "missing_information": {
                    "group": [
                        "bvResearch",
                        "resultSummary"
                    ],
                    "signal": "missingInformation"
                }
            }
        },
        "sticky_summary": {
            "entity_id": "1311",
            "layout_id": "6413"
        },
        "missing_info_popup": {
            "entity_id": "53",
            "layout_id": "295",
            "entity_name": "case"
        },
        "inherited_variables": {
            "service_id": 1,
            "record_status": "ACTIVE",
            "case_status_id": 257,
            "success_popup_text": "This case is ready for Benefit Verification (BV)",
            "mi_popup_text": "You can either review the missing fields or if you proceed to MI, the case status will be updated to BV Missing Information",
            "success_popup_button_text": "Proceed to Benefit Verification"
        },
        "associated_variables": {
            "fax": {
                "entity_id": "59",
                "parent_entity": "communication"
            },
            "document": {
                "entity_id": "43",
                "parent_entity": "c_case_documents_c_cases"
            },
            "case_status": {
                "entity_id": "3",
                "parent_entity": "case_statuses"
            }
        }
    },
    "missing_info": {
        "next": "acknowledgeFaxDecisionPoint",
        "type": "subprocess",
        "steps": {
            "startMissingInfo": {
                "next": "updateMIPendingStatus",
                "type": "start",
                "stepId": "startMissingInfo",
                "listener": [],
                "group_name": null,
                "description": "Initiate the Benefit Verification Process"
            },
            "updateMIPendingStatus": {
                "next": "manualMissingInfoTask",
                "type": "serviceTask",
                "stepId": "updateMIPendingStatus",
                "executor": "UPDATEENTITYEXECUTOR",
                "listener": [],
                "group_name": null,
                "identifier": null,
                "parameters": {
                    "resource": "case",
                    "entityData": {
                        "data": {
                            "id": "${caseId}",
                            "case_status_id": 2
                        },
                        "meta_data": {
                            "embedded": [
                                "case_status_id"
                            ],
                            "entity_name": "case"
                        }
                    },
                    "resource_id": "${caseId}"
                },
                "resourceId": null,
                "sequential": false,
                "description": null,
                "skipExpression": null,
                "loopCardinality": 0
            },
            "manualMissingInfoTask": {
                "name": "Review MI",
                "next": "missingInfoParallelTasks",
                "type": "userTask",
                "owner": null,
                "stepId": "manualMissingInfoTask",
                "dueDate": "0",
                "formKey": null,
                "assignee": null,
                "listener": [],
                "priority": null,
                "group_name": "missingInfo",
                "identifier": {
                    "entity_id": "32",
                    "entity_name": "case",
                    "layout_info": {
                        "layout_id": "679",
                        "layout_type": "EDIT_MODE"
                    },
                    "ui_identifier": "ENTITY_LAYOUT",
                    "action_buttons": {
                        "edit": false,
                        "save": false,
                        "cancel": false,
                        "resend": false,
                        "preview": false,
                        "download": false,
                        "save_draft": false
                    }
                },
                "parameters": null,
                "resourceId": null,
                "sequential": false,
                "description": null,
                "preRequisite": null,
                "candidateUsers": [],
                "taskTemplateId": 4,
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "missingInfoParallelTasks": {
                "next": null,
                "type": "pRoute",
                "stepId": "missingInfoParallelTasks",
                "options": [
                    {
                        "next": "missingInfoValidation",
                        "condition": null
                    },
                    {
                        "next": "missingInfoRelaySplit",
                        "condition": null
                    }
                ],
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "missingInfoValidation": {
                "name": "Capture MI Details Received",
                "next": "missingInfoParallelTasksJoin",
                "type": "userTask",
                "owner": null,
                "stepId": "missingInfoValidation",
                "dueDate": "2",
                "formKey": null,
                "assignee": null,
                "listener": [],
                "priority": null,
                "group_name": "missingInfo",
                "identifier": {
                    "entity_id": "32",
                    "entity_name": "case",
                    "layout_info": {
                        "layout_id": "53",
                        "layout_type": "EDIT_MODE"
                    },
                    "ui_identifier": "RE_VALIDATE",
                    "action_buttons": {
                        "edit": false,
                        "save": false,
                        "cancel": false,
                        "resend": false,
                        "preview": false,
                        "download": false,
                        "save_draft": false
                    },
                    "stopCurrentFlow": true
                },
                "parameters": null,
                "resourceId": null,
                "sequential": false,
                "description": "Fill Missing Information",
                "preRequisite": {
                    "outputVariable": "miValidation",
                    "manage_missing_info_fields": true,
                    "preRequisiteValidationRules": [
                        {
                            "executor": "VALIDATION",
                            "canForced": false,
                            "parameters": {
                                "ruleId": "87825270-0475-4894-9dfc-95d7ca83e597",
                                "criteria": {
                                    "select": [
                                        "c_providers",
                                        "patient",
                                        "c_case_icd_codes_c_cases",
                                        "c_case_insurances_c_cases"
                                    ],
                                    "entity_name": "case",
                                    "related_entities": {
                                        "patient": {
                                            "select": [
                                                "first_name",
                                                "last_name",
                                                "date_of_birth",
                                                "gender_id",
                                                "ssn",
                                                "email",
                                                "c_patient_phones_patient"
                                            ],
                                            "related_entities": {
                                                "c_patient_phones_patient": {
                                                    "select": [
                                                        "phone_number"
                                                    ]
                                                }
                                            }
                                        },
                                        "c_providers": {
                                            "select": [
                                                "first_name",
                                                "last_name",
                                                "npi",
                                                "medicaid_ptan"
                                            ]
                                        },
                                        "c_case_insurances_c_cases": {
                                            "select": [
                                                "member_id",
                                                "effective_start_date",
                                                "effective_end_date",
                                                "subscriber_name",
                                                "payer_rank_id"
                                            ]
                                        }
                                    }
                                }
                            },
                            "description": null
                        }
                    ]
                },
                "candidateUsers": [],
                "taskTemplateId": 4,
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "missingInfoRelaySplit": {
                "next": null,
                "type": "cpRoute",
                "stepId": "missingInfoRelaySplit",
                "options": [
                    {
                        "next": "missinginfoCallRelay",
                        "condition": null
                    },
                    {
                        "next": "missingInfoFaxRelay",
                        "condition": null
                    }
                ],
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "missinginfoCallRelay": {
                "name": "Communicate MI Details",
                "next": "missingInfoRelayJoin",
                "type": "userTask",
                "stepId": "missinginfoCallRelay",
                "dueDate": "0",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "missingInfoFaxRelay": {
                "name": "Communicate MI Details",
                "next": "missingInfoRelayJoin",
                "incremental": false,
                "type": "userTask",
                "owner": null,
                "stepId": "missingInfoFaxRelay",
                "dueDate": "0",
                "formKey": null,
                "assignee": null,
                "listener": [],
                "priority": null,
                "group_name": "missingInfo",
                "identifier": {
                    "service_id": 1,
                    "template_id": 1298,
                    "ui_identifier": "SEND_COMMUNICATION_FAX",
                    "action_buttons": {
                        "edit": false,
                        "save": false,
                        "send": true,
                        "cancel": false,
                        "resend": false,
                        "preview": false,
                        "download": false,
                        "save_draft": false
                    }
                },
                "parameters": null,
                "resourceId": null,
                "sequential": false,
                "description": null,
                "preRequisite": null,
                "candidateUsers": [],
                "taskTemplateId": 9,
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "missingInfoRelayJoin": {
                "next": null,
                "type": "cpRoute",
                "stepId": "missingInfoRelayJoin",
                "default_path": "missingInfoRelaySplit2",
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "missingInfoRelaySplit2": {
                "next": null,
                "type": "cpRoute",
                "stepId": "missingInfoRelaySplit2",
                "options": [
                    {
                        "next": "missinginfoCallRelay2",
                        "condition": null
                    },
                    {
                        "next": "missinginfoCallRelay3",
                        "condition": null
                    }
                ],
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "missinginfoCallRelay2": {
                "name": "Communicate MI Details",
                "next": "missingInfoRelayJoin2",
                "type": "userTask",
                "stepId": "missinginfoCallRelay2",
                "dueDate": "2",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "missinginfoCallRelay3": {
                "name": "Communicate MI Details",
                "next": "missingInfoRelayJoin2",
                "type": "userTask",
                "stepId": "missinginfoCallRelay3",
                "dueDate": "2",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "missingInfoRelayJoin2": {
                "next": null,
                "type": "cpRoute",
                "stepId": "missingInfoRelayJoin2",
                "default_path": "missingInfoRelaySplit3",
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "missingInfoRelaySplit3": {
                "next": null,
                "type": "cpRoute",
                "stepId": "missingInfoRelaySplit3",
                "options": [
                    {
                        "next": "missinginfoCallRelay4",
                        "condition": null
                    },
                    {
                        "next": "missinginfoCallRelay5",
                        "condition": null
                    }
                ],
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "missinginfoCallRelay4": {
                "name": "Communicate MI Details",
                "next": "missingInfoRelayJoin3",
                "type": "userTask",
                "stepId": "missinginfoCallRelay4",
                "dueDate": "5",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "missinginfoCallRelay5": {
                "name": "Communicate MI Details",
                "next": "missingInfoRelayJoin3",
                "type": "userTask",
                "stepId": "missinginfoCallRelay5",
                "dueDate": "5",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "missingInfoRelayJoin3": {
                "next": null,
                "type": "cpRoute",
                "stepId": "missingInfoRelayJoin3",
                "default_path": "missingInfoParallelTasksJoin",
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "missingInfoParallelTasksJoin": {
                "next": "endMissingInfo",
                "type": "cpRoute",
                "stepId": "missingInfoParallelTasksJoin",
                "options": null,
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "endMissingInfo": {
                "next": null,
                "type": "end",
                "stepId": "endMissingInfo",
                "listener": [],
                "group_name": null,
                "description": "Conclude the Benefit Verification Process"
            }
        },
        "stepId": "missingInformationSubprocess",
        "listener": [],
        "group_name": null,
        "description": "Missing infromation Sub-Process",
        "incomingFlows": []
    },
    "t_missing_info": {
        "next": "benefitVerificationSubProcess",
        "type": "subprocess",
        "steps": {
            "tstartMissingInfo": {
                "next": "tupdateMIPendingStatus",
                "type": "start",
                "stepId": "tstartMissingInfo",
                "listener": [],
                "group_name": null,
                "description": "Initiate the Benefit Verification Process"
            },
            "tupdateMIPendingStatus": {
                "next": "tmanualMissingInfoTask",
                "type": "serviceTask",
                "stepId": "tupdateMIPendingStatus",
                "executor": "UPDATEENTITYEXECUTOR",
                "listener": [],
                "group_name": null,
                "identifier": null,
                "parameters": {
                    "resource": "case",
                    "entityData": {
                        "data": {
                            "id": "${caseId}",
                            "case_status_id": 2
                        },
                        "meta_data": {
                            "embedded": [
                                "case_status_id"
                            ],
                            "entity_name": "case"
                        }
                    },
                    "resource_id": "${caseId}"
                },
                "resourceId": null,
                "sequential": false,
                "description": null,
                "skipExpression": null,
                "loopCardinality": 0
            },
            "tmanualMissingInfoTask": {
                "name": "Review MI",
                "next": "tmissingInfoParallelTasks",
                "type": "userTask",
                "owner": null,
                "stepId": "tmanualMissingInfoTask",
                "dueDate": "0",
                "formKey": null,
                "assignee": null,
                "listener": [],
                "priority": null,
                "group_name": "missingInfo",
                "identifier": {
                    "entity_id": "32",
                    "entity_name": "case",
                    "layout_info": {
                        "layout_id": "679",
                        "layout_type": "EDIT_MODE"
                    },
                    "ui_identifier": "ENTITY_LAYOUT",
                    "action_buttons": {
                        "edit": false,
                        "save": false,
                        "cancel": false,
                        "resend": false,
                        "preview": false,
                        "download": false,
                        "save_draft": false
                    }
                },
                "parameters": null,
                "resourceId": null,
                "sequential": false,
                "description": null,
                "preRequisite": null,
                "candidateUsers": [],
                "taskTemplateId": 4,
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "tmissingInfoParallelTasks": {
                "next": null,
                "type": "pRoute",
                "stepId": "tmissingInfoParallelTasks",
                "options": [
                    {
                        "next": "tmissingInfoValidation",
                        "condition": null
                    },
                    {
                        "next": "tmissingInfoRelaySplit",
                        "condition": null
                    }
                ],
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "tmissingInfoValidation": {
                "name": "Capture MI Details Received",
                "next": "tmissingInfoParallelTasksJoin",
                "type": "userTask",
                "owner": null,
                "stepId": "tmissingInfoValidation",
                "dueDate": "2",
                "formKey": null,
                "assignee": null,
                "listener": [],
                "priority": null,
                "group_name": "missingInfo",
                "identifier": {
                    "entity_id": "32",
                    "entity_name": "case",
                    "layout_info": {
                        "layout_id": "53",
                        "layout_type": "EDIT_MODE"
                    },
                    "action_buttons": {
                        "edit": false,
                        "save": false,
                        "cancel": false,
                        "resend": false,
                        "preview": false,
                        "download": false,
                        "save_draft": false
                    },
                    "stopCurrentFlow": true
                },
                "parameters": null,
                "resourceId": null,
                "sequential": false,
                "description": "Fill Missing Information",
                "candidateUsers": [],
                "taskTemplateId": 4,
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "tmissingInfoRelaySplit": {
                "next": null,
                "type": "cpRoute",
                "stepId": "tmissingInfoRelaySplit",
                "options": [
                    {
                        "next": "tmissinginfoCallRelay",
                        "condition": null
                    },
                    {
                        "next": "tmissingInfoFaxRelay",
                        "condition": null
                    }
                ],
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "tmissinginfoCallRelay": {
                "name": "Communicate MI Details",
                "next": "tmissingInfoRelayJoin",
                "type": "userTask",
                "stepId": "tmissinginfoCallRelay",
                "dueDate": "0",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "tmissingInfoFaxRelay": {
                "name": "Communicate MI Details",
                "next": "tmissingInfoRelayJoin",
                "incremental": false,
                "type": "userTask",
                "owner": null,
                "stepId": "tmissingInfoFaxRelay",
                "dueDate": "0",
                "formKey": null,
                "assignee": null,
                "listener": [],
                "priority": null,
                "group_name": "missingInfo",
                "identifier": {
                    "service_id": 1,
                    "template_id": 1298,
                    "ui_identifier": "SEND_COMMUNICATION_FAX",
                    "action_buttons": {
                        "edit": false,
                        "save": false,
                        "send": true,
                        "cancel": false,
                        "resend": false,
                        "preview": false,
                        "download": false,
                        "save_draft": false
                    }
                },
                "parameters": null,
                "resourceId": null,
                "sequential": false,
                "description": null,
                "preRequisite": null,
                "candidateUsers": [],
                "taskTemplateId": 9,
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "tmissingInfoRelayJoin": {
                "next": null,
                "type": "cpRoute",
                "stepId": "tmissingInfoRelayJoin",
                "default_path": "tmissingInfoRelaySplit2",
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "tmissingInfoRelaySplit2": {
                "next": null,
                "type": "cpRoute",
                "stepId": "tmissingInfoRelaySplit2",
                "options": [
                    {
                        "next": "tmissinginfoCallRelay2",
                        "condition": null
                    },
                    {
                        "next": "tmissinginfoCallRelay3",
                        "condition": null
                    }
                ],
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "tmissinginfoCallRelay2": {
                "name": "Communicate MI Details",
                "next": "tmissingInfoRelayJoin2",
                "type": "userTask",
                "stepId": "tmissinginfoCallRelay2",
                "dueDate": "2",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "tmissinginfoCallRelay3": {
                "name": "Communicate MI Details",
                "next": "tmissingInfoRelayJoin2",
                "type": "userTask",
                "stepId": "tmissinginfoCallRelay3",
                "dueDate": "2",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "tmissingInfoRelayJoin2": {
                "next": null,
                "type": "cpRoute",
                "stepId": "tmissingInfoRelayJoin2",
                "default_path": "tmissingInfoRelaySplit3",
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "tmissingInfoRelaySplit3": {
                "next": null,
                "type": "cpRoute",
                "stepId": "tmissingInfoRelaySplit3",
                "options": [
                    {
                        "next": "tmissinginfoCallRelay4",
                        "condition": null
                    },
                    {
                        "next": "tmissinginfoCallRelay5",
                        "condition": null
                    }
                ],
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "tmissinginfoCallRelay4": {
                "name": "Communicate MI Details",
                "next": "tmissingInfoRelayJoin3",
                "type": "userTask",
                "stepId": "tmissinginfoCallRelay4",
                "dueDate": "5",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "tmissinginfoCallRelay5": {
                "name": "Communicate MI Details",
                "next": "tmissingInfoRelayJoin3",
                "type": "userTask",
                "stepId": "tmissinginfoCallRelay5",
                "dueDate": "5",
                "listener": [],
                "group_name": "missingInfo",
                "identifier": {},
                "parameters": null,
                "sequential": false,
                "taskTemplateId": 2,
                "description": "Relay the results via call",
                "candidateUsers": [],
                "candidateGroups": [],
                "loopCardinality": 0
            },
            "tmissingInfoRelayJoin3": {
                "next": null,
                "type": "cpRoute",
                "stepId": "tmissingInfoRelayJoin3",
                "default_path": "tmissingInfoParallelTasksJoin",
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "tmissingInfoParallelTasksJoin": {
                "next": "tendMissingInfo",
                "type": "cpRoute",
                "stepId": "tmissingInfoParallelTasksJoin",
                "options": null,
                "listener": [],
                "group_name": null,
                "description": "To create task based on insurance benefit type"
            },
            "tendMissingInfo": {
                "next": null,
                "type": "end",
                "stepId": "tendMissingInfo",
                "listener": [],
                "group_name": null,
                "description": "Conclude the Benefit Verification Process"
            }
        },
        "stepId": "tmissingInformationSubprocess",
        "listener": [],
        "group_name": null,
        "description": "Missing infromation Sub-Process",
        "incomingFlows": []
    }
}


