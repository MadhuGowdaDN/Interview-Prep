// @common/utils/dateUtils.js
export const formatDate = (date, format = 'YYYY-MM-DD') => {
    if (!date) return 'N/A';

    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    const options = {
        'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' },
        'MMM DD, YYYY': { year: 'numeric', month: 'short', day: 'numeric' },
        'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
        'full': { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    };

    return d.toLocaleDateString('en-US', options[format] || options['YYYY-MM-DD']);
};