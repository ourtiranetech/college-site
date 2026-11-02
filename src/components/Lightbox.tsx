type LightboxProps = {
  src: string
  alt?: string
  open: boolean
  onClose: () => void
}

export function Lightbox({ src, alt = '', open, onClose }: LightboxProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
