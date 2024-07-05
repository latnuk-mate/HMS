const moment= require('moment');

const d = new Date(); // default current date..
const style = "MMMM Do YYYY";  // default fomatter...

module.exports = {
       formatDate: function (date= d, format = style){
                        return moment(date).format(format);
                   },

        formatTime: (time)=>{
                let meridian;
                let [hour, minute] = time.split(':');
                if(hour > 12){
                        meridian = "PM";
                        hour -= 12;
                }
                if(hour < 12){
                        meridian = "AM";
                        if(hour == 0){
                                hour = 12;
                        }
                }
                return `${hour}:${minute} ${meridian}`;
        },

        AppointmentChecker: (date)=>{
                        // Get the current date
                        const currentDate = new Date();
                
                        const startOfWeek = new Date(currentDate);
                        startOfWeek.setHours(0, 0, 0, 0);
                        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                    
                        const endOfWeek = new Date(currentDate);
                        endOfWeek.setHours(23, 59, 59, 999);
                        endOfWeek.setDate(startOfWeek.getDate() + 6);
                    
                        return date >= startOfWeek && date <= endOfWeek;
                
        }
}
