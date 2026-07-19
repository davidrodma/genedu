"use client"
import {
  DataTableCustom,
  useDataTableCustomContext,
} from "@/app/_common/components/datatable"
import { Columns } from "./content-datatable-columns.component"
import { Modal } from "@/app/_common/components/modal/modal.component"
import { useEffect, useRef, useState, useCallback } from "react"
import { Content } from "@/app/_common/models/content/content.model"
import { FiltersForm } from "./content-filters-form.component"
import { useHeaderContext } from "@/app/_common/contexts/header.context"
import { Toast } from "primereact/toast"
import { contentStatusArray } from "@/app/_common/models"
import { useRouter } from "next/navigation"
import { _routes } from "@/app/(admin)/_configs/_routes"
import { ContentService } from "../../_services/content.service"
import { ContentForm } from "../form/content-form.component"
import { ContentStatus } from "@/app/_common/models/content/content-status.enum"

type Model = Content

export const ContentDatatable = () => {
  const { setHeaderInfo } = useHeaderContext()
  const toast = useRef<Toast>(null)
  const router = useRouter()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setHeaderInfo("Contents", "Contents of instructional materials")
  }, [setHeaderInfo])

  const [formDialog, setFormDialog] = useState<boolean>(false)
  const { row, setRow, rows, setRows } = useDataTableCustomContext<Model>()

  const openNew = () => {
    setRow(undefined)
    setFormDialog(true)
  }

  const openEdit = (row: Model) => {
    setRow({
      ...row,
    })
    setFormDialog(true)
  }

  // Função para verificar se há registros em andamento
  const hasInProgressRecords = useCallback((currentRows: Model[]): boolean => {
    return currentRows.some(
      (content) => content.status < ContentStatus.COMPLETED
    )
  }, [])

  // Função para buscar registros atualizados do backend
  const checkForUpdates = useCallback(async () => {
    if (!rows || rows.length === 0) return

    try {
      // Busca todos os registros que estão em andamento
      const inProgressContents = rows.filter(
        (content) => content.status < ContentStatus.COMPLETED
      )

      if (inProgressContents.length === 0) {
        // Para a verificação se não há mais registros em andamento
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          console.log("Status checking stopped - no more in-progress records")
        }
        return
      }

      // Busca os registros atualizados do backend
      const updatedContents = await Promise.all(
        inProgressContents.map(async (content) => {
          try {
            if (!content.id) return content
            const updatedContent = await ContentService.findById(content.id)
            return updatedContent
          } catch (error) {
            console.error(`Error fetching content ${content.id}:`, error)
            return content // Retorna o original em caso de erro
          }
        })
      )

      // Verifica se houve mudanças e atualiza o array rows
      let hasChanges = false
      const newRows = [...rows]

      updatedContents.forEach((updatedContent: Content) => {
        if (!updatedContent) return

        const currentIndex = newRows.findIndex(
          (content) => content.id === updatedContent.id
        )

        if (currentIndex !== -1) {
          const currentContent = newRows[currentIndex]

          // Verifica se houve mudança de status ou outros campos relevantes
          if (
            currentContent.status !== updatedContent.status ||
            currentContent.lastStatus !== updatedContent.lastStatus ||
            currentContent.messageError !== updatedContent.messageError ||
            currentContent.textContent?.textFile !==
              updatedContent.textContent?.textFile ||
            currentContent.presentation?.presentationFile !== updatedContent.presentation?.presentationFile
          ) {
            console.log(
              `Content ${updatedContent.id} status changed from ${currentContent.status} to ${updatedContent.status}`
            )
            newRows[currentIndex] = updatedContent
            hasChanges = true
          }
        }
      })

      // Atualiza o estado se houve mudanças
      if (hasChanges) {
        setRows(newRows)
        console.log("Rows updated with new status information")
      }
    } catch (error) {
      console.error("Error checking for updates:", error)
    }
  }, [rows, setRows])

  // Inicia/para a verificação periódica baseado no status dos registros
  useEffect(() => {
    if (!rows || rows.length === 0) return

    const hasInProgress = hasInProgressRecords(rows)

    if (hasInProgress && !intervalRef.current) {
      // Inicia a verificação a cada 5 segundos
      intervalRef.current = setInterval(checkForUpdates, 5000)
      console.log("Status checking started - monitoring in-progress records")
    } else if (!hasInProgress && intervalRef.current) {
      // Para a verificação se não há mais registros em andamento
      clearInterval(intervalRef.current)
      intervalRef.current = null
      console.log("Status checking stopped - no more in-progress records")
    }

    // Cleanup ao desmontar o componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [rows, hasInProgressRecords, checkForUpdates])

  return (
    <>
      <Toast ref={toast} />
      <DataTableCustom<Model>
        columns={Columns()}
        paginateRequest={ContentService.paginate}
        statusRequest={ContentService.status}
        deleteRequest={ContentService.delete}
        eventNew={openNew}
        eventEdit={openEdit}
        FiltersFormTemplate={<FiltersForm />}
        showStatusSwitch={false}
        statusArray={contentStatusArray}
        addMenusRow={[
          {
            label: "Documents",
            icon: "pi pi-file-pdf",
            command: () => {
              if (row?.id) {
                router.push(`${_routes.documents}/${row.id}`)
              }
            },
          },
        ]}
      />
      <Modal
        visible={formDialog}
        header="Content Details"
        onHide={() => setFormDialog(false)}
      >
        <ContentForm setFormDialog={setFormDialog} model={row} toast={toast} />
      </Modal>
    </>
  )
}
