import Modal from './Modal'

interface Props {
  open: boolean
  title: string
  message: string
  confirmText?: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open, title, message, confirmText = 'Delete', busy, onConfirm, onCancel,
}: Props) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn btn-secondary" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy ? 'Please wait...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}