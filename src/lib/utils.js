export function fmtPrice(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

export function openWA(waNumber, message) {
  const num = (waNumber || '6281234567890').replace(/\D/g, '')
  window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank')
}

export function cls(...args) {
  return args.filter(Boolean).join(' ')
}
