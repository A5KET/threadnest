export function formatDate(date: Date) {
    return {
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
}