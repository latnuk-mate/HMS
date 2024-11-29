const moment= require('moment');

const d = new Date(); // default current date..
const style = "MMMM Do YYYY";  // default fomatter...

module.exports = {
       formatDate: function (date= d, format = style){
                        return moment(date).format(format);
                   },

        formatTime: (time)=>{
                let [hour, minute] = time.split(':');
                if(hour > 12){
                        hour -= 12;
                }
                if(hour < 12){
                        if(hour == 0){
                                hour = 12;
                        }
                }
                return `${hour}:${minute}`;
        },

        AppointmentChecker: (date)=>{
                        // Get the current date
                        const currentDate = new Date();

                        // week range from sunday to saturday...     
                        const startOfWeek = new Date(currentDate);
                        startOfWeek.setHours(0, 0, 0, 0);
                        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                    
                        const endOfWeek = new Date(currentDate);
                        endOfWeek.setHours(23, 59, 59, 999);
                        endOfWeek.setDate(startOfWeek.getDate() + 6);

                        if (typeof date === 'string') {
                                date = new Date(date);
                            }
                
                            date.setHours(0, 0, 0, 0);
                    
                        return date >= startOfWeek && date <= endOfWeek;
                
        },

        calculateAge : (birthday)=>{
                const [year, month, day] = birthday.split('-').map(Number);
    
                // Get current date
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;
            
                let age = currentYear - year;
            
                if (currentMonth < month || (currentMonth === month && currentDate.getDate() < day)) {
                    age--;
                }

                return age;
        },
}

