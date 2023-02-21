// drag and drop часть кода от crm-system

import React, { Fragment } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import { usePutRequest } from '../hooks/request'
import { LEAD_MOVE } from '../urls'
import LeadBoardColumn from './LeadBoardColumn'
import Loader from './common/Loader'
import { changePositionAndColumn } from '../utils/board'
import { useModal } from '../hooks/modal'
import ProjectCreate from './ProjectCreate'


export default function LeadBoard({ columns, onUpdate, onReloadStatues, leads }) {
    const moveLead = usePutRequest()
    const acceptedColumn = find(columns, (item) => item.type === 'accepted') || {}

    async function reloadLeads(data) {
        onReloadStatues()
        leads.setResponse(data)
    }


    const [showCreteProject, closeCreateProject] = useModal((props) => (
        <ProjectCreate
            customer={props.lead.customer}
            lead={props.lead}
            onCancel={() => closeCreateProject()}
            onSuccess={async () => {
                await props.onSuccess()
                await leads.reload()
            }} />
    ))

    async function moveLeadRequest(results, data, leadId) {
        leads.setResponse({ results })
        await moveLead.request({ url: LEAD_MOVE.replace('{id}', leadId), data })
    }

    async function onDragEnd({ source, destination, draggableId: leadId }) {
        if (!destination) return

        const lead = find(leads.response.results, (item) => item.id === Number(leadId))

        // update status
        const results = changePositionAndColumn(leads.response.results, leadId, source, destination)

        const data = { position: destination.index + 1, status: Number(destination.droppableId) }

        if (acceptedColumn.id === Number(destination.droppableId) && !lead.project) {
            showCreteProject({
                lead,
                onSuccess: async () => {
                    await moveLeadRequest(results, data, leadId)
                },
            })

            return
        }

        await moveLeadRequest(results, data, leadId)
        onReloadStatues()
    }

    async function onDelete(leadId) {
        onReloadStatues()
        const results = leads.response.results.filter((lead) => lead.id !== leadId)
        // eslint-disable-next-line no-param-reassign
        leads.setResponse({ count: leads.response.count -= 1, results })
    }

    return (
        <Fragment>
            <span className="is-size-4">Лиды</span><br /><br />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="columns">
                    {columns.map((column) => (
                        <div key={column.id} className="column">
                            <LeadBoardColumn
                                columnKey={column.id}
                                leads={sortBy(filter(
                                    leads.response ? leads.response.results : [],
                                    { status: column.id },
                                ), 'position')}
                                leadsAll={leads}
                                column={column}
                                onDelete={onDelete}
                                onCreate={reloadLeads}
                                onUpdate={onUpdate}
                                lineColor={column.color} />
                        </div>
                    ))}
                </div>
            </DragDropContext>

            <Loader show={leads.loading} center large />

            <div ref={leads.ref} className="has-text-grey-light is-italic has-text-centered">
                {!leads.hasMore && !leads.loading && leads.length !== 0 ? 'Загрузили все проекты' : ''}
            </div>
        </Fragment>
    )
}
