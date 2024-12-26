export function formatDate(date: Date | string) {
    return {
        date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        time: new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
}