"use client"
import { useEffect, useRef, useState } from "react"
import ConfigGroupItem from "./config-group-item.component"
import type { ConfigGroup } from "@/app/_common/models"
import { ConfigGroupService } from "../../_services/config-group.service"
import { ModalDelete } from "@/app/_common/components/modal/modal-delete.component"
import { Toast } from "primereact/toast"
import { Modal } from "@/app/_common/components/modal/modal.component"
import { ConfigGroupForm } from "../form/config-group-form.component"
import ConfigGroupFilter from "./config-group-filter.component"
import { ProgressBar } from "primereact/progressbar"

function ConfigGroup({ name, activeTab }: { name: string; activeTab: string }) {
  const [groups, setGroups] = useState<ConfigGroup[]>([])
  const [groupsFiltered, setGroupsFiltered] = useState<ConfigGroup[]>([])
  const [formDialog, setFormDialog] = useState(false)
  const [deleteRowDialog, setDeleteRowDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<ConfigGroup>()
  const toast = useRef<Toast>(null)

  useEffect(() => {
    ConfigGroupService.groups().then((groups) => {
      setGroups(groups)
      setGroupsFiltered(groups)
    })
  }, [activeTab])

  const deleteGroup = () => {
    if (selectedGroup?.id) {
      setLoading(true)
      ConfigGroupService.deleteById(selectedGroup.id).then((res) => {
        if ("error" in res) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: `${(res as any)?.error || "no results"}`,
            life: 10000,
          })
        } else {
          toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: `${res.title} Deleted`,
            life: 3000,
          })
          const newGroups = groups.filter(
            (group) => group.id != selectedGroup.id
          )
          setGroups([...newGroups])
          const newGroupsFiltered = groupsFiltered.filter(
            (group) => group.id != selectedGroup.id
          )
          setGroupsFiltered([...newGroupsFiltered])
        }
        setLoading(false)
        setDeleteRowDialog(false)
      })
    }
  }

  const search = (event: any) => {
    const keyword = event?.target?.value.toLocaleLowerCase() || ""
    const filtered = keyword
      ? groups.filter(
          (group) =>
            group.title.toLocaleLowerCase().includes(keyword) ||
            group?.configs?.find(
              (config) =>
                config.name.toLocaleLowerCase().includes(keyword) ||
                config.title.toLocaleLowerCase().includes(keyword) ||
                config.description.toLocaleLowerCase().includes(keyword)
            )
        )
      : groups
    setGroupsFiltered([...filtered])
  }

  const bgIcons = ["#22C55E", "#FFC837", "#2DD4BF", "#ff784b", "#936DFF"]
  let letterBefore = ""
  let idxBg = 0
  return (
    <div
      id="tab2"
      className={`tab-pane px-6  ${name === activeTab && "active"}`}
    >
      <h3 className="text-2xl font-bold text-bgray-900 dark:text-white mb-5">
        Configuration Group
      </h3>
      <ConfigGroupFilter onGlobalFilter={search} />
      {loading && (
        <ProgressBar
          mode="indeterminate"
          className="h-0.5 -mt-0.5 absolute w-full"
        />
      )}
      <div className="space-y-5 mt-6">
        {groupsFiltered?.map((group) => {
          const letter = group.title.slice(0, 1)

          if (letter != letterBefore && letterBefore) {
            idxBg = idxBg + 1 >= bgIcons.length ? 0 : idxBg + 1
          }
          const bg = bgIcons[idxBg]
          letterBefore = letter
          return (
            <ConfigGroupItem
              group={group}
              setSelectedGroup={setSelectedGroup}
              setDeleteRowDialog={setDeleteRowDialog}
              setFormDialog={setFormDialog}
              key={`group-${group.id}`}
              letter={letter}
              bg={bg}
            />
          )
        })}
      </div>
      <Toast ref={toast} />
      <Modal
        visible={formDialog}
        header="Edit Group"
        onHide={() => setFormDialog(false)}
      >
        <ConfigGroupForm
          setFormDialog={setFormDialog}
          model={selectedGroup}
          groups={groups}
          setGroups={setGroups}
          groupsFiltered={groupsFiltered}
          setGroupsFiltered={setGroupsFiltered}
        />
      </Modal>
      <ModalDelete
        visible={deleteRowDialog}
        onHide={() => setDeleteRowDialog(false)}
        eventConfirm={deleteGroup}
        loading={loading}
      >
        Are you sure you want to delete the group <b>{selectedGroup?.title}</b>?
      </ModalDelete>
    </div>
  )
}
export default ConfigGroup
