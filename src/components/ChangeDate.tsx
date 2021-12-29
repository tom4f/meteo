
export const ChangeDate = (dateType: string, dateObj: Date, interval: string, direction: -1 | 1) => {
    let start: Date;
    switch (dateType) {
        case 'daily' : start = new Date(2012,7,22);
        break;
        case 'yearSum' : start = new Date(2000,10,20);
        break;
        case 'davisStat' : start = new Date(2012,9,1);
        break;
        default: start = new Date()
    }
  
    const now  = new Date();
    let newDate: Date;
    switch (interval) {
        case 'day'   : newDate = new Date( dateObj.setDate( dateObj.getDate() + direction ) );
        break;
        case 'month' : newDate = new Date( dateObj.setMonth( dateObj.getMonth() + direction ) );
        break;
        case 'year'  : newDate = new Date( dateObj.setFullYear( dateObj.getFullYear() + direction ) );
        break;
        default: newDate = new Date()
    }
    
    if (direction === -1) return start < newDate ? newDate : start

    if (direction === +1) return now > newDate ? newDate : now 

    return now
}