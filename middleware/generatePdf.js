const PDFDocument = require('pdfkit');
const fs = require('fs');
const Path = require('path');

const dirPath = Path.resolve(__dirname, '../public/report');

module.exports = function (user){

    // creating the directory...
    if(!fs.existsSync(dirPath)){
        fs.mkdir(dirPath, (err)=>{
            if(err) throw err;
        });
    }

// setting the pdf Document
const doc = new PDFDocument({
    font: "Courier",
    size: "A4",
    margins: {
        top: 40,
        bottom: 50,
        left: 20,
        right: 20
    }
});

// piping the response to the report file...
doc.pipe(fs.createWriteStream(Path.join(dirPath , 'report.pdf')));


// First section of information...
doc
.fontSize(10)
.text(`Created At : ${user.date}`,{
    align: 'right'
})
.moveDown(2.5)
.fontSize(22)
.fillColor('blue')
.text(`Hey ${user.patient.userName}! This is your health card report.`,{
    align : 'justify'
})
.moveDown(1.2)

// Second section of information...
doc
.fillColor('black')
.fontSize(20)
.text("Health Status" ,{
    align: "center"
})
.moveDown(0.7)
.fontSize(13)
.text("Cholesterol : Good",{align : 'center'})
.moveDown(0.5)
.text("Sugar Level : Moderate",{align : 'center'})
.moveDown(0.5)
.text("Glucose Level : Average",{align : 'center'})
.moveDown(0.5)
.text("Blood Pressure : Low",{align : 'center'})
.moveDown(1)
.fontSize(10)
.fillColor("green")
.text('Overall Report : Good',{align : 'center'})
.moveDown(3)

// Third section of information...
doc
.fontSize(16)
.fillColor('black')
.text("1) Follow doctor's instructions and check your health regularly.")
.moveDown(0.5)
.text("2) Get a better health and get a better health score")
.moveDown(0.5)
.text('3) Complete Your checkup tests')
.moveDown(2.8)

// bottom line text...
doc
.fontSize(18)
.fillColor('darkblue')
.text(`We have mailed your some heathTips at your mail id [${user.patient.userEmail}]; Wish You Health!.` ,{align : 'center'})

// finishing up writing the pdf.
doc.end();

}


// done 
