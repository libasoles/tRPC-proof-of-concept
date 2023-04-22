
import { ChangeEventHandler, SyntheticEvent } from "react"
import { trpc } from "@/api"
import "./RejectionReasons.css"

type Props = {
    preselectedReasons: number[]
    onSelectReason: ChangeEventHandler<HTMLInputElement>
    onClose: (e: SyntheticEvent) => void
}

export const RejectionReasons = ({ preselectedReasons, onSelectReason, onClose }: Props) => {
    const reasons = trpc.rejectionReasons.all.useQuery().data || []

    return (
        <div className="overlay" onClick={onClose} role="button" aria-label="close">
            <div className="modal-box" role="dialog" aria-modal="true">
                <div className="modal-header">
                    <h3 className="modal-title">Razones de rechazo</h3>

                    <button className="modal-close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="reasons">
                        {reasons.map((reason) => {
                            const isSelected = preselectedReasons.includes(reason.id)

                            return (
                                <label key={reason.id} className="pill">
                                    <input checked={isSelected} type="checkbox" name="reason" value={reason.id} onChange={onSelectReason} />
                                    {reason.description}
                                </label>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RejectionReasons
