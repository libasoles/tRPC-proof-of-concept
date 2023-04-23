import { SyntheticEvent, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import RejectionReasons from "@/components/Candidates/RejectionReasons";
import { queryClient, trpc } from "@/api";
import { Candidate } from "#/types";
import { getQueryKey } from "@trpc/react-query";

const useReasonModal = () => {
    const [displayReasons, setDisplayReasons] = useState(false)
    const [preselectedReasons, setPreselectedReasons] = useState<number[]>([])
    const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null)

    const onAddReason = useCallback((candidate: Candidate) => {
        setDisplayReasons(true)
        setPreselectedReasons(candidate.reason.map(({ id }) => id))
        setCurrentCandidate(candidate)
    }, [])

    const mutation = trpc.candidates.updateReasons.useMutation()

    const onSelectReason = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
        if (!currentCandidate) return

        const value = Number(e.currentTarget.value)

        const updatedReasons = preselectedReasons.filter(reason => reason !== value)

        if (e.currentTarget.checked) updatedReasons.push(value)

        setPreselectedReasons(updatedReasons);

        mutation.mutate({ candidateId: currentCandidate.id, reasonIds: updatedReasons })
    }, [mutation, preselectedReasons, currentCandidate])

    const onClose = useCallback((e: SyntheticEvent) => {
        const shouldDismiss = !HTMLButtonElement.prototype.isPrototypeOf(e.target) && (e.target as HTMLButtonElement).getAttribute("role") !== "button"
        if (shouldDismiss) return

        setDisplayReasons(false)

        queryClient.invalidateQueries(getQueryKey(trpc.candidates.all))
    }, [])

    const ReasonModal = () => createPortal(
        <RejectionReasons
            preselectedReasons={preselectedReasons}
            onSelectReason={onSelectReason}
            onClose={onClose}
        />
        , document.body)

    return {
        onAddReason,
        displayReasons,
        ReasonModal
    }
}

export default useReasonModal
