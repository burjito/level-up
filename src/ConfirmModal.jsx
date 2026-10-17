// Branded confirmation dialog 
export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" onClick={onCancel}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-white/80 p-4 backdrop-blur-md">
      <div onClick={(e) => e.stopPropagation()} className="glass relative w-full max-w-md animate-pop overflow-hidden rounded-[2rem] p-8 text-center motion-reduce:animate-none">
        <img src="/elements/star-red.webp" alt="" aria-hidden className="absolute -right-5 -top-5 w-20 rotate-12" />
        <img src="/elements/star-orange.webp" alt="" aria-hidden className="absolute -bottom-4 -left-4 w-16 -rotate-12" />
        <h2 id="confirm-title" className="relative font-display text-3xl text-poster-red">{title}</h2>
        <p id="confirm-message" className="relative mt-3 text-ink/70">{message}</p>
        <div className="relative mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button onClick={onCancel} autoFocus className="btn-ghost">{cancelLabel}</button>
          <button onClick={onConfirm} className="btn bg-poster-red text-white shadow-[0_5px_0_#8a0000] hover:brightness-110">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
